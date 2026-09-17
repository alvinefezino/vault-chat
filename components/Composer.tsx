import { View, TextInput, Pressable, Animated } from 'react-native';
import { useState, useRef } from 'react';
import { useTheme } from '../lib/theme';
import { Icon } from '../lib/icons';
import * as Haptics from 'expo-haptics';

export function Composer({ onSend, onAttach, placeholder = 'Message \u2014 end-to-end encrypted' }: { onSend: (t: string) => void; onAttach?: () => void; placeholder?: string }) {
  const { colors } = useTheme();
  const [v, setV] = useState('');
  const [focused, setFocused] = useState(false);
  const sendScale = useRef(new Animated.Value(1)).current;
  const canSend = v.trim().length > 0;
  const doSend = () => {
    if (!canSend) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.sequence([
      Animated.timing(sendScale, { toValue: 0.9, duration: 80, useNativeDriver: true }),
      Animated.spring(sendScale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 6 }),
    ]).start();
    onSend(v.trim());
    setV('');
  };
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8, padding: 10, backgroundColor: colors.bg, borderTopWidth: 1, borderTopColor: '#1F2C34' }}>
      <Pressable onPress={() => { Haptics.selectionAsync(); onAttach?.(); }} style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#2A3942' }}>
        <Icon.attach size={18} color={colors.muted} />
      </Pressable>
      <View style={{ flex: 1, backgroundColor: colors.surfaceAlt, borderRadius: 24, paddingHorizontal: 14, paddingVertical: 6, flexDirection: 'row', alignItems: 'flex-end', borderWidth: 1.5, borderColor: focused ? 'rgba(0,168,132,0.4)' : '#2A3942', minHeight: 44 }}>
        <TextInput
          value={v}
          onChangeText={setV}
          placeholder={placeholder}
          placeholderTextColor="#667781"
          style={{ flex: 1, color: colors.text, fontSize: 15, paddingVertical: 6, maxHeight: 110 }}
          multiline
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        <Pressable onPress={() => Haptics.selectionAsync()} style={{ padding: 6, marginLeft: 4 }}>
          <Icon.smile size={20} color="#667781" />
        </Pressable>
      </View>
      <Animated.View style={{ transform: [{ scale: sendScale }] }}>
        <Pressable onPress={doSend} style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: canSend ? colors.accent : '#1F2C34', alignItems: 'center', justifyContent: 'center' }}>
          <Icon.send size={18} color={canSend ? '#0B141A' : '#667781'} />
        </Pressable>
      </Animated.View>
    </View>
  );
}
