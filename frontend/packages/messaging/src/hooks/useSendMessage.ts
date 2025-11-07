import { useState } from 'react';
import { MESSAGING_CONSTANTS } from '../constants';

type UseSendMessageProps = {
  conversationId: string | null;
  isConnected: boolean;
  send: (destination: string, body: any) => void;
};

/**
 * Hook para enviar un mensaje por WebSocket
 */
export const useSendMessage = ({ conversationId, isConnected, send }: UseSendMessageProps) => {
  const [isSending, setIsSending] = useState(false);

  const sendMessage = (content: string) => {
    if (!conversationId) {
      throw new Error('No hay conversación seleccionada');
    }

    if (!isConnected) {
      throw new Error('WebSocket no conectado');
    }

    const trimmedContent = content.trim();
    
    if (trimmedContent.length < MESSAGING_CONSTANTS.MIN_MESSAGE_LENGTH) {
      throw new Error('El mensaje no puede estar vacío');
    }

    if (trimmedContent.length > MESSAGING_CONSTANTS.MAX_MESSAGE_LENGTH) {
      throw new Error('El mensaje no puede superar los 2000 caracteres');
    }

    setIsSending(true);
    
    try {
      const destination = MESSAGING_CONSTANTS.WS.SEND_MESSAGE(conversationId);
      const body = { content: trimmedContent };
      
      send(destination, body);
    } catch (error) {
      setIsSending(false);
      throw error;
    }

    setIsSending(false);
  };

  return {
    sendMessage,
    isSending,
  };
};

