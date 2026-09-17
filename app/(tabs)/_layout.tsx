import { Tabs } from 'expo-router';
import { View, Text, Pressable, Platform } from 'react-native';
import { useTheme, palette } from '../../lib/theme';
import { Icon } from '../../lib/icons';
import * as Haptics from 'expo-haptics';

function TabIcon({ focused, label, children }: { focused: boolean; label: string; children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', gap: 3, paddingTop: 4, minWidth: 56 }}>
      <View
        style={{
          paddingHorizontal: focused ? 14 : 10,
          paddingVertical: 5,
          borderRadius: 999,
          backgroundColor: focused ? '#1A2E2A' : 'transparent',
          borderWidth: focused ? 1 : 0,
          borderColor: focused ? 'rgba(0,168,132,0.25)' : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </View>
      <Text
        style={{
          fontSize: 10.5,
          fontWeight: focused ? '800' : '600',
          letterSpacing: 0.3,
          color: focused ? colors.accent : colors.faint,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  const { colors } = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.bg },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '900', fontSize: 18, letterSpacing: -0.3 },
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor: colors.bg,
          borderTopColor: '#1F2C34',
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 84 : 72,
          paddingTop: 6,
          paddingBottom: Platform.OS === 'ios' ? 22 : 10,
          paddingHorizontal: 8,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.faint,
        tabBarHideOnKeyboard: true,
        animation: 'shift',
      }}
    >
      <Tabs.Screen
        name="chats"
        options={{
          title: 'Vault',
          headerTitle: 'Vault',
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Chats">
              <Icon.chats size={22} color={focused ? colors.accent : '#667781'} focused={focused} />
            </TabIcon>
          ),
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginRight: 14 }}>
              <View style={{ backgroundColor: '#182229', paddingHorizontal: 9, paddingVertical: 5, borderRadius: 999, borderWidth: 1, borderColor: '#1F2C34', flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <Icon.lock size={10} color="#53BDEB" />
                <Text style={{ color: '#8696A0', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 }}>ENCRYPTED</Text>
              </View>
            </View>
          ),
        }}
        listeners={{
          tabPress: () => Haptics.selectionAsync(),
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          title: 'Feed',
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Feed">
              <Icon.feed size={22} color={focused ? colors.accent : '#667781'} focused={focused} />
            </TabIcon>
          ),
        }}
        listeners={{ tabPress: () => Haptics.selectionAsync() }}
      />
      <Tabs.Screen
        name="calls"
        options={{
          title: 'Calls',
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Calls">
              <Icon.calls size={22} color={focused ? colors.accent : '#667781'} focused={focused} />
            </TabIcon>
          ),
        }}
        listeners={{ tabPress: () => Haptics.selectionAsync() }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Settings">
              <Icon.settings size={22} color={focused ? colors.accent : '#667781'} />
            </TabIcon>
          ),
        }}
        listeners={{ tabPress: () => Haptics.selectionAsync() }}
      />
    </Tabs>
  );
}
