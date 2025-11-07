export interface MessageDTO {
  id: string;
  conversationId: string;
  author: string;
  authorName: string;
  content: string;
  read: boolean;
  timestamp: string;
}

export interface ConversationSummary {
  id: string;
  otherParticipantEmail: string;
  otherParticipantName: string;
  otherParticipantAvatarUrl?: string;
  otherParticipantRole: 'TEACHER' | 'STUDENT' | 'ADMIN';
  lastMessage?: MessageDTO;
  unreadCount: number;
  lastMessageAt?: string;
}

export interface MessagePage {
  items: MessageDTO[];
  hasMore: boolean;
  totalUnread: number;
}

export interface TypingEvent {
  isTyping: boolean;
  userEmail: string;
}

export interface ReadReceipt {
  conversationId: string;
  readByUser: string;
}

