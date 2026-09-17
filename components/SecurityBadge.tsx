import { View, Text } from 'react-native';
import { useTheme } from '../lib/theme';
import { Icon } from '../lib/icons';

export function SecurityBadge({ text = 'end-to-end encrypted' }: { text?: string }) {
  return (
    <View style={{ alignSelf: 'center', backgroundColor: '#182229', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7, flexDirection: 'row', alignItems: 'center', gap: 7, borderWidth: 1, borderColor: '#1F2C34' }}>
      <Icon.lock size={12} color="#53BDEB" />
      <Text style={{ color: '#8696A0', fontSize: 11, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase' }}>{text}</Text>
    </View>
  );
}
