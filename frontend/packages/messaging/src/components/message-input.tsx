import React, { useRef, useEffect, useCallback, useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { IconButton } from 'react-native-paper';
import { Toast } from '@alum-net/ui';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@alum-net/api';
import { useMessaging } from '../hooks/messaging-context';
import {
  MAX_MESSAGE_LENGTH,
  MIN_MESSAGE_LENGTH,
  TYPING_DEBOUNCE_MS,
  WS_ENDPOINTS,
} from '../constants';

export function MessageInput() {
  const { selectedConversation, send, isConnected } = useMessaging();
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTypingSentRef = useRef<boolean>(false);
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const queryClient = useQueryClient();

  const canSend =
    messageText.trim().length >= MIN_MESSAGE_LENGTH &&
    !isSending &&
    !!selectedConversation &&
    messageText.length <= MAX_MESSAGE_LENGTH;

  const sendTypingEvent = useCallback(
    (isTyping: boolean) => {
      if (!selectedConversation || !isConnected) {
        return;
      }

      try {
        const typingDestination =
          WS_ENDPOINTS.SEND_TYPING(selectedConversation);
        send(typingDestination, { isTyping });
        lastTypingSentRef.current = isTyping;
      } catch (error) {
        console.log(error);
      }
    },
    [selectedConversation, isConnected, send],
  );

  const handleTextChange = useCallback(
    (text: string) => {
      setMessageText(text);

      if (!selectedConversation || !isConnected) {
        return;
      }

      const hasText = text.trim().length > 0;
      const wasTyping = lastTypingSentRef.current;

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      if (hasText && !wasTyping) {
        sendTypingEvent(true);
      }

      if (hasText) {
        typingTimeoutRef.current = setTimeout(() => {
          if (lastTypingSentRef.current) {
            sendTypingEvent(false);
          }
        }, TYPING_DEBOUNCE_MS);
      } else if (wasTyping) {
        sendTypingEvent(false);
      }
    },
    [selectedConversation, isConnected, setMessageText, sendTypingEvent],
  );
  const sendMessage = useCallback(
    (content: string) => {
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

        send(destination, { content: trimmedContent });
      } catch (error) {
        setIsSending(false);
        throw error;
      }

      setIsSending(false);
    },
    [isConnected, selectedConversation, send],
  );

  const onSend = useCallback(() => {
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
  }, [isSending, messageText, queryClient, selectedConversation, sendMessage]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (lastTypingSentRef.current && selectedConversation && isConnected) {
        sendTypingEvent(false);
      }
    };
  }, [selectedConversation, isConnected, sendTypingEvent]);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    let textarea: HTMLTextAreaElement | null = null;
    let handleKeyDown: ((event: KeyboardEvent) => void) | null = null;

    const timeoutId = setTimeout(() => {
      textarea = document.querySelector(
        'textarea[placeholder="Escribe un mensaje..."]',
      ) as HTMLTextAreaElement | null;

      if (!textarea) return;

      handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Enter' && !event.shiftKey && canSend) {
          event.preventDefault();
          onSend();
        }
      };

      textarea.addEventListener('keydown', handleKeyDown);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (textarea && handleKeyDown) {
        textarea.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [canSend, onSend]);

  return (
    <>
      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={styles.messageInput}
          value={messageText}
          onChangeText={handleTextChange}
          placeholder="Escribe un mensaje..."
          placeholderTextColor="#999"
          multiline
          maxLength={MAX_MESSAGE_LENGTH}
          editable={!isSending && !!selectedConversation}
          returnKeyType="send"
          onSubmitEditing={canSend ? onSend : undefined}
        />
        <IconButton
          icon="send"
          size={24}
          onPress={onSend}
          disabled={!canSend}
          style={styles.sendButton}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
    gap: 8,
  },
  messageInput: {
    flex: 1,
    maxHeight: 120,
    padding: 12,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    fontSize: 15,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sendButton: {
    margin: 0,
  },
});
