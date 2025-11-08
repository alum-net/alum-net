import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useMessaging } from '@alum-net/messaging';
import ConversationsList from '../features/messages/components/conversations-list';
import UserSearch from '../features/messages/components/user-search';
import ChatView from '../features/messages/components/chat-view';
import MessageInput from '../features/messages/components/message-input';

export default function MessagesPage() {
  const {
    selectedConversation,
    messageText,
    setMessageText,
    isSending,
    handleSendMessage,
    messagesData,
    isLoadingMessages,
    errorMessages,
    conversationTitle,
    currentUserEmail,
    isConnected,
    send,
    handleMarkAsRead,
  } = useMessaging();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.sidebar}>
          <View style={styles.sidebarHeader}>
            <Text style={styles.sidebarTitle}>Conversaciones</Text>
          </View>

          <UserSearch />

          <ConversationsList />
        </View>

        <View style={styles.mainArea}>
          {selectedConversation ? (
            <>
              <ChatView
                messages={messagesData?.items}
                isLoading={isLoadingMessages}
                error={errorMessages}
                currentUserEmail={currentUserEmail}
                conversationTitle={conversationTitle}
                conversationId={selectedConversation}
                isConnected={isConnected}
                onMarkAsRead={handleMarkAsRead}
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
