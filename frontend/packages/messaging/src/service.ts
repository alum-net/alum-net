import api, { Response } from '@alum-net/api';
import { AxiosResponse } from 'axios';
import { ConversationSummary, MessagePage } from './types';
import { UserInfo } from '@alum-net/users/src/types';

export const getConversations = async (): Promise<ConversationSummary[]> => {
  const { data }: AxiosResponse<Response<ConversationSummary[]>> =
    await api.get('/messages/conversations');

  if (!data.data) {
    return [];
  }

  return data.data;
};

export const getConversationHistory = async (
  conversationId: string,
  page: number = 0,
  size: number = 30,
): Promise<MessagePage> => {
  const { data }: AxiosResponse<Response<MessagePage>> = await api.get(
    `/messages/${conversationId}`,
    {
      params: { page, size },
    },
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

export const getOrCreateConversation = async (
  otherUserEmail: string,
): Promise<string> => {
  const { data }: AxiosResponse<Response<string>> = await api.get(
    `/messages/conversations/with/${otherUserEmail}`,
  );

  if (!data.data) {
    throw new Error('No se pudo obtener o crear la conversación');
  }

  return data.data;
};

export const searchAvailableUsers = async (
  nameQuery?: string,
): Promise<UserInfo[]> => {
  const { data }: AxiosResponse<Response<UserInfo[]>> = await api.get(
    '/messages/users/search',
    {
      params: {
        name: nameQuery || undefined,
      },
    },
  );

  if (!data.data) {
    return [];
  }

  return data.data;
};

export const markMessagesAsRead = async (
  conversationId: string,
): Promise<void> => {
  await api.post(`/messages/${conversationId}/read`);
};
