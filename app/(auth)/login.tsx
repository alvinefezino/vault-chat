import { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import { useTheme } from '../../lib/theme';
import { useAuth } from '../../lib/auth';
import { Icon } from '../../lib/icons';
import { isFirebaseConfigured } from '../../lib/firebase';
import * as Haptics from 'expo-haptics';
import * as LocalAuth from 'expo-local-authentication';
import { signInWithGoogle } from '../../lib/google';

const emailOk = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());

export default function Login() {
  const { colors } = useTheme();
  const { sendLink, signInMock } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [hasStoredUser, setHasStoredUser] = useState(false);

  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 420, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 420, useNativeDriver: true }),
    ]).start();

    // Check if user has previously registered on this device
    (async () => {
      const stored = await SecureStore.getItemAsync('vault_auth_v1');
      if (stored) setHasStoredUser(true);
    })();
  }, []);

  const canSubmit = emailOk(email);

  const doLogin = async () => {
    if (!canSubmit) { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error); return; }
    setErr(''); setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      if (isFirebaseConfigured) {
        await sendLink(email);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.push({ pathname: '/(auth)/verify', params: { email: email.trim().toLowerCase() } } as any);
      } else {
        await signInMock({ id: 'me', name: email.split('@')[0] || 'Tobi', email: email.trim().toLowerCase(), phone: '', avatar: 'https://i.pravatar.cc/200?img=15' });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.replace('/(tabs)/chats' as any);
      }
    } catch (e: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setErr(e?.message ?? String(e));
    } finally { setLoading(false); }
  };

  const biometric = async () => {
    const has = await LocalAuth.hasHardwareAsync(); const enrolled = await LocalAuth.isEnrolledAsync();
    if (!has || !enrolled) { setErr('No Face ID / fingerprint enrolled on this device.'); return; }
    const r = await LocalAuth.authenticateAsync({ promptMessage: 'Unlock Vault' });
    if (r.success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const stored = await SecureStore.getItemAsync('vault_auth_v1');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          await signInMock(parsed);
          router.replace('/(tabs)/chats' as any);
          return;
        } catch {}
      }
      await signInMock({ id: 'me', name: 'Tobi', email: 'tobi@vault.local', phone: '', avatar: 'https://i.pravatar.cc/200?img=15' });
      router.replace('/(tabs)/chats' as any);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 28 }} keyboardShouldPersistTaps="handled">
          <Animated.View style={{ opacity: fade, transform: [{ translateY: slide }], alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <View style={{ width: 64, height: 64, borderRadius: 20, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' }}>
              <Icon.shieldDone size={30} color="#0B141A" />
            </View>
            <Text style={{ color: colors.text, fontSize: 28, fontWeight: '900', letterSpacing: -0.6 }}>Vault</Text>
            <Text style={{ color: colors.muted, fontSize: 13, textAlign: 'center', lineHeight: 18, maxWidth: 280 }}>
              Your messages are yours. Encrypted, always · your privacy is protected.
            </Text>
          </Animated.View>

          <Animated.View style={{ opacity: fade, transform: [{ translateY: slide }], backgroundColor: colors.surfaceAlt, borderRadius: 24, padding: 18, gap: 14, borderWidth: 1, borderColor: '#2A3942' }}>
            <Text style={{ color: colors.text, fontSize: 18, fontWeight: '800' }}>Welcome back</Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.surfaceAlt, borderRadius: 16, paddingHorizontal: 14, height: 52, borderWidth: 1.5, borderColor: email.length ? (emailOk(email) ? colors.accent : '#F15C6D') : '#2A3942' }}>
              <Icon.message size={16} color="#667781" />
              <TextInput value={email} onChangeText={setEmail} placeholder="you@example.com" placeholderTextColor="#667781" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} style={{ flex: 1, color: colors.text, fontSize: 15, fontWeight: '500' }} />
            </View>

            {err ? <View style={{ backgroundColor: '#2A0F14', borderWidth: 1, borderColor: '#421A20', borderRadius: 12, padding: 10, flexDirection: 'row', gap: 8, alignItems: 'center' }}><Icon.alert size={16} color="#F15C6D" /><Text style={{ color: '#F8A0AA', fontSize: 12, flex: 1 }}>{err}</Text></View> : null}

            <Pressable onPress={doLogin} disabled={!canSubmit || loading} style={{ backgroundColor: canSubmit ? colors.accent : '#1F2C34', height: 52, borderRadius: 999, alignItems: 'center', justifyContent: 'center', opacity: loading ? 0.8 : 1 }}>
              {loading ? <ActivityIndicator color="#0B141A" /> : <Text style={{ color: canSubmit ? '#0B141A' : '#667781', fontSize: 15, fontWeight: '900' }}>{isFirebaseConfigured ? 'Send verification link' : 'Continue'}</Text>}
            </Pressable>

            {isFirebaseConfigured && (
              <Pressable onPress={async () => { await signInWithGoogle(); }} style={{ height: 52, borderRadius: 999, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, borderWidth: 1, borderColor: '#2A3942', backgroundColor: colors.surface, marginTop: 14 }}>
                <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700' }}>Sign in with Google</Text>
              </Pressable>
            )}

            {/* ONLY render biometrics if a registered user session exists on device */}
            {hasStoredUser && (
              <>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={{ flex: 1, height: 1, backgroundColor: '#1F2C34' }} /><Text style={{ color: colors.faint, fontSize: 11, fontWeight: '700' }}>OR</Text><View style={{ flex: 1, height: 1, backgroundColor: '#1F2C34' }} />
                </View>

                <Pressable onPress={biometric} style={{ height: 52, borderRadius: 999, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, borderWidth: 1, borderColor: '#2A3942', backgroundColor: colors.surface }}>
                  <Icon.shieldDone size={18} color={colors.accent} /><Text style={{ color: colors.text, fontSize: 14, fontWeight: '700' }}>Continue with biometrics</Text>
                </Pressable>
              </>
            )}
          </Animated.View>

          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 18 }}>
            <Text style={{ color: colors.faint, fontSize: 13 }}>New to Vault?</Text>
            <Pressable onPress={() => { Haptics.selectionAsync(); router.push('/(auth)/signup' as any); }}><Text style={{ color: colors.accent, fontSize: 13, fontWeight: '800' }}>Create account</Text></Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}