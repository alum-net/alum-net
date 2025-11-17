import React, {
  useRef,
  useEffect,
  useCallback,
  useState,
  useMemo,
} from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { Text, ActivityIndicator, Appbar } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@alum-net/api';
import { useUserInfo } from '@alum-net/users';
import { useFocusEffect, useRouter } from 'expo-router';
import { THEME } from '@alum-net/ui';
import { getConversationHistory, markMessagesAsRead } from '../service';
import { useConversations } from '../hooks/useConversations';
import { useMessaging } from '../hooks/messaging-context';
import { WS_ENDPOINTS } from '../constants';
import { useQueryClient } from '@tanstack/react-query';
import { Message, MessagePage, TypingEvent } from '../types';

export function ChatView() {
  const {
    subscribe,
    selectedConversation,
    isConnected,
    setSelectedConversation,
  } = useMessaging();
  const queryClient = useQueryClient();
  const {
    data: messages,
    isLoading: isLoading,
    error,
  } = useQuery({
    queryKey: [QUERY_KEYS.getMessages, selectedConversation],
    queryFn: () => getConversationHistory(selectedConversation!),
    enabled: !!selectedConversation,
    staleTime: 30_000,
  });
  const { data: userInfo } = useUserInfo();
  const { data: conversations } = useConversations(userInfo?.role);
  const nav = useRouter();
  const activeConversation = useMemo(
    () =>
      conversations?.find(
        conversation => conversation.id === selectedConversation,
      ),
    [conversations, selectedConversation],
  );
  const scrollViewRef = useRef<ScrollView>(null);
  const markAsReadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const typingIndicatorTimeoutRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);
  const isAutoScrollingRef = useRef<boolean>(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);

  const markAsRead = useCallback(() => {
    if (
      !isConnected ||
      !activeConversation?.id ||
      activeConversation.unreadCount === 0
    )
      return;

    if (markAsReadTimeoutRef.current) {
      clearTimeout(markAsReadTimeoutRef.current);
    }
    markAsReadTimeoutRef.current = setTimeout(() => {
      if (selectedConversation && isConnected) {
        markMessagesAsRead(selectedConversation)
          .then(() => {
            queryClient.setQueryData(
              [QUERY_KEYS.getMessages, selectedConversation],
              (previousMessagesData: MessagePage | undefined) => {
                if (!previousMessagesData) return previousMessagesData;

                const messagesMarkedAsRead = previousMessagesData.items.map((message: Message) => ({
                  ...message,
                  read: message.author !== userInfo?.email ? true : message.read,
                }));

                const unreadMessagesFromOthers = messagesMarkedAsRead.filter(
                  (message: Message) => !message.read && message.author !== userInfo?.email,
                ).length;

                return {
                  ...previousMessagesData,
                  items: messagesMarkedAsRead,
                  totalUnread: unreadMessagesFromOthers,
                };
              },
            );
            queryClient.invalidateQueries({
              queryKey: [QUERY_KEYS.getConversations],
            });
          })
          .catch((error) => {
            console.error('Error al marcar mensajes como leídos:', error);
          });
      }
    }, 300);
  }, [selectedConversation, activeConversation, isConnected, queryClient, userInfo?.email]);

  useEffect(() => {
    if (
      messages?.items &&
      messages?.items.length > 0 &&
      !isLoading &&
      activeConversation?.id &&
      isConnected
    ) {
      isAutoScrollingRef.current = true;
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
        setTimeout(() => {
          isAutoScrollingRef.current = false;
        }, 500);
      }, 100);
    }
  }, [messages?.items, isLoading, activeConversation?.id, isConnected]);

  const handleScroll = useCallback(() => {
    if (isAutoScrollingRef.current) {
      return;
    }
    markAsRead();
  }, [markAsRead]);

  useEffect(() => {
    if (!isConnected || !activeConversation?.id) {
      setTypingUser(null);
      return;
    }

    const typingDestination = WS_ENDPOINTS.SUBSCRIBE_TYPING(
      activeConversation?.id,
    );

    const unsubscribe = subscribe(
      typingDestination,
      (typingEvent: TypingEvent) => {
        if (typingEvent.userEmail === userInfo?.email) {
          return;
        }

        if (typingEvent.isTyping) {
          setTypingUser(typingEvent.userEmail);
          if (typingIndicatorTimeoutRef.current) {
            clearTimeout(typingIndicatorTimeoutRef.current);
          }
          typingIndicatorTimeoutRef.current = setTimeout(() => {
            setTypingUser(null);
          }, 3000);
        } else {
          setTypingUser(null);
          if (typingIndicatorTimeoutRef.current) {
            clearTimeout(typingIndicatorTimeoutRef.current);
          }
        }
      },
    );

    return () => {
      unsubscribe();
      if (typingIndicatorTimeoutRef.current) {
        clearTimeout(typingIndicatorTimeoutRef.current);
      }
    };
  }, [isConnected, activeConversation?.id, userInfo?.email, subscribe]);

  useEffect(() => {
    if (typingUser) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [typingUser]);

  useEffect(() => {
    return () => {
      if (markAsReadTimeoutRef.current) {
        clearTimeout(markAsReadTimeoutRef.current);
        markAsReadTimeoutRef.current = null;
      }
    };
  }, [activeConversation?.id]);

  useFocusEffect(
    useCallback(() => {
      if (activeConversation && activeConversation.unreadCount > 0) {
        markAsRead();
      }
    }, [activeConversation, markAsRead]),
  );

  return (
    <View style={styles.chatArea}>
      <Appbar
        safeAreaInsets={{ bottom: 0, top: 0, left: 0, right: 0 }}
        style={{ backgroundColor: THEME.colors.background }}
      >
        {Platform.OS !== 'web' && (
          <Appbar.BackAction
            onPress={() => {
              setSelectedConversation(null);
              nav.back();
            }}
          />
        )}
        <Appbar.Content
          title={activeConversation?.otherParticipantName || 'Conversación'}
        />
      </Appbar>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        onScroll={handleScroll}
        scrollEventThrottle={100}
        onScrollBeginDrag={markAsRead}
      >
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
            <Text style={styles.loadingText}>Cargando mensajes...</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              Error al cargar mensajes: {String(error)}
            </Text>
          </View>
        )}

        {!isLoading &&
          !error &&
          messages?.items &&
          messages?.items.length === 0 && (
            <View style={styles.emptyMessagesContainer}>
              <Text style={styles.emptyMessagesText}>
                No hay mensajes aún. ¡Comienza la conversación!
              </Text>
            </View>
          )}

        {!isLoading &&
          messages?.items &&
          messages?.items.map((message: Message) => {
            const isOwnMessage = message.author === userInfo?.email;

            return (
              <View
                key={message.id}
                style={[
                  styles.messageWrapper,
                  isOwnMessage
                    ? styles.ownMessageWrapper
                    : styles.otherMessageWrapper,
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    isOwnMessage
                      ? styles.ownMessageBubble
                      : styles.otherMessageBubble,
                  ]}
                >
                  {!isOwnMessage && (
                    <Text style={styles.messageAuthor}>
                      {message.authorName}
                    </Text>
                  )}
                  <Text
                    style={[
                      styles.messageText,
                      isOwnMessage && styles.ownMessageText,
                    ]}
                  >
                    {message.content}
                  </Text>
                  <View style={styles.messageFooter}>
                    <Text
                      style={[
                        styles.messageTime,
                        isOwnMessage && styles.ownMessageTime,
                      ]}
                    >
                      {new Date(message.timestamp).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                    {isOwnMessage && (
                      <Text style={styles.readStatus}>
                        {message.read ? '✓✓' : '✓'}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            );
          })}

        {typingUser && (
          <View style={styles.typingIndicator}>
            <Text style={styles.typingText}>Escribiendo...</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  chatArea: {
    flex: 1,
    flexDirection: 'column',
  },
  chatHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
  },
  chatTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageWrapper: {
    marginVertical: 4,
  },
  ownMessageWrapper: {
    alignItems: 'flex-end',
  },
  otherMessageWrapper: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
  },
  ownMessageBubble: {
    backgroundColor: '#007AFF',
  },
  otherMessageBubble: {
    backgroundColor: '#e8e8e8',
  },
  messageAuthor: {
    fontSize: 12,
    fontWeight: '700',
    color: '#666',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 20,
  },
  ownMessageText: {
    color: '#fff',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
    gap: 4,
  },
  messageTime: {
    fontSize: 11,
    color: '#999',
  },
  ownMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  readStatus: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  emptyMessagesContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyMessagesText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#999',
  },
  errorContainer: {
    padding: 32,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#d32f2f',
    textAlign: 'center',
  },
  typingIndicator: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginTop: 2,
    marginBottom: 2,
  },
  typingText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#999',
  },
});
