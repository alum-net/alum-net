import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';

import { useUserInfo } from '@alum-net/users';
import { ConversationSummary } from '../types';
import { useMessaging } from '../hooks/messaging-context';
import { useConversations } from '../hooks/useConversations';

const formatMessageTimestamp = (timestamp?: string): string => {
  if (!timestamp) return '';
  try {
    const messageDate = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - messageDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;

    return messageDate.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
    });
  } catch (error) {
    console.log(error);
    return '';
  }
};

export function ConversationsList() {
  const { selectedConversation, setSelectedConversation } = useMessaging();
  const { data: userInfo } = useUserInfo();
  const {
    data: conversations,
    isLoading: isLoading,
    error,
  } = useConversations(userInfo?.role);

  return (
    <ScrollView style={styles.conversationsList}>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error al cargar conversaciones</Text>
        </View>
      )}

      {!isLoading && !error && conversations && conversations.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tienes conversaciones aún</Text>
        </View>
      )}

      {!isLoading &&
        conversations &&
        conversations.map((conversation: ConversationSummary) => {
          const isSelected = selectedConversation === conversation.id;
          const unreadCount = conversation.unreadCount ?? 0;
          const hasUnread = unreadCount > 0;
          const lastMessageText = conversation.lastMessage
            ? conversation.lastMessage.content
            : 'Sin mensajes';
          const timeText = formatMessageTimestamp(conversation.lastMessageAt);

          return (
            <Pressable
              key={conversation.id}
              onPress={() => setSelectedConversation(conversation.id)}
              style={[
                styles.conversationItem,
                hasUnread && styles.unreadConversation,
                isSelected && !hasUnread && styles.selectedConversation,
                isSelected && hasUnread && styles.selectedUnreadConversation,
              ]}
            >
              <View style={styles.conversationContent}>
                <View style={styles.conversationHeader}>
                  <Text
                    style={[
                      styles.conversationName,
                      hasUnread && styles.unreadName,
                    ]}
                    numberOfLines={1}
                  >
                    {conversation.otherParticipantName}
                  </Text>
                  <View style={styles.headerRight}>
                    {!!timeText && (
                      <Text style={styles.timeText}>{timeText}</Text>
                    )}
                    {hasUnread && (
                      <View style={styles.unreadBadge}>
                        <Text style={styles.unreadBadgeText}>
                          {unreadCount > 99 ? '99+' : String(unreadCount)}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                <Text
                  style={[
                    styles.lastMessage,
                    hasUnread && styles.unreadMessage,
                  ]}
                  numberOfLines={1}
                >
                  {lastMessageText}
                </Text>
              </View>
            </Pressable>
          );
        })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  conversationsList: {
    flex: 1,
  },
  conversationItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  unreadConversation: {
    backgroundColor: '#f5f9ff',
    borderLeftWidth: 2,
    borderLeftColor: '#90caf9',
  },
  selectedConversation: {
    backgroundColor: '#e0e0e0',
  },
  selectedUnreadConversation: {
    backgroundColor: '#e8f0fe',
    borderLeftWidth: 2,
    borderLeftColor: '#90caf9',
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  unreadName: {
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeText: {
    fontSize: 11,
    color: '#999',
    fontWeight: '400',
  },
  unreadBadge: {
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    zIndex: 1,
  },
  unreadBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 11,
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
  },
  unreadMessage: {
    color: '#444',
    fontWeight: '400',
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
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
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});
