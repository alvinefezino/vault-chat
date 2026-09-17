import { View, Text, Pressable, Animated } from 'react-native';
import { useRef } from 'react';
import { useTheme } from '../lib/theme';
import { Icon } from '../lib/icons';
import type { Message } from '../lib/types';
import * as Haptics from 'expo-haptics';

function StatusTicks({ s, isMe }: { s: Message['status']; isMe: boolean }) {
  const { colors } = useTheme();
  if (!isMe) return null;
  const read = s === 'read';
  const color = read ? '#53BDEB' : isMe ? 'rgba(11,20,26,0.55)' : '#8696A0';
  if (s === 'sending') return <Text style={{ fontSize: 10, color }}>\u25f7</Text>;
  if (s === 'failed') return <Icon.alert size={12} color="#F15C6D" />;
  if (s === 'sent') return <Icon.check size={12} color={color} />;
  // delivered / read = double
  return (
    <View style={{ flexDirection: 'row', marginLeft: 1 }}>
      <Icon.check size={12} color={color} />
      <View style={{ marginLeft: -5 }}><Icon.check size={12} color={color} /></View>
    </View>
  );
}

export function MessageBubble({ m, isMe, onLong }: { m: Message; isMe: boolean; onLong?: () => void }) {
  const { colors, prefs } = useTheme();
  const bg = isMe ? colors.accent : colors.surfaceAlt;
  const fg = isMe ? '#0B141A' : colors.text;
  const r = prefs.bubbleRadius;
  const scale = useRef(new Animated.Value(1)).current;
  const handleLong = () => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); onLong?.(); };
  return (
    <Pressable onLongPress={handleLong} delayLongPress={280} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '78%' }}>
      <Animated.View
        style={{
          backgroundColor: bg,
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: r,
          borderBottomRightRadius: isMe ? 4 : r,
          borderBottomLeftRadius: !isMe ? 4 : r,
          marginVertical: 3,
          borderWidth: isMe ? 0 : 1,
          borderColor: '#2A3942',
          transform: [{ scale }],
        }}
      >
        {m.replyTo ? (
          <View style={{ borderLeftWidth: 3, borderLeftColor: isMe ? 'rgba(11,20,26,0.35)' : colors.accent, paddingLeft: 8, marginBottom: 6, opacity: 0.9, backgroundColor: isMe ? 'rgba(0,0,0,0.06)' : 'rgba(0,168,132,0.08)', borderRadius: 6, paddingVertical: 4 }}>
            <Text style={{ color: fg, opacity: 0.7, fontSize: 11, fontWeight: '700' }}>Replying</Text>
          </View>
        ) : null}
        {m.media ? (
          <View style={{ backgroundColor: isMe ? 'rgba(0,0,0,0.08)' : 'rgba(0,0,0,0.18)', borderRadius: 10, padding: 10, marginBottom: m.text ? 6 : 0, flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            {m.media.type === 'audio' ? <Icon.phone size={14} color={fg} /> : m.media.type === 'image' ? <Icon.image size={14} color={fg} /> : <Icon.file size={14} color={fg} />}
            <Text style={{ color: fg, fontSize: 12, fontWeight: '600' }}>{m.media.type === 'audio' ? '0:12  \u00B7  waveform encrypted locally' : m.media.type === 'image' ? 'Encrypted image' : 'Encrypted file'}</Text>
          </View>
        ) : null}
        {m.text ? <Text style={{ color: fg, fontSize: 14.5 * prefs.fontScale, lineHeight: 20, fontWeight: '400' }}>{m.text}</Text> : null}
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 5, marginTop: 5 }}>
          {m.disappearing ? <Icon.clock size={10} color={isMe ? 'rgba(11,20,26,0.6)' : '#8696A0'} /> : null}
          <Text style={{ fontSize: 11, color: isMe ? 'rgba(11,20,26,0.6)' : '#8696A0', fontWeight: '500' }}>{new Date(m.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
          <StatusTicks s={m.status} isMe={isMe} />
          <Icon.lock size={9} color={isMe ? 'rgba(11,20,26,0.4)' : '#3B4A54'} />
        </View>
      </Animated.View>
    </Pressable>
  );
}
