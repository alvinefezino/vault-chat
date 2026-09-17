import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, palette } from '../lib/theme';
import { AuthProvider } from '../lib/auth';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider style={{ backgroundColor: palette.bg }}>
        <ThemeProvider>
          <AuthProvider>
            <StatusBar style="light" backgroundColor={palette.bg} />
            <Stack
              screenOptions={{
                headerStyle: { backgroundColor: palette.bg },
                headerTintColor: '#E9EDEF',
                headerTitleStyle: { fontWeight: '700' },
                contentStyle: { backgroundColor: palette.bg },
                animation: 'slide_from_right',
              }}
            >
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false, animation: 'fade' }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="chat/[id]" options={{ headerShown: false }} />
              <Stack.Screen name="profile" options={{ title: 'Profile', headerBackTitle: 'Back' }} />
            </Stack>
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}