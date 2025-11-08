import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
} from 'react-native';
import { Text, ActivityIndicator, IconButton } from 'react-native-paper';
import {
  ConversationSummary,
  getOrCreateConversation,
  searchAvailableUsers,
  useConversations,
  useMessaging,
} from '@alum-net/messaging';
import { UserInfo } from '@alum-net/users/src/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@alum-net/api';
import { useUserInfo } from '@alum-net/users';
import { Toast } from '@alum-net/ui';

export default function UserSearch() {
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();
  const { setSelectedConversation } = useMessaging();
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: [QUERY_KEYS.getAvailableConversations, searchQuery],
    queryFn: () => searchAvailableUsers(searchQuery.trim()),
    enabled: searchQuery.trim().length >= 2,
    staleTime: 30_000,
  });
  const { data: userInfo } = useUserInfo();
  const { data: conversations } = useConversations(userInfo?.role);

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    setShowSearchResults(text.trim().length >= 2);
  };

  const handleFocus = () => {
    if (searchQuery.trim().length >= 2) {
      setShowSearchResults(true);
    }
  };

  const handleBlur = () => {
    setTimeout(() => setShowSearchResults(false), 200);
  };

  const handleSelectUser = async (userEmail: string) => {
    try {
      const conversationId = await getOrCreateConversation(userEmail);
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.getConversations],
      });
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

  const handleUserPress = (user: UserInfo) => {
    const existingConversation = conversations?.find(
      (conversation: ConversationSummary) =>
        conversation.otherParticipantEmail === user.email,
    );

    if (existingConversation) {
      handleSelectExistingConversation(existingConversation.id);
    } else {
      handleSelectUser(user.email);
    }
  };

  return (
    <>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar usuario..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={handleSearchChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </View>

      {showSearchResults && searchQuery.trim().length >= 2 && (
        <View style={styles.searchResultsContainer}>
          <View style={styles.searchResultsHeader}>
            <Text style={styles.searchResultsTitle}>
              Resultados de búsqueda
            </Text>
          </View>
          {isSearching && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" />
            </View>
          )}

          {!isSearching && searchResults && searchResults.length > 0 && (
            <ScrollView
              style={styles.searchResultsList}
              nestedScrollEnabled={true}
              keyboardShouldPersistTaps="handled"
            >
              {searchResults
                .filter(user => user.email !== userInfo?.email)
                .map((user: UserInfo) => {
                  const existingConversation = conversations?.find(
                    (conversation: ConversationSummary) =>
                      conversation.otherParticipantEmail === user.email,
                  );

                  return (
                    <Pressable
                      key={user.email}
                      onPress={() => handleUserPress(user)}
                      style={({ pressed }) => [
                        styles.searchResultItem,
                        existingConversation && styles.searchResultItemExisting,
                        pressed && styles.searchResultItemPressed,
                      ]}
                    >
                      <View style={styles.searchResultContent}>
                        <View style={styles.searchResultInfo}>
                          <Text style={styles.searchResultName}>
                            {user.name} {user.lastname}
                          </Text>
                          <Text style={styles.searchResultEmail}>
                            {user.email}
                          </Text>
                        </View>
                        {existingConversation ? (
                          <View style={styles.existingBadge}>
                            <Text style={styles.existingBadgeText}>
                              Existente
                            </Text>
                          </View>
                        ) : (
                          <Pressable
                            onPress={() => handleUserPress(user)}
                            hitSlop={{
                              top: 10,
                              bottom: 10,
                              left: 10,
                              right: 10,
                            }}
                          >
                            <View style={styles.addIconContainer}>
                              <IconButton
                                icon="plus-circle"
                                size={20}
                                iconColor="#007AFF"
                                style={styles.addIcon}
                              />
                            </View>
                          </Pressable>
                        )}
                      </View>
                    </Pressable>
                  );
                })}
            </ScrollView>
          )}

          {!isSearching && searchResults && searchResults.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No se encontraron usuarios disponibles
              </Text>
            </View>
          )}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
  },
  searchInput: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    fontSize: 14,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchResultsContainer: {
    maxHeight: 300,
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
    backgroundColor: '#f8f9fa',
  },
  searchResultsHeader: {
    padding: 12,
    backgroundColor: '#e3f2fd',
    borderBottomWidth: 1,
    borderBottomColor: '#90caf9',
  },
  searchResultsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1976d2',
  },
  searchResultsList: {
    maxHeight: 250,
  },
  searchResultItem: {
    margin: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchResultItemExisting: {
    borderColor: '#4caf50',
    borderWidth: 2,
    backgroundColor: '#f1f8e9',
  },
  searchResultItemPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  searchResultContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchResultInfo: {
    flex: 1,
  },
  searchResultName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  searchResultEmail: {
    fontSize: 13,
    color: '#666',
  },
  existingBadge: {
    backgroundColor: '#4caf50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  existingBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  addIconContainer: {
    marginLeft: 8,
  },
  addIcon: {
    margin: 0,
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
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
