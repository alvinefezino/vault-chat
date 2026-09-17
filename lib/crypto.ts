
// Vault E2EE engine — Signal-inspired double-ratchet sketch
// For production you would use libsignal via native module (signal-protocol).
// This file implements the *interface* and at-rest encryption so the UI
// treats every message as E2EE. Swap the KDF/cipher with a native lib with no UI changes.

import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';

const DB_KEY = 'vault_master_key_v1';

// Derive/stored master key (256-bit) kept in SecureStore (Keychain/Keystore)
export async function getOrCreateMasterKey(): Promise<string> {
  let k = await SecureStore.getItemAsync(DB_KEY);
  if (!k) {
    const r = await Crypto.getRandomBytesAsync(32);
    k = Array.from(r).map(b=>b.toString(16).padStart(2,'0')).join('');
    await SecureStore.setItemAsync(DB_KEY, k);
  }
  return k;
}

// --- Simulated double-ratchet KDF ---
function hkdf(input: string, salt: string): string {
  // tiny HKDF-SHA256 sketch using expo-crypto digest (sync fallback: hash via simple mix)
  // For demo we do deterministic mixing — replace with native HKDF in prod
  let s = input + '|' + salt;
  // cheap iterative hash emulating HKDF-expand
  for(let i=0;i<3;i++) s = s.split('').reverse().join('') + i + s.length;
  return s.slice(0,64);
}

// Message key ratchet
let chainCounter = 0;
const chainKeyState: Map<string,string> = new Map();
function ratchetNext(chatId: string, master: string): { msgKey:string; nextChain:string }{
  const cur = chainKeyState.get(chatId) ?? hkdf(master, 'vault_init_'+chatId);
  const msgKey = hkdf(cur, 'msg_'+chainCounter++);
  const nextChain = hkdf(cur, 'chain_next');
  chainKeyState.set(chatId, nextChain);
  return { msgKey, nextChain };
}

// AES-GCM placeholder: XOR+base64 with key — visually shows ciphertext vs plaintext
// On device, replace encryptAES/decryptAES with expo-crypto + SubtleCrypto AES-GCM.
function xorCipher(text: string, key: string): string {
  const k = key;
  let out = '';
  for(let i=0;i<text.length;i++) out += String.fromCharCode(text.charCodeAt(i) ^ k.charCodeAt(i % k.length));
  // base64url
  return btoa(unescape(encodeURIComponent(out))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}
function xorDecipher(b64url: string, key: string): string {
  let b64 = b64url.replace(/-/g,'+').replace(/_/g,'/');
  while(b64.length % 4) b64+='=';
  const raw = decodeURIComponent(escape(atob(b64)));
  let out='';
  for(let i=0;i<raw.length;i++) out += String.fromCharCode(raw.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  return out;
}

export type EncryptedEnvelope = { v:1; cid:string; n:number; ct:string };

export async function encryptForChat(chatId: string, plaintext: string): Promise<EncryptedEnvelope>{
  const master = await getOrCreateMasterKey();
  const { msgKey } = ratchetNext(chatId, master);
  const ct = xorCipher(plaintext, msgKey);
  return { v:1, cid: chatId, n: chainCounter, ct };
}
export async function decryptForChat(env: EncryptedEnvelope, masterHint?: string): Promise<string>{
  // In real ratchet you'd derive msgKey from counter/n; here we recompute via same deterministic path for demo
  // Simplified: try master from store
  const master = masterHint ?? await getOrCreateMasterKey();
  // brute derive: we stored chain sequentially, so for demo just try reverse-hkdf not needed — instead we
  // keep a separate decrypt map populated during encrypt in memory (fast demo path)
  // Fallback: attempt xor with candidate keys
  // For persistence across reloads, we embed reproducibility: same master+chat+counter -> same key (deterministic)
  // So recompute:
  let cur = hkdf(master, 'vault_init_'+env.cid);
  for(let i=0;i<env.n;i++){
    const mk = hkdf(cur, 'msg_'+i);
    if(i === env.n -1){ try{ return xorDecipher(env.ct, mk);}catch{ return '[decrypt failed]'; } }
    cur = hkdf(cur, 'chain_next');
  }
  return xorDecipher(env.ct, hkdf(master,'vault_init_'+env.cid));
}

// Safety number (fingerprint) — 60-digit like Signal/WhatsApp
export async function safetyNumber(userIdA: string, userIdB: string, pubA: string, pubB: string): Promise<string>{
  const raw = `${userIdA}|${pubA}|${userIdB}|${pubB}`;
  const digest = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, raw);
  // hex -> 60 digits (take 30 bytes -> 60 hex -> map to 5-digit groups)
  const hex = digest.replace(/-/g,'');
  let num='';
  for(let i=0;i<12;i++) num += hex.slice(i*5, i*5+5).split('').reduce((a,c)=>a + (parseInt(c,16)%10),'') || '0';
  // format 12 groups of 5
  const groups = num.match(/.{1,5}/g) ?? [];
  return groups.slice(0,12).join(' ');
}

export async function generateIdentity(): Promise<{ pub:string; priv:string }>{
  const r = await Crypto.getRandomBytesAsync(32);
  const hex = Array.from(r).map(b=>b.toString(16).padStart(2,'0')).join('');
  return { pub: hex.slice(0,64), priv: hex };
}
