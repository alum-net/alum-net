export const MESSAGING_CONSTANTS = {
  WS: {
    ENDPOINT: '/ws',
    SEND_MESSAGE: (conversationId: string) => `/app/conversations/${conversationId}/send`,
    SUBSCRIBE_MESSAGES: (conversationId: string) => `/topic/conversations/${conversationId}`,
    SEND_TYPING: (conversationId: string) => `/app/conversations/${conversationId}/typing`,
    SUBSCRIBE_TYPING: (conversationId: string) => `/topic/conversations/${conversationId}/typing`,
    SUBSCRIBE_READ: (conversationId: string) => `/topic/conversations/${conversationId}/read`,
  },
  MIN_MESSAGE_LENGTH: 1,
  MAX_MESSAGE_LENGTH: 2000,
  TYPING_DEBOUNCE_MS: 1000,
};
