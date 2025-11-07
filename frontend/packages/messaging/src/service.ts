import { Platform } from 'react-native';
import * as Device from 'expo-device';
import api, { Response, baseURL } from '@alum-net/api';
import { AxiosResponse } from 'axios';
import { ConversationSummary, MessagePage, MessageDTO } from './types';
import { UserInfo } from '@alum-net/users/src/types';

export const getConversations = async (): Promise<ConversationSummary[]> => {
  const { data }: AxiosResponse<Response<ConversationSummary[]>> = await api.get(
    '/messages/conversations'
  );
  
  if (!data.data) {
    return [];
  }
  
  return data.data;
};

export const getConversationHistory = async (
  conversationId: string,
  page: number = 0,
  size: number = 30
): Promise<MessagePage> => {
  const { data }: AxiosResponse<Response<MessagePage>> = await api.get(
    `/messages/${conversationId}`,
    {
      params: { page, size },
    }
  );
  
  if (!data.data) {
    return {
      items: [],
      hasMore: false,
      totalUnread: 0,
    };
  }
  
  return data.data;
};

export const getOrCreateConversation = async (otherUserEmail: string): Promise<string> => {
  const { data }: AxiosResponse<Response<string>> = await api.get(
    `/messages/conversations/with/${otherUserEmail}`
  );

  if (!data.data) {
    throw new Error('No se pudo obtener o crear la conversación');
  }

  return data.data;
};

export const searchAvailableUsers = async (
  nameQuery?: string
): Promise<UserInfo[]> => {
  const { data }: AxiosResponse<Response<UserInfo[]>> = await api.get(
    '/messages/users/search',
    {
      params: {
        name: nameQuery || undefined,
      },
    }
  );

  if (!data.data) {
    return [];
  }

  return data.data;
};

export const markMessagesAsRead = async (conversationId: string): Promise<void> => {
  await api.post(`/messages/${conversationId}/read`);
};

export const getWebSocketUrl = (): string => {
  let httpUrl: string;

  if (
    Platform.OS === 'android' &&
    __DEV__ &&
    Device.isDevice &&
    process.env.EXPO_PUBLIC_ENV === 'development'
  ) {
    httpUrl = 'http://10.0.2.2:8080';
  } else {
    const apiUrl = baseURL || process.env.EXPO_PUBLIC_API_URI || '';
    
    if (!apiUrl) {
      throw new Error('No se pudo determinar la URL base para WebSocket');
    }
    
    httpUrl = apiUrl.replace(/\/api\/?$/, '');
    
    if (!httpUrl) {
      throw new Error('No se pudo determinar la URL base para WebSocket');
    }
  }

  let wsUrl = httpUrl.replace(/^http/, 'ws');
  wsUrl = wsUrl.replace(/\/+$/, '');
  wsUrl = `${wsUrl}/ws`;

  return wsUrl;
};
