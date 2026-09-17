
import type { User, Chat, Message, FeedPost, CallRecord } from './types';

export const ME_ID = 'me';

export const users: User[] = [
  { id:'u1', name:'Amara Keita', avatar:'https://i.pravatar.cc/200?img=5', about:'Available — Vault only.', verified:true, lastSeen:'online', safetyNumber:'12345 67890 12345 67890 12345 67890 12345 67890 12345 67890 12345 67890' },
  { id:'u2', name:'Luca Fernández', avatar:'https://i.pravatar.cc/200?img=8', about:'Building in private.', verified:true, lastSeen:'today, 14:22', safetyNumber:'54321 09876 54321 09876 54321 09876 54321 09876 54321 09876 54321 09876' },
  { id:'u3', name:'Sofia Zhang', avatar:'https://i.pravatar.cc/200?img=9', about:'E2EE or it did not happen.', verified:false, lastSeen:'today, 09:10', safetyNumber:'11111 22222 33333 44444 55555 66666 77777 88888 99999 00000 11111 22222' },
  { id:'u4', name:'Design Guild', avatar:'https://i.pravatar.cc/200?img=12', about:'', verified:true, lastSeen:'', safetyNumber:'' },
  { id:'u5', name:'Tobi', avatar:'https://i.pravatar.cc/200?img=15', about:'Vault founder.', verified:true, lastSeen:'online', safetyNumber:'99999 88888 77777 66666 55555 44444 33333 22222 11111 00000 99999 88888' },
];

export const chats: Chat[] = [
  { id:'c1', type:'dm', name:'Amara Keita', avatar: users[0].avatar, participants:[ME_ID,'u1'], pinned:true, verified:true },
  { id:'c2', type:'dm', name:'Luca Fernández', avatar: users[1].avatar, participants:[ME_ID,'u2'], muted:true, verified:true },
  { id:'c3', type:'group', name:'Design Guild', avatar: users[3].avatar, participants:[ME_ID,'u1','u2','u3'], verified:false },
  { id:'c4', type:'dm', name:'Sofia Zhang', avatar: users[2].avatar, participants:[ME_ID,'u3'], disappearingTimer: 86400 },
];

const now = Date.now();
export const messages: Record<string, Message[]> = {
  c1: [
    { id:'m1', chatId:'c1', from:ME_ID, text:'Hey — trying Vault. Notice the lock on this chat?', ts: now-3600000*5, status:'read' },
    { id:'m2', chatId:'c1', from:'u1', text:'I do. Safety number verified. End-to-end encrypted — nobody else can read this, not even Vault.', ts: now-3600000*4, status:'read' },
    { id:'m3', chatId:'c1', from:ME_ID, text:'Exactly. Try the disappearing timer — 24h on this chat.', ts: now-3600000*2, status:'delivered' },
    { id:'m4', chatId:'c1', from:'u1', text:'Seen. Also the feed is surprisingly good for a messenger.', ts: now-600000, status:'read' },
  ],
  c2: [
    { id:'m5', chatId:'c2', from:'u2', text:'Voice note incoming', ts: now-900000, status:'read', media:{ type:'audio', url:'' } },
    { id:'m6', chatId:'c2', from:ME_ID, text:'Got it — playback is local, waveform never leaves device.', ts: now-800000, status:'read' },
  ],
  c3: [
    { id:'m7', chatId:'c3', from:'u3', text:'Proposal: make read receipts per-member in groups. Thoughts?', ts: now-7200000, status:'read' },
    { id:'m8', chatId:'c3', from:ME_ID, text:'Shipped in this build — long-press a message > Info.', ts: now-7000000, status:'read' },
    { id:'m9', chatId:'c3', from:'u1', text:'Feed post about it is live too. Cross-posted from chats.', ts: now-300000, status:'delivered' },
  ],
  c4: [
    { id:'m10', chatId:'c4', from:'u3', text:'This chat disappears in 24h. Screenshot detection is on.', ts: now-200000, status:'sent' },
  ],
};

export const feed: FeedPost[] = [
  { id:'f1', author: users[1], text:'Shipped Vault v1 — WhatsApp parity with real E2EE, plus a feed that respects your graph. No ads, no tracking, keys stay on device.', image:'https://picsum.photos/seed/vault1/900/600', ts: now-3600000*3, likes: 128, liked:false, comments:[{user:'Amara', text:'Finally a messenger that gets security right.'}], bookmarked:false },
  { id:'f2', author: users[0], text:'Disappearing messages + screenshot blurs. If someone screenshots a vanishing photo, you get notified — and the image stays encrypted.', image:'https://picsum.photos/seed/vault2/900/500', ts: now-3600000*8, likes: 89, liked:true, comments:[], bookmarked:true },
  { id:'f3', author: users[2], text:'Customization without leaking metadata: themes, bubble shapes, and wallpapers are local-only. Server never sees your choices.', ts: now-3600000*20, likes: 42, liked:false, comments:[{user:'Luca', text:'Love this.'}], bookmarked:false },
];

export const calls: CallRecord[] = [
  { id:'cl1', user: users[0], type:'video', direction:'in', ts: now-3600000*1, duration:'4:22' },
  { id:'cl2', user: users[1], type:'voice', direction:'out', ts: now-3600000*6, duration:'0:48' },
  { id:'cl3', user: users[2], type:'voice', direction:'in', ts: now-3600000*10, missed:true },
];
