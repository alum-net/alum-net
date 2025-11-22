import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { Client, IFrame, StompSubscription } from '@stomp/stompjs';
import { storage as mmkvStorage, STORAGE_KEYS } from '@alum-net/storage';
import { useMMKVString } from 'react-native-mmkv';
import { useQueryClient } from '@tanstack/react-query';
import { useUserInfo } from '@alum-net/users/src/hooks/useUserInfo';
import { QUERY_KEYS } from '@alum-net/api';
import {
  ConversationSummary,
  Message,
  MessagePage,
  ReadReceipt,
  TypingEvent,
} from '../types';
import { useConversations } from './useConversations';
import { WS_ENDPOINTS } from '../constants';
import { Toast } from '@alum-net/ui';
import { useFocusEffect } from '@react-navigation/native';
import { Platform } from 'react-native';

type WSMessage = TypingEvent | Message | ReadReceipt;
type WSSendBody = { content: string } | { isTyping: boolean };

type MessageHandler<T> = (message: T) => void;

type PendingSubscription = {
  destination: string;
  handler: MessageHandler<WSMessage>;
};

interface MessagingContextType {
  isConnected: boolean;
  error: Error | IFrame | Event | null;
  subscribe: <T extends WSMessage>(
    destination: string,
    handler: MessageHandler<T>,
  ) => () => void;
  send: (destination: string, body: WSSendBody) => void;
  unsubscribe: (destination: string) => void;
  selectedConversation: string | null;
  setSelectedConversation: (conversationId: string | null) => void;
  conversations: ConversationSummary[] | undefined;
}

const MessagingContext = createContext<MessagingContextType | undefined>(
  undefined,
);

interface MessagingProviderProps {
  children: ReactNode;
}

