import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Image, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../lib/theme';
import { useAuth } from '../lib/auth';
import { Icon } from '../lib/icons';
import * as Haptics from 'expo-haptics';

export default function ProfileScreen() {
  const { colors } = useTheme();
  const { user, ensureProfile, signOut } = useAuth();
  const router = useRouter();

  const [name, setName] = useState(user?.name ?? 'Tobi');
  const [avatar, setAvatar] = useState(user?.avatar ?? 'https://i.pravatar.cc/200?img=15');
  const [editing, setEditing] = useState(false);

  const save = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await ensureProfile(name, avatar);
    setEditing(false);
  };

  const pickImage = () => {
    Haptics.selectionAsync();
    Alert.alert('Change Photo', 'Select image source', [
      { text: 'Camera', onPress: () => Alert.alert('Camera', 'Access would open here.') },
      { text: 'Gallery', onPress: () => Alert.alert('Gallery', 'Photo library would open here.') },
      { text: 'Cancel', style: 'cancel' }
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }}>
        <View style={{ alignItems: 'center', gap: 12 }}>
          <View>
            <Image source={{ uri: avatar }} style={{ width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: colors.accent }} />
            {editing && (
              <Pressable 
                onPress={pickImage}
                style={{ position: 'absolute', right: 0, bottom: 0, backgroundColor: colors.accent, width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: colors.bg }}
              >
                <Icon.edit size={14} color="#0B141A" />
              </Pressable>
            )}
          </View>
          
          {editing ? (
            <View style={{ width: '100%', gap: 12 }}>
              <View style={{ gap: 4 }}>
                <Text style={{ color: colors.muted, fontSize: 12, marginLeft: 4 }}>Display Name</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Name"
                  placeholderTextColor="#667781"
                  style={{ backgroundColor: colors.surfaceAlt, color: colors.text, padding: 14, borderRadius: 16, borderWidth: 1, borderColor: '#2A3942' }}
                />
              </View>
              <View style={{ gap: 4 }}>
                <Text style={{ color: colors.muted, fontSize: 12, marginLeft: 4 }}>Avatar URL</Text>
                <TextInput
                  value={avatar}
                  onChangeText={setAvatar}
                  placeholder="https://..."
                  placeholderTextColor="#667781"
                  style={{ backgroundColor: colors.surfaceAlt, color: colors.text, padding: 14, borderRadius: 16, borderWidth: 1, borderColor: '#2A3942' }}
                />
              </View>
              <Pressable onPress={save} style={{ backgroundColor: colors.accent, height: 52, borderRadius: 999, alignItems: 'center', justifyContent: 'center', marginTop: 8 }}>
                <Text style={{ color: '#0B141A', fontWeight: '900', fontSize: 15 }}>Save Profile</Text>
              </Pressable>
              <Pressable onPress={() => setEditing(false)} style={{ alignItems: 'center' }}>
                <Text style={{ color: colors.muted, fontSize: 14 }}>Cancel</Text>
              </Pressable>
            </View>
          ) : (
            <>
              <Text style={{ color: colors.text, fontSize: 24, fontWeight: '900' }}>{name}</Text>
              <Text style={{ color: colors.muted, fontSize: 14 }}>{user?.email ?? 'tobi@vault.local'}</Text>
              <Pressable onPress={() => setEditing(true)} style={{ backgroundColor: colors.surfaceAlt, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 999, borderWidth: 1, borderColor: '#2A3942' }}>
                <Text style={{ color: colors.accent, fontWeight: '800', fontSize: 14 }}>Edit Profile</Text>
              </Pressable>
            </>
          )}
        </View>

        <View style={{ backgroundColor: colors.surfaceAlt, borderRadius: 20, padding: 20, gap: 12, borderWidth: 1, borderColor: '#2A3942' }}>
          <Text style={{ color: colors.text, fontWeight: '800', fontSize: 16 }}>Security & Privacy</Text>
          <Text style={{ color: colors.muted, fontSize: 13, lineHeight: 18 }}>All messages and media remain private. Your session is protected on this device.</Text>
        </View>

        <Pressable onPress={() => { signOut(); router.replace('/(auth)/login'); }} style={{ backgroundColor: '#2A0F14', borderWidth: 1, borderColor: '#421A20', padding: 18, borderRadius: 20, alignItems: 'center' }}>
          <Text style={{ color: '#F15C6D', fontWeight: '900', fontSize: 15 }}>Sign out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}