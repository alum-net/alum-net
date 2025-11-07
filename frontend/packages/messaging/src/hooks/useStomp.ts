import { useEffect, useRef, useState, useCallback } from 'react';
import { Client, IFrame } from '@stomp/stompjs';
import { storage, STORAGE_KEYS } from '@alum-net/storage';
import { getWebSocketUrl } from '../service';

export type MessageHandler = (message: any) => void;

type PendingSubscription = {
  destination: string;
  handler: MessageHandler;
};

export const useStomp = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<any>(null);
  const clientRef = useRef<Client | null>(null);
  const subscriptionsRef = useRef<Map<string, any>>(new Map());
  const pendingSubscriptionsRef = useRef<Map<string, PendingSubscription>>(new Map());

  useEffect(() => {
    const wsUrl = getWebSocketUrl();
    const token = storage.getString(STORAGE_KEYS.ACCESS_TOKEN);

    if (!token) {
      return;
    }

    const client = new Client({
      brokerURL: wsUrl,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
        token: token,
      },
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      reconnectDelay: 5000,
      connectionTimeout: 5000,
      debug: () => {},
      onConnect: () => {
        setIsConnected(true);
        setError(null);

        pendingSubscriptionsRef.current.forEach((pending) => {
          if (!clientRef.current?.connected) return;
          if (subscriptionsRef.current.has(pending.destination)) return;

          const subscription = clientRef.current.subscribe(pending.destination, (message) => {
            try {
              const payload = JSON.parse(message.body);
              pending.handler(payload);
            } catch (error) {
              // Error parseando mensaje
            }
          });

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
      onWebSocketError: (event: any) => {
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
      subscriptionsRef.current.forEach((sub) => {
        sub.unsubscribe();
      });
      subscriptionsRef.current.clear();
      pendingSubscriptionsRef.current.clear();
      
      client.deactivate();
      clientRef.current = null;
    };
  }, []);

  const unsubscribe = useCallback((destination: string) => {
    const subscription = subscriptionsRef.current.get(destination);
    if (subscription) {
      subscription.unsubscribe();
      subscriptionsRef.current.delete(destination);
    }
    pendingSubscriptionsRef.current.delete(destination);
  }, []);

  const subscribe = useCallback((destination: string, handler: MessageHandler) => {
    if (clientRef.current?.connected) {
      if (subscriptionsRef.current.has(destination)) {
        return () => unsubscribe(destination);
      }

      const subscription = clientRef.current.subscribe(destination, (message) => {
        try {
          const messagePayload = JSON.parse(message.body);
          handler(messagePayload);
        } catch (error) {
          // Ignorar errores de parsing
        }
      });

      subscriptionsRef.current.set(destination, subscription);
    } else {
      pendingSubscriptionsRef.current.set(destination, { destination, handler });
    }

    return () => unsubscribe(destination);
  }, [unsubscribe]);

  const send = useCallback((destination: string, body: any) => {
    if (!clientRef.current) {
      throw new Error('Cliente STOMP no inicializado');
    }

    if (!clientRef.current.connected) {
      if (!clientRef.current.active) {
        try {
          clientRef.current.activate();
        } catch (error) {
          // Error al activar
        }
      }
      
      throw new Error('WebSocket no conectado');
    }

    try {
      clientRef.current.publish({
        destination,
        body: JSON.stringify(body),
      });
    } catch (error) {
      throw error;
    }
  }, []);

  return {
    isConnected,
    error,
    subscribe,
    send,
    unsubscribe,
  };
};
