
export type User = {
  id: string;
  name: string;
  avatar: string;
  about: string;
  verified: boolean;
  lastSeen: string;
  safetyNumber: string;
};

export type MessageStatus = 'sending'|'sent'|'delivered'|'read'|'failed';
export type Message = {
  id: string;
  chatId: string;
  from: string;
  text: string;
  ts: number;
  status: MessageStatus;
  replyTo?: string;
  media?: { type:'image'|'video'|'audio'|'file'; url:string; name?:string };
  disappearing?: boolean;
};

export type Chat = {
  id: string;
  type: 'dm'|'group';
  name: string;
  avatar: string;
  participants: string[];
  archived?: boolean;
  muted?: boolean;
  pinned?: boolean;
  disappearingTimer?: number; // seconds, 0=off
  verified?: boolean; // safety number verified
};

export type FeedPost = {
  id: string;
  author: User;
  text: string;
  image?: string;
  ts: number;
  likes: number;
  liked: boolean;
  comments: { user:string; text:string }[];
  bookmarked?: boolean;
};

export type CallRecord = {
  id: string;
  user: User;
  type: 'voice'|'video';
  direction: 'in'|'out';
  ts: number;
  duration?: string;
  missed?: boolean;
};
