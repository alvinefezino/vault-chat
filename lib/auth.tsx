import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { sendSignInLinkToEmail, onAuthStateChanged, signOut as fbSignOut, updateProfile } from 'firebase/auth';
import { auth, isFirebaseConfigured } from './firebase';

export type VaultUser = { id: string; name: string; email: string; phone: string; avatar: string };

const KEY = 'vault_auth_v1';
const Ctx = createContext<{
  user: VaultUser | null;
  loading: boolean;
  sendLink: (email: string) => Promise<void>;
  ensureProfile: (name: string, avatar?: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInMock: (u: VaultUser) => Promise<void>;
}>(null as any);

function toVaultUser(fbUser: any, fallbackName?: string): VaultUser {
  return {
    id: fbUser.uid,
    name: fallbackName ?? fbUser.displayName ?? fbUser.email?.split('@')[0] ?? 'Vault User',
    email: fbUser.email ?? '',
    phone: fbUser.phoneNumber ?? '',
    avatar: fbUser.photoURL ?? 'https://i.pravatar.cc/200?img=15',
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<VaultUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const s = await SecureStore.getItemAsync(KEY);
      if (s) {
        try {
          setUserState(JSON.parse(s));
        } catch {}
      }
      setLoading(false);
    })();

    if (isFirebaseConfigured) {
      const unsub = onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          const v = toVaultUser(fbUser);
          setUserState(v);
          await SecureStore.setItemAsync(KEY, JSON.stringify(v));
        } else {
          // Keep local mock session if user is not signed in to Firebase
        }
      });
      return () => unsub();
    }
  }, []);

  const sendLink = async (email: string) => {
    if (!isFirebaseConfigured) throw new Error('Firebase not configured');
    const authDomain = process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'vaultchat-700fe.firebaseapp.com';
    const actionCodeSettings = {
      url: `https://${authDomain}/__/auth/action`,
      handleCodeInApp: true,
    };
    await sendSignInLinkToEmail(auth, email.trim().toLowerCase(), actionCodeSettings);
  };

  const ensureProfile = async (name: string, avatar?: string) => {
    if (!user) return;
    const patch: Partial<VaultUser> = {};
    if (name && name !== user.name) patch.name = name;
    if (avatar) patch.avatar = avatar;
    if (Object.keys(patch).length) {
      const next = { ...user, ...patch };
      setUserState(next);
      await SecureStore.setItemAsync(KEY, JSON.stringify(next));
      if (isFirebaseConfigured && auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: next.name,
          photoURL: next.avatar,
        });
      }
    }
  };

  const signOut = async () => {
    if (isFirebaseConfigured) await fbSignOut(auth);
    setUserState(null);
    await SecureStore.deleteItemAsync(KEY);
  };

  const signInMock = async (u: VaultUser) => {
    setUserState(u);
    await SecureStore.setItemAsync(KEY, JSON.stringify(u));
  };

  return <Ctx.Provider value={{ user, loading, sendLink, ensureProfile, signOut, signInMock }}>{children}</Ctx.Provider>;
}
export const useAuth = () => useContext(Ctx);