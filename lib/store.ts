
import * as SecureStore from 'expo-secure-store';

const K = {
  chats: 'vault_chats_v1',
  msgs: 'vault_msgs_v1',
  feed: 'vault_feed_v1',
  me: 'vault_me_v1',
  theme: 'vault_theme_v1',
  lock: 'vault_lock_v1',
  priv: 'vault_priv_v1',
  pub: 'vault_pub_v1',
};

export async function saveJSON(key: string, v: any){ await SecureStore.setItemAsync(key, JSON.stringify(v)); }
export async function loadJSON<T>(key: string, fallback:T): Promise<T>{
  const s = await SecureStore.getItemAsync(key);
  if(!s) return fallback;
  try{ return JSON.parse(s) as T; }catch{ return fallback; }
}

// helpers bound to K
export const StoreKeys = K;
export async function setLockEnabled(v:boolean){ await SecureStore.setItemAsync(K.lock, v?'1':'0'); }
export async function getLockEnabled(){ return (await SecureStore.getItemAsync(K.lock))==='1'; }
