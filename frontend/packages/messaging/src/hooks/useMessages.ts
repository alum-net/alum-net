import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getConversationHistory } from '../service';
import { QUERY_KEYS } from '@alum-net/api';
import { MESSAGING_CONSTANTS } from '../constants';
import { MessageDTO, MessagePage } from '../types';

type UseMessagesProps = {
  conversationId: string | null;
  isConnected: boolean;
  subscribe: (destination: string, handler: (message: any) => void) => () => void;
};

export const useMessages = ({ conversationId, isConnected, subscribe }: UseMessagesProps) => {
  const queryClient = useQueryClient();

  const queryResult = useQuery({
    queryKey: [QUERY_KEYS.getMessages, conversationId],
    queryFn: () => getConversationHistory(conversationId!),
    enabled: !!conversationId,
    staleTime: 30_000,
  });

  useEffect(() => {
    if (!isConnected || !conversationId) return;

    const unsubscribe = subscribe(
      MESSAGING_CONSTANTS.WS.SUBSCRIBE_MESSAGES(conversationId),
      (newMessage: MessageDTO) => {
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

        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.getConversations] });
      }
    );

    return unsubscribe;
  }, [isConnected, conversationId, subscribe, queryClient]);

  return queryResult;
};