export const MessagingProvider = ({ children }: MessagingProviderProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | IFrame | Event | null>(null);
  const clientRef = useRef<Client | null>(null);
  const subscriptionsRef = useRef<Map<string, StompSubscription>>(new Map());
  const pendingSubscriptionsRef = useRef<Map<string, PendingSubscription>>(
    new Map(),
  );
  const [accessToken] = useMMKVString(STORAGE_KEYS.ACCESS_TOKEN, mmkvStorage);
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);

  const queryClient = useQueryClient();
  const { data: userInfo } = useUserInfo();

  const { data: conversations } = useConversations(userInfo?.role);

  const unsubscribe = useCallback((destination: string) => {
    const subscription = subscriptionsRef.current.get(destination);
    if (subscription) {
      subscription.unsubscribe();
      subscriptionsRef.current.delete(destination);
    }
    pendingSubscriptionsRef.current.delete(destination);
  }, []);

  const subscribe = useCallback(
    <T extends WSMessage>(destination: string, handler: MessageHandler<T>) => {
      if (clientRef.current?.connected) {
        if (subscriptionsRef.current.has(destination)) {
          return () => unsubscribe(destination);
        }

        const subscription = clientRef.current.subscribe(
          destination,
          message => {
            try {
              const messagePayload = JSON.parse(message.body);
              handler(messagePayload);
            } catch (error) {
              console.log(error);
            }
          },
        );

        subscriptionsRef.current.set(destination, subscription);
      } else {
        pendingSubscriptionsRef.current.set(destination, {
          destination,
          handler: handler as MessageHandler<WSMessage>,
        });
      }

      return () => unsubscribe(destination);
    },
    [unsubscribe],
  );

  const send = useCallback((destination: string, body: unknown) => {
    if (!clientRef.current?.connected) {
      throw new Error('WebSocket no conectado. Mensaje no enviado.');
    }

    clientRef.current.publish({
      destination,
      body: JSON.stringify(body),
    });
  }, []);

  const handleNewMessage = useCallback(
    (newMessage: Message, conversationId: string) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.getConversations],
      });

      if (conversationId === selectedConversation) {
        queryClient.setQueryData(
          [QUERY_KEYS.getMessages, conversationId],
          (previousMessagesData: MessagePage | undefined) => {
            if (!previousMessagesData) {
              const isUnreadMessageFromOther =
                newMessage.author !== userInfo?.email && !newMessage.read;
              const initialUnreadCount = isUnreadMessageFromOther ? 1 : 0;
              return {
                items: [newMessage],
                hasMore: false,
                totalUnread: initialUnreadCount,
              };
            }

            const messageAlreadyExists = previousMessagesData.items.some(
              (existingMessage: Message) =>
                existingMessage.id === newMessage.id,
            );

            if (messageAlreadyExists) return previousMessagesData;

            const isUnreadMessageFromOther =
              newMessage.author !== userInfo?.email && !newMessage.read;
            const updatedUnreadCount = isUnreadMessageFromOther
              ? previousMessagesData.totalUnread + 1
              : previousMessagesData.totalUnread;

            return {
              ...previousMessagesData,
              items: [...previousMessagesData.items, newMessage],
              totalUnread: updatedUnreadCount,
            };
          },
        );
      }
    },
    [queryClient, selectedConversation, userInfo?.email],
  );

  const handleReadReceipt = useCallback(
    (readReceipt: ReadReceipt, conversationId: string) => {
      const isReadReceiptFromOtherUser =
        readReceipt.readByUser !== userInfo?.email;

      if (isReadReceiptFromOtherUser) {
        queryClient.setQueryData(
          [QUERY_KEYS.getMessages, conversationId],
          (previousMessagesData: MessagePage | undefined) => {
            if (!previousMessagesData) return previousMessagesData;

            const myMessagesMarkedAsRead = previousMessagesData.items.map(
              (message: Message) => ({
                ...message,
                read: message.author === userInfo?.email ? true : message.read,
              }),
            );

            return {
              ...previousMessagesData,
              items: myMessagesMarkedAsRead,
            };
          },
        );
      }

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.getMessages, conversationId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.getConversations],
      });
    },
    [queryClient, userInfo?.email],
  );

  useFocusEffect(
    useCallback(() => {
      if (!accessToken) {
        return;
      }

      const client = new Client({
        brokerURL: process.env.EXPO_PUBLIC_WS_URL,
        connectHeaders: {
          Authorization: `Bearer ${accessToken}`,
          token: accessToken,
        },
        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,
        reconnectDelay: 5000,
        connectionTimeout: 5000,
        ...(Platform.OS !== 'web'
          ? { forceBinaryWSFrames: true, appendMissingNULLonIncoming: true }
          : {}),
        // debug: debug => {
        //   if (process.env.EXPO_PUBLIC_ENV === 'development') console.log(debug);
        // },
        onConnect: () => {
          setIsConnected(true);
          setError(null);

          pendingSubscriptionsRef.current.forEach(pending => {
            if (!clientRef.current?.connected) return;
            if (subscriptionsRef.current.has(pending.destination)) return;

            const subscription = clientRef.current.subscribe(
              pending.destination,
              message => {
                try {
                  const payload = JSON.parse(message.body);
                  pending.handler(payload);
                } catch (error) {
                  console.log(error);
                }
              },
            );

            subscriptionsRef.current.set(pending.destination, subscription);
          });

          pendingSubscriptionsRef.current.clear();
        },
        onDisconnect: () => {
          setIsConnected(false);
          pendingSubscriptionsRef.current.clear();
        },
        onStompError: (frame: IFrame) => {
          setError(frame);
          setIsConnected(false);
        },
        onWebSocketError: event => {
          setError(event);
          setIsConnected(false);
        },
        onWebSocketClose: () => {
          setIsConnected(false);
        },
      });

      clientRef.current = client;

      try {
        client.activate();
      } catch (e) {
        console.log(e);
        if (e instanceof Error) {
          setError(e);
        }
      }
      const subs = subscriptionsRef.current;
      const pendings = pendingSubscriptionsRef.current;

      return () => {
        subs.forEach(sub => {
          sub.unsubscribe();
        });
        subs.clear();
        pendings.clear();

        try {
          client.deactivate();
        } catch (error) {
          console.log(error);
        }
        clientRef.current = null;
      };
    }, [accessToken]),
  );

  useEffect(() => {
    if (!isConnected || !conversations || conversations.length === 0) return;

    const messageUnsubscribes = conversations.map(
      (conversation: ConversationSummary) => {
        const messagesDestination = WS_ENDPOINTS.SUBSCRIBE_MESSAGES(
          conversation.id,
        );

        return subscribe(messagesDestination, (newMessage: Message) => {
          handleNewMessage(newMessage, conversation.id);
        });
      },
    );

    return () => {
      messageUnsubscribes.forEach(unsubscribe => unsubscribe());
    };
  }, [isConnected, conversations, subscribe, handleNewMessage]);

  useEffect(() => {
    if (!isConnected || !conversations || conversations.length === 0) return;

    const readReceiptUnsubscribes = conversations.map(
      (conversation: ConversationSummary) => {
        const readReceiptDestination = WS_ENDPOINTS.SUBSCRIBE_READ(
          conversation.id,
        );

        return subscribe(readReceiptDestination, (readReceipt: ReadReceipt) => {
          handleReadReceipt(readReceipt, conversation.id);
        });
      },
    );

    return () => {
      readReceiptUnsubscribes.forEach(unsubscribe => unsubscribe());
    };
  }, [isConnected, conversations, subscribe, handleReadReceipt]);

  useEffect(() => {
    if (error) {
      console.error('WebSocket error:', error);
      if (!isConnected) {
        Toast.error('Error en la conexión. Intentando reconectar...');
      }
    }
  }, [error, isConnected]);

  const value = {
    isConnected,
    error,
    subscribe,
    send,
    unsubscribe,
    selectedConversation,
    conversations,
    setSelectedConversation,
  };

  return (
    <MessagingContext.Provider value={value}>
      {children}
    </MessagingContext.Provider>
  );
};

export const useMessaging = () => {
  const context = useContext(MessagingContext);
  if (context === undefined) {
    throw new Error('useMessaging must be used within a MessagingProvider');
  }
  return context;
};
