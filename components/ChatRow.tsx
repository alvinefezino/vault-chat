import { View, Text, Pressable, Image, Animated } from 'react-native';
import { useRef } from 'react';
import { useTheme } from '../lib/theme';
import { Icon } from '../lib/icons';
import type { Chat, Message } from '../lib/types';
import * as Haptics from 'expo-haptics';

export function ChatRow({ chat, last, onPress, unread = 0 }: { chat: Chat; last?: Message; onPress: () => void; unread?: number }) {
  const { colors, prefs } = useTheme();
  const compact = prefs.density === 'compact';
  const scale = useRef(new Animated.Value(1)).current;
  const onIn = () => Animated.spring(scale, { toValue: 0.98, useNativeDriver: true, speed: 50, bounciness: 0 }).start();
  const onOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50, bounciness: 0 }).start();
  const press = () => { Haptics.selectionAsync(); onPress(); };
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable onPress={press} onPressIn={onIn} onPressOut={onOut} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: compact ? 10 : 14, gap: 12, backgroundColor: colors.surface }}>
        <View>
          <Image source={{ uri: chat.avatar }} style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: '#1a2a33' }} />
          {chat.verified && (
            <View style={{ position: 'absolute', right: -2, bottom: -2, backgroundColor: colors.accent, borderRadius: 10, width: 18, height: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.surface }}>
              <Icon.check size={10} color="#0B141A" />
            </View>
          )}
          {chat.pinned && (
            <View style={{ position: 'absolute', top: -6, left: -6, backgroundColor: '#1F2C34', borderRadius: 8, paddingHorizontal: 4, paddingVertical: 2, borderWidth: 1, borderColor: '#2A3942' }}>
              <Icon.pin size={10} color="#AEBAC1" />
            </View>
          )}
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text numberOfLines={1} style={{ color: colors.text, fontSize: 16, fontWeight: '700', flex: 1, letterSpacing: -0.2 }}>
              {chat.name}{chat.type === 'group' ? '  \u00B7  ' + chat.participants.length : ''}
            </Text>
            <Text style={{ color: colors.faint, fontSize: 12, marginLeft: 8, fontWeight: '500' }}>{last ? new Date(last.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 3 }}>
            {chat.disappearingTimer ? <Icon.clock size={12} color="#FFD279" /> : null}
            {chat.muted ? <Icon.mute size={12} color={colors.faint} /> : null}
            <Text numberOfLines={1} style={{ color: unread > 0 ? colors.text : colors.muted, fontSize: 14, flex: 1, fontWeight: unread > 0 ? '600' : '400' }}>
              {last ? (last.media ? (last.media.type === 'audio' ? 'Voice message' : last.media.type) : last.text) : 'Tap to open \u2014 keys stay on device'}
            </Text>
            {unread > 0 && (
              <View style={{ backgroundColor: colors.accent, borderRadius: 999, minWidth: 22, height: 22, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 }}>
                <Text style={{ color: '#0B141A', fontSize: 11, fontWeight: '900' }}>{unread > 99 ? '99+' : unread}</Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}
