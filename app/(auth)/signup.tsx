import { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../lib/theme';
import { useAuth } from '../../lib/auth';
import { Icon } from '../../lib/icons';
import { isFirebaseConfigured } from '../../lib/firebase';
import * as Haptics from 'expo-haptics';

const emailOk = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());

// EXRACTED OUTSIDE Signup so component reference remains stable and keyboard doesn't drop
function Field({ value, onChange, placeholder, icon, keyboardType = 'default' as any, colors }: any) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.surfaceAlt, borderRadius: 16, paddingHorizontal: 14, height: 52, borderWidth: 1.5, borderColor: focused ? colors.accent : '#2A3942' }}>
      <View style={{ opacity: focused ? 1 : 0.7 }}>{icon}</View>
      <TextInput 
        value={value} 
        onChangeText={onChange} 
        placeholder={placeholder} 
        placeholderTextColor="#667781" 
        keyboardType={keyboardType} 
        autoCapitalize="none" 
        autoCorrect={false} 
        onFocus={() => setFocused(true)} 
        onBlur={() => setFocused(false)} 
        style={{ flex: 1, color: colors.text, fontSize: 15, fontWeight: '500' }} 
      />
    </View>
  );
}

export default function Signup() {
  const { colors } = useTheme();
  const { sendLink, signInMock } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 420, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 420, useNativeDriver: true }),
    ]).start();
  }, []);

  const canSubmit = name.trim().length >= 2 && emailOk(email) && agree;

  const doSignup = async () => {
    if (!canSubmit) { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error); return; }
    setErr(''); setLoading(true); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      if (isFirebaseConfigured) {
        await sendLink(email);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.push('/(auth)/verify' as any);
      } else {
        await signInMock({ id: 'me', name: name.trim(), email: email.trim().toLowerCase(), phone: '', avatar: 'https://i.pravatar.cc/200?img=15' });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.replace('/(tabs)/chats' as any);
      }
    } catch (e: any) { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error); setErr(e?.message ?? String(e)); }
    finally { setLoading(false); }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 28 }} keyboardShouldPersistTaps="handled">
          <Pressable onPress={() => router.back()} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#2A3942', marginBottom: 14 }}>
            <Icon.back size={18} color={colors.text} />
          </Pressable>

          <Animated.View style={{ opacity: fade, transform: [{ translateY: slide }], gap: 6, marginBottom: 18 }}>
            <Text style={{ color: colors.text, fontSize: 26, fontWeight: '900', letterSpacing: -0.5 }}>Create your Vault</Text>
            <Text style={{ color: colors.muted, fontSize: 13, lineHeight: 18 }}>One account, everywhere encrypted. Your privacy is protected.</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#182229', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, borderWidth: 1, borderColor: '#1F2C34' }}><Icon.lock size={11} color="#53BDEB" /><Text style={{ color: '#8696A0', fontSize: 11, fontWeight: '700' }}>ENCRYPTED</Text></View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#182229', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, borderWidth: 1, borderColor: '#1F2C34' }}><Icon.shieldDone size={11} color="#00A884" /><Text style={{ color: '#8696A0', fontSize: 11, fontWeight: '700' }}>SECURE</Text></View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#182229', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, borderWidth: 1, borderColor: '#1F2C34' }}><Icon.eyeOff size={11} color="#AEBAC1" /><Text style={{ color: '#8696A0', fontSize: 11, fontWeight: '700' }}>NO ADS</Text></View>
            </View>
          </Animated.View>

          <Animated.View style={{ opacity: fade, transform: [{ translateY: slide }], backgroundColor: colors.surfaceAlt, borderRadius: 24, padding: 18, gap: 12, borderWidth: 1, borderColor: '#2A3942' }}>
            <Field value={name} onChange={setName} placeholder="Display name" icon={<Icon.users size={16} color="#667781" />} colors={colors} />
            <Field value={email} onChange={setEmail} placeholder="you@example.com" icon={<Icon.message size={16} color="#667781" />} keyboardType="email-address" colors={colors} />

            {err ? <View style={{ backgroundColor: '#2A0F14', borderWidth: 1, borderColor: '#421A20', borderRadius: 12, padding: 10, flexDirection: 'row', gap: 8 }}><Icon.alert size={16} color="#F15C6D" /><Text style={{ color: '#F8A0AA', fontSize: 12, flex: 1 }}>{err}</Text></View> : null}

            <Pressable onPress={() => { Haptics.selectionAsync(); setAgree(v => !v); }} style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start', paddingVertical: 4 }}>
              <View style={{ width: 20, height: 20, borderRadius: 6, borderWidth: 1.5, borderColor: agree ? colors.accent : '#2A3942', backgroundColor: agree ? colors.accent : 'transparent', alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>
                {agree ? <Icon.check size={12} color="#0B141A" /> : null}
              </View>
              <Text style={{ flex: 1, color: colors.muted, fontSize: 12, lineHeight: 16 }}>I agree to the Terms and understand my privacy is protected.</Text>
            </Pressable>

            <Pressable onPress={doSignup} disabled={!canSubmit || loading} style={{ backgroundColor: canSubmit ? colors.accent : '#1F2C34', height: 52, borderRadius: 999, alignItems: 'center', justifyContent: 'center' }}>
              {loading ? <ActivityIndicator color="#0B141A" /> : <Text style={{ color: canSubmit ? '#0B141A' : '#667781', fontSize: 15, fontWeight: '900' }}>{isFirebaseConfigured ? 'Send verification link' : 'Create account (mock)'}</Text>}
            </Pressable>
          </Animated.View>

          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 18 }}>
            <Text style={{ color: colors.faint, fontSize: 13 }}>Already have an account?</Text>
            <Pressable onPress={() => { Haptics.selectionAsync(); router.replace('/(auth)/login' as any); }}><Text style={{ color: colors.accent, fontSize: 13, fontWeight: '800' }}>Sign in</Text></Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}