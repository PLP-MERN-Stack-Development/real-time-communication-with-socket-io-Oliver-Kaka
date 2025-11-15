
export type MessageAuthor = 'user' | 'ai';

export interface User {
  name: string;
  avatarUrl: string;
}

export interface Reaction {
  emoji: string;
  count: number;
  reacted: boolean;
}

export interface Message {
  id: string;
  author: MessageAuthor;
  text: string;
  timestamp: string;
  image?: string; // base64 encoded image
  reactions: Reaction[];
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
}
