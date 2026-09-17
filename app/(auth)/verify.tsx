import { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../lib/theme';
import { Icon } from '../../lib/icons';
import * as Haptics from 'expo-haptics';

export default function Verify() {
  const { colors } = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Simulate checkmark animation
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <Animated.View style={{ opacity: fade, transform: [{ scale }], alignItems: 'center', gap: 16 }}>
        <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.accent }}>
          <Icon.check size={50} color={colors.accent} />
        </View>
        <Text style={{ color: colors.text, fontSize: 24, fontWeight: '900', textAlign: 'center' }}>Check your email</Text>
        <Text style={{ color: colors.muted, fontSize: 14, textAlign: 'center', maxWidth: 280 }}>We have sent a verification link to your email. Please click it to verify your account.</Text>
      </Animated.View>
      <Pressable onPress={() => router.replace('/(auth)/login')} style={{ marginTop: 40 }}>
        <Text style={{ color: colors.accent, fontWeight: '800' }}>Back to login</Text>
      </Pressable>
    </View>
  );
}