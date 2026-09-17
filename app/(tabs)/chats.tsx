import { useState, useMemo, useRef, useEffect } from 'react';
import { View, Text, TextInput, Pressable, FlatList, Alert, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../lib/theme';
import { Icon } from '../../lib/icons';
import { chats as seedChats, messages as seedMsgs, ME_ID } from '../../lib/mock';
import { ChatRow } from '../../components/ChatRow';
import type { Chat, Message } from '../../lib/types';
import * as Haptics from 'expo-haptics';

export default function Chats() {
  const { colors } = useTheme();
  const router = useRouter();
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'groups'>('all');
  const [chats] = useState<Chat[]>(seedChats);
  const [msgs] = useState<Record<string, Message[]>>(seedMsgs);
  const [showArchived, setShowArchived] = useState(false);
  const fade = useRef(new Animated.Value(0)).current;
  useEffect(() => { Animated.timing(fade, { toValue: 1, duration: 320, useNativeDriver: true }).start(); }, []);

  const filtered = useMemo(() => {
    let c = chats.filter(x => (showArchived ? x.archived : !x.archived));
    if (filter === 'groups') c = c.filter(x => x.type === 'group');
    if (filter === 'unread') c = c.filter(x => msgs[x.id]?.some(m => m.status !== 'read' && m.from !== ME_ID));
    if (q.trim()) c = c.filter(x => x.name.toLowerCase().includes(q.toLowerCase()));
    c = [...c].sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned));
    return c;
  }, [chats, msgs, q, filter, showArchived]);

  const openChat = (id: string) => { Haptics.selectionAsync(); router.push(`/chat/${id}` as any); };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* Search + filters */}
      <Animated.View style={{ opacity: fade, paddingHorizontal: 12, paddingTop: 10, paddingBottom: 8, gap: 10 }}>
        <View style={{ backgroundColor: colors.surfaceAlt, borderRadius: 24, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, height: 44, borderWidth: 1.5, borderColor: q ? 'rgba(0,168,132,0.35)' : '#2A3942', gap: 10 }}>
          <Icon.search size={16} color={q ? colors.accent : '#667781'} />
          <TextInput value={q} onChangeText={setQ} placeholder="Search chats" placeholderTextColor="#667781" style={{ flex: 1, color: colors.text, fontSize: 14, fontWeight: '500' }} />
          {q.length > 0 ? (
            <Pressable onPress={() => setQ('')} hitSlop={10} style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: '#1F2C34', alignItems: 'center', justifyContent: 'center' }}>
              <Icon.close size={14} color="#AEBAC1" />
            </Pressable>
          ) : (
            <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
              <View style={{ backgroundColor: '#1F2C34', paddingHorizontal: 7, paddingVertical: 4, borderRadius: 999 }}><Text style={{ color: '#667781', fontSize: 10, fontWeight: '700' }}></Text></View>
            </View>
          )}
        </View>
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          {(['all', 'unread', 'groups'] as const).map(f => {
            const active = filter === f;
            return (
              <Pressable key={f} onPress={() => { Haptics.selectionAsync(); setFilter(f); }} style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, backgroundColor: active ? colors.accent : colors.surfaceAlt, borderWidth: 1, borderColor: active ? colors.accent : '#2A3942' }}>
                <Text style={{ color: active ? '#0B141A' : colors.muted, fontSize: 12.5, fontWeight: '800', textTransform: 'capitalize' }}>{f}</Text>
              </Pressable>
            );
          })}
          <Pressable onPress={() => { Haptics.selectionAsync(); setShowArchived(v => !v); }} style={{ marginLeft: 'auto', flexDirection: 'row', gap: 6, alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, backgroundColor: colors.surface, borderWidth: 1, borderColor: '#2A3942' }}>
            <Icon.shield size={12} color={colors.faint} />
            <Text style={{ color: colors.faint, fontSize: 12, fontWeight: '700' }}>{showArchived ? 'Active' : 'Archived'}</Text>
          </Pressable>
        </View>
      </Animated.View>

      {/* Security strip */}
      <View style={{ marginHorizontal: 12, backgroundColor: '#182229', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 9, flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: '#1F2C34', marginBottom: 6 }}>
        <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: 'rgba(83,189,235,0.15)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(83,189,235,0.25)' }}>
          <Icon.lock size={12} color="#53BDEB" />
        </View>
        <Text style={{ color: '#8696A0', fontSize: 11, fontWeight: '600', flex: 1, lineHeight: 14 }}>Your messages are end-to-end encrypted. Tap any chat for safety number.</Text>
        <Pressable onPress={() => Alert.alert('E2EE', 'Signal double-ratchet \u00B7 X25519 \u00B7 AES-256-GCM \u00B7 Keys never leave this device.')}><Text style={{ color: '#53BDEB', fontSize: 11, fontWeight: '800' }}>Learn more</Text></Pressable>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={i => i.id}
        renderItem={({ item }) => {
          const last = msgs[item.id]?.[msgs[item.id].length - 1];
          const unread = msgs[item.id]?.filter(m => m.from !== ME_ID && m.status !== 'read').length ?? 0;
          return (
            <View style={{ borderBottomWidth: 1, borderBottomColor: '#1F2C34' }}>
              <ChatRow chat={item} last={last} unread={filter === 'unread' ? unread : item.pinned ? 0 : unread} onPress={() => openChat(item.id)} />
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={{ padding: 40, alignItems: 'center', gap: 12 }}>
            <View style={{ width: 56, height: 56, borderRadius: 18, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#2A3942' }}>
              <Icon.search size={22} color={colors.faint} />
            </View>
            <Text style={{ color: colors.text, fontWeight: '800', fontSize: 15 }}>No chats</Text>
            <Text style={{ color: colors.faint, fontSize: 12, textAlign: 'center', maxWidth: 260, lineHeight: 16 }}>Start a verified conversation \u2014 keys never leave your device.</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 96 }}
      />

      {/* FABs */}
      <View style={{ position: 'absolute', right: 16, bottom: 18, gap: 12, alignItems: 'center' }}>
        <Pressable onPress={() => { Haptics.selectionAsync(); Alert.alert('New group', 'Group chats are E2EE \u2014 each member verifies safety numbers individually.'); }} style={{ backgroundColor: colors.surfaceAlt, width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#2A3942', elevation: 2 }}>
          <Icon.users size={20} color={colors.text} />
        </Pressable>
        <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); Alert.alert('New chat', 'Pick a contact \u2014 invite via QR or safety number.'); }} style={{ backgroundColor: colors.accent, width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', elevation: 6, shadowColor: colors.accent, shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 6 } }}>
          <Icon.edit size={22} color="#0B141A" />
        </Pressable>
      </View>
    </View>
  );
}
