import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { Client, IFrame } from '@stomp/stompjs';
import { storage, STORAGE_KEYS } from '@alum-net/storage';
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

export type MessageHandler = (
  message: TypingEvent & Message & ReadReceipt,
) => void;

type PendingSubscription = {
  destination: string;
  handler: MessageHandler;
};

interface MessagingContextType {
  isConnected: boolean;
  error: any;
  subscribe: (destination: string, handler: MessageHandler) => () => void;
  send: (destination: string, body: any) => void;
  unsubscribe: (destination: string) => void;
  selectedConversation: string | null;
  setSelectedConversation: (conversationId: string | null) => void;
}

const MessagingContext = createContext<MessagingContextType | undefined>(
  undefined,
);

interface MessagingProviderProps {
  children: ReactNode;
}

export const MessagingProvider = ({ children }: MessagingProviderProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<any>(null);
  const clientRef = useRef<Client | null>(null);
  const subscriptionsRef = useRef<Map<string, any>>(new Map());
  const pendingSubscriptionsRef = useRef<Map<string, PendingSubscription>>(
    new Map(),
  );
  const [accessToken] = useMMKVString(STORAGE_KEYS.ACCESS_TOKEN, storage);
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);

  const queryClient = useQueryClient();
  const { data: userInfo } = useUserInfo();

  const { data: conversations } = useConversations(userInfo?.role);

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    const client = new Client({
      brokerURL: process.env.PUBLIC_WS_URL,
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
        token: accessToken,
      },
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      reconnectDelay: 5000,
      connectionTimeout: 5000,
      debug: () => {},
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
              } catch {
                // Error parseando mensaje
              }
            },
          );

          subscriptionsRef.current.set(pending.destination, subscription);
        });

        pendingSubscriptionsRef.current.clear();
      },
      onDisconnect: () => {
        setIsConnected(false);
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
    } catch (error) {
      setError(error);
    }

    return () => {
      subscriptionsRef.current.forEach(sub => {
        sub.unsubscribe();
      });
      subscriptionsRef.current.clear();
      pendingSubscriptionsRef.current.clear();

      client.deactivate();
      clientRef.current = null;
    };
  }, [accessToken]);

  const unsubscribe = useCallback((destination: string) => {
    const subscription = subscriptionsRef.current.get(destination);
    if (subscription) {
      subscription.unsubscribe();
      subscriptionsRef.current.delete(destination);
    }
    pendingSubscriptionsRef.current.delete(destination);
  }, []);

  const subscribe = useCallback(
    (destination: string, handler: MessageHandler) => {
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
            } catch {
              // Ignorar errores de parsing
            }
          },
        );

        subscriptionsRef.current.set(destination, subscription);
      } else {
        pendingSubscriptionsRef.current.set(destination, {
          destination,
          handler,
        });
      }

      return () => unsubscribe(destination);
    },
    [unsubscribe],
  );

  const send = useCallback((destination: string, body: any) => {
    if (!clientRef.current) {
      throw new Error('Cliente STOMP no inicializado');
    }

    if (!clientRef.current.connected) {
      if (!clientRef.current.active) {
        try {
          clientRef.current.activate();
        } catch {
          // Error al activar
        }
      }

      throw new Error('WebSocket no conectado');
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
      queryClient.refetchQueries({ queryKey: [QUERY_KEYS.getConversations] });

      if (conversationId === selectedConversation) {
        queryClient.setQueryData(
          [QUERY_KEYS.getMessages, conversationId],
          (previousMessagesData: MessagePage | undefined) => {
            if (!previousMessagesData) return previousMessagesData;

            const messageAlreadyExists = previousMessagesData.items.some(
              (existingMessage: Message) =>
                existingMessage.id === newMessage.id,
            );

            if (messageAlreadyExists) return previousMessagesData;

            return {
              ...previousMessagesData,
              items: [...previousMessagesData.items, newMessage],
            };
          },
        );
      }
    },
    [queryClient, selectedConversation],
  );

  useEffect(() => {
    if (!isConnected || !selectedConversation) return;

    const unsubscribe = subscribe(
      WS_ENDPOINTS.SUBSCRIBE_MESSAGES(selectedConversation),
      (newMessage: Message) => {
        queryClient.setQueryData(
          [QUERY_KEYS.getMessages, selectedConversation],
          (previousMessagesData: MessagePage | undefined) => {
            if (!previousMessagesData) return previousMessagesData;

            const messageAlreadyExists = previousMessagesData.items.some(
              (existingMessage: Message) =>
                existingMessage.id === newMessage.id,
            );

            if (messageAlreadyExists) return previousMessagesData;

            return {
              ...previousMessagesData,
              items: [...previousMessagesData.items, newMessage],
            };
          },
        );

        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.getConversations],
        });
      },
    );

    return unsubscribe;
  }, [isConnected, selectedConversation, subscribe, queryClient]);

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

  const handleReadReceipt = useCallback(
    (readReceipt: ReadReceipt, conversationId: string) => {
      if (readReceipt.readByUser !== userInfo?.email) {
        queryClient.setQueryData(
          [QUERY_KEYS.getMessages, conversationId],
          (previousMessagesData: MessagePage | undefined) => {
            if (!previousMessagesData) return previousMessagesData;

            return {
              ...previousMessagesData,
              items: previousMessagesData.items.map((message: Message) => ({
                ...message,
                read: message.author === userInfo?.email ? true : message.read,
              })),
            };
          },
        );
      }
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.getConversations],
      });
    },
    [queryClient, userInfo?.email],
  );

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
