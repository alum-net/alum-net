import React, { useRef, useEffect, useCallback } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { MESSAGING_CONSTANTS } from '@alum-net/messaging';

type Props = {
  messageText: string;
  onMessageChange: (text: string) => void;
  onSend: () => void;
  isSending: boolean;
  isDisabled: boolean;
  conversationId: string | null;
  isConnected: boolean;
  send: (destination: string, body: any) => void;
  onMarkAsRead?: () => void;
};

export default function MessageInput({
  messageText,
  onMessageChange,
  onSend,
  isSending,
  isDisabled,
  conversationId,
  isConnected,
  send,
  onMarkAsRead,
}: Props) {
  const inputRef = useRef<any>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTypingSentRef = useRef<boolean>(false);

  const canSend =
    messageText.trim().length >= MESSAGING_CONSTANTS.MIN_MESSAGE_LENGTH &&
    !isSending &&
    !isDisabled &&
    messageText.length <= MESSAGING_CONSTANTS.MAX_MESSAGE_LENGTH;

  const sendTypingEvent = useCallback((isTyping: boolean) => {
    if (!conversationId || !isConnected) {
      return;
    }
    
    try {
      const typingDestination = MESSAGING_CONSTANTS.WS.SEND_TYPING(conversationId);
      send(typingDestination, { isTyping });
      lastTypingSentRef.current = isTyping;
    } catch (error) {
      
    }
  }, [conversationId, isConnected, send]);

  const handleTextChange = useCallback((text: string) => {
    onMessageChange(text);
    
    if (onMarkAsRead && text.trim().length > 0) {
      onMarkAsRead();
    }
    
    if (!conversationId || !isConnected) {
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
      }, MESSAGING_CONSTANTS.TYPING_DEBOUNCE_MS);
    } else if (wasTyping) {
      sendTypingEvent(false);
    }
  }, [conversationId, isConnected, onMessageChange, sendTypingEvent, onMarkAsRead]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (lastTypingSentRef.current && conversationId && isConnected) {
        sendTypingEvent(false);
      }
    };
  }, [conversationId, isConnected, sendTypingEvent]);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    let textarea: HTMLTextAreaElement | null = null;
    let handleKeyDown: ((event: KeyboardEvent) => void) | null = null;

    const timeoutId = setTimeout(() => {
      textarea = document.querySelector(
        'textarea[placeholder="Escribe un mensaje..."]'
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
          maxLength={MESSAGING_CONSTANTS.MAX_MESSAGE_LENGTH}
          editable={!isSending && !isDisabled}
          returnKeyType="send"
          onSubmitEditing={canSend ? onSend : undefined}
          blurOnSubmit={false}
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
