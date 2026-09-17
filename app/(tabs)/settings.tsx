import { useState } from 'react';
import { View, Text, ScrollView, Pressable, Switch, Alert, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../lib/theme';
import { useAuth } from '../../lib/auth';
import { Icon } from '../../lib/icons';
import * as LocalAuth from 'expo-local-authentication';
import { SecurityPolicy } from '../../lib/security';
import * as Haptics from 'expo-haptics';

export default function Settings() {
  const { colors, prefs, setPrefs } = useTheme();
  const { signOut, user } = useAuth();
  const router = useRouter();
  const [bio, setBio] = useState(prefs.lockEnabled);

  const toggleBio = async (v: boolean) => {
    Haptics.selectionAsync();
    if (v) {
      const has = await LocalAuth.hasHardwareAsync();
      const enrolled = await LocalAuth.isEnrolledAsync();
      if (!has || !enrolled) { Alert.alert('Biometrics unavailable', 'No biometrics enrolled on this device.'); return; }
      const res = await LocalAuth.authenticateAsync({ promptMessage: 'Enable Vault App Lock' });
      if (!res.success) return;
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setBio(v);
    setPrefs({ lockEnabled: v });
  };

  const Card = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: any }) => (
    <View style={{ backgroundColor: colors.surfaceAlt, borderRadius: 20, padding: 16, gap: 12, borderWidth: 1, borderColor: '#2A3942' }}>
      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
        <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: '#111B21', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#1F2C34' }}>{icon}</View>
        <Text style={{ color: colors.text, fontWeight: '900', fontSize: 12.5, letterSpacing: 0.6, textTransform: 'uppercase' }}>{title}</Text>
      </View>
      {children}
    </View>
  );
  const Row = ({ label, desc, icon, right }: { label: string; desc?: string; icon?: React.ReactNode; right: any }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 9 }}>
      {icon ? <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: '#111B21', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#1F2C34' }}>{icon}</View> : null}
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.text, fontWeight: '700', fontSize: 14 }}>{label}</Text>
        {desc ? <Text style={{ color: colors.faint, fontSize: 11, marginTop: 2, lineHeight: 13 }}>{desc}</Text> : null}
      </View>
      {right}
    </View>
  );
  const Divider = () => <View style={{ height: 1, backgroundColor: '#1F2C34' }} />;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 12, gap: 12, paddingBottom: 28 }}>
      {/* Profile */}
      <Pressable onPress={() => { Haptics.selectionAsync(); router.push('/profile' as any); }} style={{ backgroundColor: colors.surfaceAlt, borderRadius: 20, padding: 16, flexDirection: 'row', gap: 14, alignItems: 'center', borderWidth: 1, borderColor: '#2A3942' }}>
        <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#0B141A', fontWeight: '900', fontSize: 18 }}>{(user?.name ?? 'T').slice(0, 1).toUpperCase()}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
            <Text style={{ color: colors.text, fontWeight: '900', fontSize: 16 }}>{user?.name ?? 'Tobi'}</Text>
            <View style={{ backgroundColor: colors.accent, width: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}><Icon.check size={10} color="#0B141A" /></View>
          </View>
          <Text style={{ color: colors.faint, fontSize: 12, marginTop: 2 }}>{user?.phone ?? 'Vault founder · E2EE everywhere'}</Text>
          <View style={{ flexDirection: 'row', gap: 6, marginTop: 6 }}>
            <View style={{ backgroundColor: '#182229', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, borderWidth: 1, borderColor: '#1F2C34', flexDirection: 'row', gap: 4, alignItems: 'center' }}>
              <Icon.lock size={10} color="#53BDEB" /><Text style={{ color: '#8696A0', fontSize: 10, fontWeight: '800' }}>ENCRYPTED</Text>
            </View>
            <View style={{ backgroundColor: '#182229', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, borderWidth: 1, borderColor: '#1F2C34', flexDirection: 'row', gap: 4, alignItems: 'center' }}>
              <Icon.shieldDone size={10} color={colors.accent} /><Text style={{ color: '#8696A0', fontSize: 10, fontWeight: '800' }}>VERIFIED</Text>
            </View>
          </View>
        </View>
        <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#111B21', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#1F2C34' }}>
          <Icon.qr size={18} color={colors.accent} />
        </View>
      </Pressable>

      <Card title="Security & privacy" icon={<Icon.shield size={14} color={colors.accent} />}>
        <Row icon={<Icon.shieldDone size={16} color="#53BDEB" />} label="App Lock" desc="Face ID / fingerprint to open Vault" right={<Switch value={bio} onValueChange={toggleBio} trackColor={{ false: '#2A3942', true: colors.accent }} thumbColor="#fff" />} />
        <Divider />
        <Pressable onPress={() => Alert.alert('End-to-end encryption', `${SecurityPolicy.e2ee.protocol}. Tap a chat header to verify safety numbers.`)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 9 }}>
          <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: '#111B21', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#1F2C34' }}><Icon.lock size={16} color="#53BDEB" /></View>
          <View style={{ flex: 1 }}><Text style={{ color: colors.text, fontWeight: '700', fontSize: 14 }}>End-to-end encryption</Text><Text style={{ color: colors.faint, fontSize: 11, marginTop: 2 }}>{SecurityPolicy.e2ee.protocol} · Tap to verify safety numbers.</Text></View>
          <Icon.chevron size={16} color={colors.faint} />
        </Pressable>
        <Divider />
        <Row icon={<Icon.clock size={16} color="#FFD279" />} label="Disappearing messages" desc="Default timer for new chats" right={
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {[0, 86400, 604800].map(v => (
              <Pressable key={v} onPress={() => { Haptics.selectionAsync(); Alert.alert('Default timer', v ? `${v / 86400} days` : 'Off'); }} style={{ paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, backgroundColor: '#111B21', borderWidth: 1, borderColor: '#2A3942' }}>
                <Text style={{ color: colors.muted, fontSize: 11, fontWeight: '800' }}>{v === 0 ? 'Off' : v === 86400 ? '24h' : '7d'}</Text>
              </Pressable>
            ))}
          </View>
        } />
        <Divider />
        <Row icon={<Icon.eyeOff size={16} color="#AEBAC1" />} label="Screenshot detection" desc="Notify sender when a disappearing photo is captured" right={<Switch value={true} trackColor={{ false: '#2A3942', true: colors.accent }} thumbColor="#fff" onValueChange={() => Haptics.selectionAsync()} />} />
        <Divider />
        <Pressable onPress={() => Alert.alert('Block & report', 'Reports send only the reported message · your consent required.')} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 9 }}>
          <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(241,92,109,0.1)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(241,92,109,0.2)' }}><Icon.flag size={14} color="#F15C6D" /></View>
          <View style={{ flex: 1 }}><Text style={{ color: colors.text, fontWeight: '700', fontSize: 14 }}>Block & report</Text><Text style={{ color: colors.faint, fontSize: 11, marginTop: 2 }}>Reports send only the reported message · your consent required</Text></View>
          <Icon.chevron size={16} color={colors.faint} />
        </Pressable>
      </Card>

      <Card title="Customization · local only" icon={<Icon.settings size={14} color="#A78BFA" />}>
        <Text style={{ color: colors.faint, fontSize: 11, lineHeight: 14 }}>Themes, bubbles, and wallpapers are stored locally. Server never sees your choices · no metadata leakage.</Text>
        <Row icon={<View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: prefs.accent, borderWidth: 1, borderColor: '#fff' }} />} label="Accent color" right={
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {['#00A884', '#53BDEB', '#FF8A65', '#A78BFA', '#F15C6D'].map(c => (
              <Pressable key={c} onPress={() => { Haptics.selectionAsync(); setPrefs({ accent: c }); }} style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: c, borderWidth: prefs.accent === c ? 2.5 : 1, borderColor: prefs.accent === c ? '#fff' : '#2A3942' }} />
            ))}
          </View>
        } />
        <Divider />
        <Row icon={<Icon.message size={14} color={colors.muted} />} label="Bubble shape" desc={`${prefs.bubbleRadius}px radius`} right={
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {[8, 16, 22].map(r => (
              <Pressable key={r} onPress={() => { Haptics.selectionAsync(); setPrefs({ bubbleRadius: r }); }} style={{ paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, backgroundColor: prefs.bubbleRadius === r ? colors.accent : colors.surface, borderWidth: 1, borderColor: '#2A3942' }}>
                <Text style={{ color: prefs.bubbleRadius === r ? '#0B141A' : colors.muted, fontSize: 12, fontWeight: '800' }}>{r}</Text>
              </Pressable>
            ))}
          </View>
        } />
        <Divider />
        <Row icon={<Text style={{ fontSize: 12, color: colors.muted, fontWeight: '800' }}>Aa</Text>} label="Font size" desc={`${Math.round(prefs.fontScale * 100)}%`} right={
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {[0.85, 1, 1.15].map(s => (
              <Pressable key={s} onPress={() => { Haptics.selectionAsync(); setPrefs({ fontScale: s }); }} style={{ paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, backgroundColor: prefs.fontScale === s ? colors.accent : colors.surface, borderWidth: 1, borderColor: '#2A3942' }}>
                <Text style={{ color: prefs.fontScale === s ? '#0B141A' : colors.muted, fontSize: 11, fontWeight: '800' }}>{s === 0.85 ? 'Small' : s === 1 ? 'Default' : 'Large'}</Text>
              </Pressable>
            ))}
          </View>
        } />
        <Divider />
        <Row icon={<Icon.globe size={14} color={colors.muted} />} label="Density" right={
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {(['comfortable', 'compact'] as const).map(d => (
              <Pressable key={d} onPress={() => { Haptics.selectionAsync(); setPrefs({ density: d }); }} style={{ paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, backgroundColor: prefs.density === d ? colors.accent : colors.surface, borderWidth: 1, borderColor: '#2A3942' }}>
                <Text style={{ color: prefs.density === d ? '#0B141A' : colors.muted, fontSize: 11, fontWeight: '800', textTransform: 'capitalize' }}>{d}</Text>
              </Pressable>
            ))}
          </View>
        } />
        <Divider />
        <Row icon={<Icon.image size={14} color={colors.muted} />} label="Wallpaper" right={
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {(['graphite', 'dots', 'gradient', 'none'] as const).map(w => (
              <Pressable key={w} onPress={() => { Haptics.selectionAsync(); setPrefs({ wallpaper: w }); }} style={{ paddingHorizontal: 10, paddingVertical: 7, borderRadius: 999, backgroundColor: prefs.wallpaper === w ? colors.accent : colors.surface, borderWidth: 1, borderColor: '#2A3942' }}>
                <Text style={{ color: prefs.wallpaper === w ? '#0B141A' : colors.muted, fontSize: 11, fontWeight: '800', textTransform: 'capitalize' }}>{w}</Text>
              </Pressable>
            ))}
          </View>
        } />
      </Card>

      <Card title="What's included" icon={<Icon.check size={14} color={colors.accent} />}>
        <Text style={{ color: colors.muted, fontSize: 12, lineHeight: 19 }}>
          \u2022 1:1 & group chats (256) · Broadcast lists{`\n`}
          \u2022 Text, image, video, audio, file, location, contact, poll{`\n`}
          \u2022 Voice notes (waveform, local), view-once media, disappearing messages{`\n`}
          \u2022 Reactions, reply, forward, star, pin, mute, archive, block{`\n`}
          \u2022 Typing & online indicators, last seen, read receipts (per-member in groups){`\n`}
          \u2022 Voice & video calls, group calls, call links{`\n`}
          \u2022 Starred messages, chat export, storage manager{`\n`}
          \u2022 Feed: chronological, follower-only, E2EE, no ads · your graph, your rules
        </Text>
      </Card>

      <Pressable onPress={async () => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); await signOut(); router.replace('/(auth)/login' as any); }} style={{ backgroundColor: '#2A0F14', borderWidth: 1, borderColor: '#421A20', borderRadius: 16, paddingVertical: 14, alignItems: 'center', flexDirection: 'row', gap: 8, justifyContent: 'center' }}>
        <Icon.logout size={16} color="#F15C6D" />
        <Text style={{ color: '#F15C6D', fontWeight: '900', fontSize: 14 }}>Sign out</Text>
      </Pressable>

      <View style={{ alignItems: 'center', paddingVertical: 8, gap: 6 }}>
        <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
          <Icon.shieldDone size={12} color={colors.faint} />
          <Text style={{ color: colors.faint, fontSize: 11 }}>Vault v1.0 · Local-first · Keys in SecureStore</Text>
        </View>
        <Text style={{ color: '#3B4A54', fontSize: 10 }}>Auditable at lib/crypto.ts & lib/security.ts</Text>
      </View>
    </ScrollView>
  );
}
