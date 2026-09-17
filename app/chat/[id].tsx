import { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, FlatList, Pressable, Alert, Image, Modal, ScrollView, Animated } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../lib/theme';
import { Icon } from '../../lib/icons';
import { chats as seedChats, messages as seedMsgs, users, ME_ID } from '../../lib/mock';
import { MessageBubble } from '../../components/MessageBubble';
import { Composer } from '../../components/Composer';
import { SecurityBadge } from '../../components/SecurityBadge';
import { encryptForChat } from '../../lib/crypto';
import type { Message } from '../../lib/types';
import * as Haptics from 'expo-haptics';

export default function ChatThread() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const chatId = String(id);
  const { colors, prefs } = useTheme();
  const router = useRouter();
  const chat = useMemo(() => seedChats.find(c => c.id === chatId), [chatId]);
  const [msgs, setMsgs] = useState<Message[]>(() => seedMsgs[chatId] ?? []);
  const [showInfo, setShowInfo] = useState(false);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const listRef = useRef<FlatList>(null);
  const headerOpacity = useRef(new Animated.Value(0)).current;

  const [inCall, setInCall] = useState(false);

  useEffect(() => { Animated.timing(headerOpacity, { toValue: 1, duration: 260, useNativeDriver: true }).start(); }, []);
  useEffect(() => { setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100); }, [msgs.length]);

  if (!chat) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#2A3942' }}>
          <Icon.alert size={22} color={colors.faint} />
        </View>
        <Text style={{ color: colors.muted, fontWeight: '700' }}>Chat not found</Text>
        <Pressable onPress={() => router.back()} style={{ backgroundColor: colors.accent, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999 }}><Text style={{ color: '#0B141A', fontWeight: '800' }}>Go back</Text></Pressable>
      </SafeAreaView>
    );
  }

  const send = async (text: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const m: Message = { id: String(Date.now()), chatId, from: ME_ID, text, ts: Date.now(), status: 'sending', replyTo: replyTo?.id, disappearing: !!chat.disappearingTimer };
    setMsgs(v => [...v, m]);
    setReplyTo(null);
    try {
      await encryptForChat(chatId, text);
      setTimeout(() => setMsgs(v => v.map(x => (x.id === m.id ? { ...x, status: 'sent' as const } : x))), 400);
      setTimeout(() => setMsgs(v => v.map(x => (x.id === m.id ? { ...x, status: 'delivered' as const } : x))), 900);
      setTimeout(() => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); setMsgs(v => v.map(x => (x.id === m.id ? { ...x, status: 'read' as const } : x))); }, 1800);
      if (Math.random() > 0.3) {
        setTimeout(() => {
          const r: Message = { id: String(Date.now() + 1), chatId, from: chat.participants.find(p => p !== ME_ID) ?? 'u1', text: `Got it · “${text.slice(0, 40)}”`, ts: Date.now(), status: 'read' };
          Haptics.selectionAsync();
          setMsgs(v => [...v, r]);
        }, 1600);
      }
    } catch { setMsgs(v => v.map(x => (x.id === m.id ? { ...x, status: 'failed' as const } : x))); }
  };

  const startCall = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setInCall(true);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'left', 'right']}>
      {/* Header */}
      <Animated.View style={{ opacity: headerOpacity, height: 60, backgroundColor: colors.bg, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#1F2C34' }}>
        <Pressable onPress={() => { Haptics.selectionAsync(); router.back(); }} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#2A3942' }}>
          <Icon.back size={18} color={colors.text} />
        </Pressable>
        <Image source={{ uri: chat.avatar }} style={{ width: 38, height: 38, borderRadius: 19, borderWidth: 1, borderColor: chat.verified ? colors.accent : '#2A3942' }} />
        <Pressable onPress={() => { Haptics.selectionAsync(); setShowInfo(true); }} style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={{ color: colors.text, fontWeight: '900', fontSize: 15 }}>{chat.name}</Text>
            {chat.verified ? <View style={{ backgroundColor: colors.accent, width: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}><Icon.check size={10} color="#0B141A" /></View> : null}
          </View>
          <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center', marginTop: 1 }}>
            <Icon.lock size={10} color={colors.accent} />
            <Text style={{ color: colors.faint, fontSize: 11, fontWeight: '600' }}>{chat.type === 'group' ? `${chat.participants.length} members` : 'Encrypted'}</Text>
          </View>
        </Pressable>
        <Pressable onPress={startCall} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#2A3942' }}>
          <Icon.phone size={18} color={colors.accent} />
        </Pressable>
      </Animated.View>

      {/* Main chat */}
      <View style={{ flex: 1, backgroundColor: prefs.wallpaper === 'gradient' ? '#0B141A' : colors.bg }}>
        <View style={{ paddingTop: 10, paddingBottom: 6, gap: 6 }}>
          <SecurityBadge text={chat.disappearingTimer ? `Disappearing in ${chat.disappearingTimer / 3600}h` : 'End-to-end encrypted'} />
        </View>

        <FlatList
          ref={listRef}
          data={msgs}
          keyExtractor={m => m.id}
          contentContainerStyle={{ padding: 12, paddingBottom: 12 }}
          renderItem={({ item }) => <MessageBubble m={item} isMe={item.from === ME_ID} onLong={() => {}} />}
          ListFooterComponent={<View style={{ height: 12 }} />}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
        />

        <Composer onSend={send} onAttach={() => Alert.alert('Attach', 'Pick a file or photo to share securely.')} />
      </View>

      {/* Real In-Call Screen Overlay */}
      <Modal visible={inCall} animationType="fade" transparent={false}>
        <View style={{ flex: 1, backgroundColor: '#0B141A', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 60, paddingHorizontal: 20 }}>
          <View style={{ alignItems: 'center', gap: 16 }}>
            <Image source={{ uri: chat.avatar }} style={{ width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: colors.accent }} />
            <Text style={{ color: colors.text, fontSize: 26, fontWeight: '900' }}>{chat.name}</Text>
            <Text style={{ color: colors.accent, fontSize: 16, fontWeight: '700' }}>Calling · Secure audio</Text>
          </View>

          <View style={{ flexDirection: 'row', gap: 30, alignItems: 'center' }}>
            <Pressable onPress={() => { Haptics.selectionAsync(); Alert.alert('Mute', 'Microphone muted.'); }} style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' }}>
              <Icon.mute size={24} color={colors.text} />
            </Pressable>
            <Pressable onPress={() => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error); setInCall(false); }} style={{ width: 70, height: 70, borderRadius: 35, backgroundColor: '#F15C6D', alignItems: 'center', justifyContent: 'center' }}>
              <Icon.phone size={28} color="#FFF" />
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}