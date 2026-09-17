import { View, Text, Pressable, Image, ScrollView, Alert, Animated } from 'react-native';
import { useRef } from 'react';
import { useTheme } from '../../lib/theme';
import { Icon } from '../../lib/icons';
import { calls } from '../../lib/mock';
import * as Haptics from 'expo-haptics';

export default function Calls() {
  const { colors } = useTheme();
  const fabScale = useRef(new Animated.Value(1)).current;
  const pressFab = (fn: () => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.sequence([Animated.timing(fabScale, { toValue: 0.96, duration: 90, useNativeDriver: true }), Animated.spring(fabScale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 6 })]).start();
    fn();
  };
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ margin: 12, backgroundColor: colors.surfaceAlt, borderRadius: 16, padding: 14, flexDirection: 'row', gap: 12, alignItems: 'center', borderWidth: 1, borderColor: '#2A3942' }}>
        <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(83,189,235,0.12)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(83,189,235,0.22)' }}>
          <Icon.lock size={18} color="#53BDEB" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.text, fontWeight: '800', fontSize: 13.5 }}>Calls are end-to-end encrypted</Text>
          <Text style={{ color: colors.faint, fontSize: 11.5, marginTop: 3, lineHeight: 14 }}>Voice and video \u2014 keys stay on device. No call logs leave the phone.</Text>
        </View>
        <View style={{ backgroundColor: '#182229', paddingHorizontal: 9, paddingVertical: 5, borderRadius: 999, borderWidth: 1, borderColor: '#1F2C34', flexDirection: 'row', gap: 5, alignItems: 'center' }}>
          <Icon.shieldDone size={12} color={colors.accent} />
          <Text style={{ color: '#8696A0', fontSize: 10, fontWeight: '800', letterSpacing: 0.4 }}>E2EE</Text>
        </View>
      </View>

      <Animated.View style={{ transform: [{ scale: fabScale }], marginHorizontal: 12 }}>
        <Pressable onPress={() => pressFab(() => Alert.alert('New call', 'Pick a verified contact. Calls use E2EE + sealed sender where possible.'))} style={{ backgroundColor: colors.accent, borderRadius: 999, height: 48, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 }}>
          <Icon.phone size={16} color="#0B141A" />
          <Text style={{ color: '#0B141A', fontWeight: '900', fontSize: 14 }}>New call</Text>
        </Pressable>
      </Animated.View>

      <ScrollView contentContainerStyle={{ padding: 12, gap: 0 }}>
        {calls.map(c => (
          <Pressable key={c.id} onPress={() => { Haptics.selectionAsync(); Alert.alert('Call', `${c.type} call to ${c.user.name} \u2014 E2EE`); }} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#1F2C34' }}>
            <View>
              <Image source={{ uri: c.user.avatar }} style={{ width: 48, height: 48, borderRadius: 24, borderWidth: 1, borderColor: c.missed ? '#421A20' : '#1F2C34' }} />
              {c.missed ? (
                <View style={{ position: 'absolute', right: -2, bottom: -2, width: 18, height: 18, borderRadius: 9, backgroundColor: '#F15C6D', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.bg }}>
                  <Icon.phone size={10} color="#fff" />
                </View>
              ) : null}
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={{ color: c.missed ? '#F15C6D' : colors.text, fontWeight: '700', fontSize: 14.5 }}>{c.user.name}</Text>
                {c.missed ? <View style={{ backgroundColor: 'rgba(241,92,109,0.12)', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(241,92,109,0.2)' }}><Text style={{ color: '#F15C6D', fontSize: 10, fontWeight: '800' }}>MISSED</Text></View> : null}
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 }}>
                <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: c.missed ? 'rgba(241,92,109,0.12)' : '#111B21', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: c.missed ? 'rgba(241,92,109,0.2)' : '#1F2C34' }}>
                  <Text style={{ fontSize: 10, color: c.missed ? '#F15C6D' : '#667781' }}>{c.direction === 'in' ? '\u2199' : '\u2197'}</Text>
                </View>
                <Text style={{ color: colors.faint, fontSize: 12 }}>{new Date(c.ts).toLocaleString()} \u00B7 {c.missed ? 'No answer' : c.duration}</Text>
              </View>
            </View>
            <Pressable onPress={() => { Haptics.selectionAsync(); Alert.alert('Calling', `${c.type} call to ${c.user.name} \u2014 E2EE`); }} style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#2A3942' }}>
              {c.type === 'video' ? <Icon.video size={16} color={colors.accent} /> : <Icon.phone size={16} color={colors.accent} />}
            </Pressable>
          </Pressable>
        ))}
        <View style={{ padding: 18, alignItems: 'center', gap: 10, marginTop: 8 }}>
          <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#2A3942' }}>
            <Icon.shield size={18} color={colors.faint} />
          </View>
          <Text style={{ color: colors.faint, fontSize: 11, textAlign: 'center', lineHeight: 15, maxWidth: 280 }}>Call history is local and encrypted at rest. Clear it anytime in Settings \u2192 Privacy.</Text>
        </View>
      </ScrollView>
    </View>
  );
}
