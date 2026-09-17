import { createClient } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL as string | undefined;
const anon = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = !!url && !!anon;

export const supabase = isSupabaseConfigured
  ? createClient(url!, anon!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
      },
    })
  : (null as any);

export const AUTH_REDIRECT_URL = Linking.createURL('auth-callback');