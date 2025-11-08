export const WS_ENDPOINTS = {
  ENDPOINT: '/ws',
  SEND_MESSAGE: (conversationId: string) =>
    `/app/conversations/${conversationId}/send`,
  SUBSCRIBE_MESSAGES: (conversationId: string) =>
    `/topic/conversations/${conversationId}`,
  SEND_TYPING: (conversationId: string) =>
    `/app/conversations/${conversationId}/typing`,
  SUBSCRIBE_TYPING: (conversationId: string) =>
    `/topic/conversations/${conversationId}/typing`,
  SUBSCRIBE_READ: (conversationId: string) =>
    `/topic/conversations/${conversationId}/read`,
};

export const MIN_MESSAGE_LENGTH = 1;
export const TYPING_DEBOUNCE_MS = 1000;
export const MAX_MESSAGE_LENGTH = 2000;
