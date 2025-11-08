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
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useUserInfo } from '@alum-net/users/src/hooks/useUserInfo';
import { QUERY_KEYS } from '@alum-net/api';
import { Toast } from '@alum-net/ui';
import {
  ConversationSummary,
  markMessagesAsRead,
  ReadReceipt,
  Message,
  MessagePage,
  WS_ENDPOINTS,
  MAX_MESSAGE_LENGTH,
  MIN_MESSAGE_LENGTH,
  getConversationHistory,
  useConversations,
} from '../index';

export type MessageHandler = (message: any) => void;

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
  messageText: string;
  setMessageText: (text: string) => void;
  isSending: boolean;
  sendMessage: (content: string) => void;
  handleSendMessage: () => void;
  messagesData: MessagePage | undefined;
  isLoadingMessages: boolean;
  errorMessages: any;
  conversationTitle: string;
  currentUserEmail: string;
  handleMarkAsRead: () => void;
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
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const queryClient = useQueryClient();
  const { data: userInfo } = useUserInfo();
  const currentUserEmail = userInfo?.email || '';

  const { data: conversations } = useConversations(userInfo?.role);

  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    error: errorMessages,
  } = useQuery({
    queryKey: [QUERY_KEYS.getMessages, selectedConversation],
    queryFn: () => getConversationHistory(selectedConversation!),
    enabled: !!selectedConversation,
    staleTime: 30_000,
  });

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

  const handleMarkAsRead = useCallback(() => {
    if (selectedConversation && isConnected) {
      markMessagesAsRead(selectedConversation).catch(() => {});
    }
  }, [selectedConversation, isConnected]);

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
    if (selectedConversation && isConnected) {
      const timeoutId = setTimeout(() => {
        markMessagesAsRead(selectedConversation).catch(() => {});
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [selectedConversation, isConnected]);

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
      if (readReceipt.readByUser !== currentUserEmail) {
        queryClient.setQueryData(
          [QUERY_KEYS.getMessages, conversationId],
          (previousMessagesData: MessagePage | undefined) => {
            if (!previousMessagesData) return previousMessagesData;

            return {
              ...previousMessagesData,
              items: previousMessagesData.items.map((message: Message) => ({
                ...message,
                read: message.author === currentUserEmail ? true : message.read,
              })),
            };
          },
        );
      }
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.getConversations],
      });
    },
    [queryClient, currentUserEmail],
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

  const sendMessage = (content: string) => {
    if (!selectedConversation) {
      throw new Error('No hay conversación seleccionada');
    }

    if (!isConnected) {
      throw new Error('WebSocket no conectado');
    }

    const trimmedContent = content.trim();

    if (trimmedContent.length < MIN_MESSAGE_LENGTH) {
      throw new Error('El mensaje no puede estar vacío');
    }

    if (trimmedContent.length > MAX_MESSAGE_LENGTH) {
      throw new Error('El mensaje no puede superar los 2000 caracteres');
    }

    setIsSending(true);

    try {
      const destination = WS_ENDPOINTS.SEND_MESSAGE(selectedConversation);
      const body = { content: trimmedContent };

      send(destination, body);
    } catch (error) {
      setIsSending(false);
      throw error;
    }

    setIsSending(false);
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

    if (message.length > MAX_MESSAGE_LENGTH) {
      Toast.error(
        `El mensaje no puede superar los ${MAX_MESSAGE_LENGTH} caracteres`,
      );
      return;
    }

    try {
      sendMessage(message);
      setMessageText('');
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.getConversations],
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';

      if (errorMessage === 'WebSocket no conectado') {
        Toast.error(
          'No se pudo conectar al servidor. El sistema intentará reconectar automáticamente. Por favor, espera unos segundos e intenta enviar nuevamente.',
        );
      } else {
        Toast.error(`Error al enviar el mensaje: ${errorMessage}`);
      }
    }
  };

  const conversationTitle =
    conversations?.find(
      (conversation: ConversationSummary) =>
        conversation.id === selectedConversation,
    )?.otherParticipantName || 'Conversación';

  const value = {
    isConnected,
    error,
    subscribe,
    send,
    unsubscribe,
    selectedConversation,
    messageText,
    setMessageText,
    conversations,
    setSelectedConversation,
    isSending,
    sendMessage,
    handleSendMessage,
    messagesData,
    isLoadingMessages,
    errorMessages,
    conversationTitle,
    currentUserEmail,
    handleMarkAsRead,
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
