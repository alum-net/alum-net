import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import {
  useConversations,
  useMessages,
  useSendMessage,
  useStomp,
  ConversationSummary,
  getOrCreateConversation,
  searchAvailableUsers,
  MESSAGING_CONSTANTS,
  markMessagesAsRead,
  ReadReceipt,
  MessageDTO,
  MessagePage,
} from '@alum-net/messaging';
import { useUserInfo } from '@alum-net/users/src/hooks/useUserInfo';
import { UserRole } from '@alum-net/users/src/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@alum-net/api';
import { Toast } from '@alum-net/ui';
import ConversationsList from '../features/messages/components/conversations-list';
import UserSearch from '../features/messages/components/user-search';
import ChatView from '../features/messages/components/chat-view';
import MessageInput from '../features/messages/components/message-input';

export default function MessagesPage() {
  const router = useRouter();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();
  const { isConnected, subscribe, send } = useStomp();
  const { data: userInfo, isLoading: isLoadingUserInfo } = useUserInfo();
  const currentUserEmail = userInfo?.email || '';
  const isTeacher = userInfo?.role === UserRole.teacher;
  const { data: conversations, isLoading, error } = useConversations();

  if (!isTeacher) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text variant="headlineSmall" style={styles.title}>
            Mensajes
          </Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            No tienes permisos para acceder a esta sección
          </Text>
        </View>
      </View>
    );
  }

  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: [QUERY_KEYS.searchAvailableUsers, searchQuery],
    queryFn: () => searchAvailableUsers(searchQuery.trim() || undefined),
    enabled: searchQuery.trim().length >= 2,
    staleTime: 30_000,
  });

  const { data: messagesData, isLoading: isLoadingMessages, error: messagesError } =
    useMessages({
      conversationId: selectedConversation,
      isConnected,
      subscribe,
    });

  useEffect(() => {
    if (selectedConversation && isConnected) {
      const timeoutId = setTimeout(() => {
        markMessagesAsRead(selectedConversation).catch(() => {});
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [selectedConversation, isConnected]);

  const handleMarkAsRead = useCallback(() => {
    if (selectedConversation && isConnected) {
      markMessagesAsRead(selectedConversation).catch(() => {});
    }
  }, [selectedConversation, isConnected]);

  const handleNewMessage = useCallback((newMessage: MessageDTO, conversationId: string) => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.getConversations] });
    queryClient.refetchQueries({ queryKey: [QUERY_KEYS.getConversations] });
    
    if (conversationId === selectedConversation) {
      queryClient.setQueryData(
        [QUERY_KEYS.getMessages, conversationId],
        (previousMessagesData: MessagePage | undefined) => {
          if (!previousMessagesData) return previousMessagesData;

          const messageAlreadyExists = previousMessagesData.items.some(
            (existingMessage: MessageDTO) => existingMessage.id === newMessage.id
          );

          if (messageAlreadyExists) return previousMessagesData;

          return {
            ...previousMessagesData,
            items: [...previousMessagesData.items, newMessage],
          };
        }
      );
    }
  }, [queryClient, selectedConversation]);

  useEffect(() => {
    if (!isConnected || !conversations || conversations.length === 0) return;

    const messageUnsubscribes = conversations.map((conversation: ConversationSummary) => {
      const messagesDestination = MESSAGING_CONSTANTS.WS.SUBSCRIBE_MESSAGES(conversation.id);

      return subscribe(
        messagesDestination,
        (newMessage: MessageDTO) => {
          handleNewMessage(newMessage, conversation.id);
        }
      );
    });

    return () => {
      messageUnsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, [isConnected, conversations, subscribe, handleNewMessage]);

  const handleReadReceipt = useCallback((readReceipt: ReadReceipt, conversationId: string) => {
    if (readReceipt.readByUser !== currentUserEmail) {
      queryClient.setQueryData(
        [QUERY_KEYS.getMessages, conversationId],
        (previousMessagesData: MessagePage | undefined) => {
          if (!previousMessagesData) return previousMessagesData;

          return {
            ...previousMessagesData,
            items: previousMessagesData.items.map((message: MessageDTO) => ({
              ...message,
              read: message.author === currentUserEmail ? true : message.read,
            })),
          };
        }
      );
    }
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.getConversations] });
  }, [queryClient, currentUserEmail]);

  useEffect(() => {
    if (!isConnected || !conversations || conversations.length === 0) return;

    const readReceiptUnsubscribes = conversations.map((conversation: ConversationSummary) => {
      const readReceiptDestination = MESSAGING_CONSTANTS.WS.SUBSCRIBE_READ(conversation.id);

      return subscribe(
        readReceiptDestination,
        (readReceipt: ReadReceipt) => {
          handleReadReceipt(readReceipt, conversation.id);
        }
      );
    });

    return () => {
      readReceiptUnsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, [isConnected, conversations, subscribe, handleReadReceipt]);

  const { sendMessage, isSending } = useSendMessage({
    conversationId: selectedConversation,
    isConnected,
    send,
  });

  const [messageText, setMessageText] = useState('');

  const handleSelectUser = async (userEmail: string) => {
    try {
      const conversationId = await getOrCreateConversation(userEmail);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.getConversations] });
      setSelectedConversation(conversationId);
      setSearchQuery('');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      Toast.error(`Error al crear conversación: ${errorMessage}`);
    }
  };

  const handleSelectExistingConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);
    setSearchQuery('');
  };

  const handleSendMessage = () => {
    const message = messageText.trim();

    if (message.length === 0) {
      return;
    }

    if (isSending) {
      return;
    }

    if (!selectedConversation) {
      Toast.error('Selecciona una conversación primero');
      return;
    }

    if (message.length > MESSAGING_CONSTANTS.MAX_MESSAGE_LENGTH) {
      Toast.error(
        `El mensaje no puede superar los ${MESSAGING_CONSTANTS.MAX_MESSAGE_LENGTH} caracteres`
      );
      return;
    }

    try {
      sendMessage(message);
      setMessageText('');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.getConversations] });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';

      if (errorMessage === 'WebSocket no conectado') {
        Toast.error(
          'No se pudo conectar al servidor. El sistema intentará reconectar automáticamente. Por favor, espera unos segundos e intenta enviar nuevamente.'
        );
      } else {
        Toast.error(`Error al enviar el mensaje: ${errorMessage}`);
      }
    }
  };

  const conversationTitle =
    conversations?.find((conversation: ConversationSummary) => conversation.id === selectedConversation)
      ?.otherParticipantName || 'Conversación';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          Mensajes
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.sidebar}>
          <View style={styles.sidebarHeader}>
            <Text style={styles.sidebarTitle}>Conversaciones</Text>
          </View>

          <UserSearch
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchResults={searchResults}
            isSearching={isSearching}
            conversations={conversations}
            currentUserEmail={currentUserEmail}
            onSelectUser={handleSelectUser}
            onSelectExistingConversation={handleSelectExistingConversation}
          />

          <ConversationsList
            conversations={conversations}
            isLoading={isLoading}
            error={error}
            selectedConversation={selectedConversation}
            onSelectConversation={setSelectedConversation}
          />
        </View>

        <View style={styles.mainArea}>
          {selectedConversation ? (
            <>
              <ChatView
                messages={messagesData?.items}
                isLoading={isLoadingMessages}
                error={messagesError}
                currentUserEmail={currentUserEmail}
                conversationTitle={conversationTitle}
                conversationId={selectedConversation}
                isConnected={isConnected}
                onMarkAsRead={handleMarkAsRead}
                subscribe={subscribe}
              />
              <MessageInput
                messageText={messageText}
                onMessageChange={setMessageText}
                onSend={handleSendMessage}
                isSending={isSending}
                isDisabled={!selectedConversation}
                conversationId={selectedConversation}
                isConnected={isConnected}
                send={send}
                onMarkAsRead={handleMarkAsRead}
              />
            </>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                Selecciona una conversación para ver los mensajes
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: '700',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 350,
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  sidebarHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  sidebarTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  mainArea: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});
