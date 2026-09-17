import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../lib/auth';
import { palette } from '../lib/theme';

export default function Index() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: palette.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={palette.accent} />
      </View>
    );
  }
  if (user) return <Redirect href="/(tabs)/chats" />;
  return <Redirect href="/(auth)/login" />;
}
