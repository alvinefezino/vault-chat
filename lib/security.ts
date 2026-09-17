
// Central security policy — single place to audit
export const SecurityPolicy = {
  e2ee: {
    protocol: 'Signal double-ratchet + X25519 + HKDF-SHA256 + AES-256-GCM',
    pfs: true,
    deniability: true,
    serverBlind: true, // server never sees plaintext or keys
  },
  atRest: 'Expo SecureStore (Keychain / EncryptedSharedPreferences) + app-level AES',
  inTransit: 'TLS 1.3 pinned — no plaintext fallback',
  metadata: 'Sealed sender where possible, no read-receipt tracking, no typing-indicator logging',
  antiAbuse: 'Client-side spam checks + rate limits; report sends only the reported message (user-consented)',
  note: 'This build is local-first (no backend). E2EE envelopes are generated on-device and stored encrypted. Plug a Relay/9router-compatible transport without touching UI.',
} as const;
