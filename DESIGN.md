---
version: alpha
name: Vault
description: WhatsApp-grade security meets editorial feed — stealth luxury messenger.
colors:
  primary: "#0B141A"
  secondary: "#AEBAC1"
  tertiary: "#00A884"
  accent: "#53BDEB"
  surface: "#111B21"
  surfaceAlt: "#202C33"
  neutral: "#F0F2F5"
  danger: "#F15C6D"
  warning: "#FFD279"
typography:
  h1:
    fontFamily: Inter
    fontSize: 2rem
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  h2:
    fontFamily: Inter
    fontSize: 1.25rem
    fontWeight: 600
    lineHeight: 1.3
  body-md:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.4
  label:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.06em"
rounded:
  sm: 8px
  md: 16px
  lg: 24px
  full: 9999px
spacing:
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
components:
  message-out:
    backgroundColor: "{colors.tertiary}"
    textColor: "#0B141A"
    rounded: "{rounded.md}"
    padding: 12px
  message-in:
    backgroundColor: "{colors.surfaceAlt}"
    textColor: "#E9EDEF"
    rounded: "{rounded.md}"
    padding: 12px
  button-primary:
    backgroundColor: "{colors.tertiary}"
    textColor: "#0B141A"
    rounded: "{rounded.full}"
    padding: 14px
  button-primary-hover:
    backgroundColor: "#008069"
    textColor: "#FFFFFF"
    rounded: "{rounded.full}"
    padding: 14px
  tab-active:
    backgroundColor: "{colors.surfaceAlt}"
    textColor: "{colors.tertiary}"
    rounded: "{rounded.full}"
    padding: 8px
  feed-card:
    backgroundColor: "{colors.surfaceAlt}"
    textColor: "#E9EDEF"
    rounded: "{rounded.lg}"
    padding: 16px
---

## Overview

Vault is not another chat clone. Think WhatsApp if it was designed for people who actually care about privacy — stealth luxury, not neon cyber. Dark graphite surfaces, single emerald accent, surgical typography. Every pixel says "your messages are yours."

Brand posture: confidential, not paranoid. Calm, not flashy. The security is felt in restraint — no gradients, no glass, just precise hierarchy and verified locks where they matter.

## Colors

- **Primary (#0B141A):** Deep graphite — app shell, header, true black alternative that saves OLED battery and feels like a vault.
- **Secondary (#AEBAC1):** Muted stone for secondary text, timestamps, metadata. Legible on dark without glare.
- **Tertiary (#00A884):** Vault emerald — the ONLY accent for actions, sent messages, online indicators. Borrowed from WhatsApp for familiarity, darkened for sophistication.
- **Accent (#53BDEB):** Ice blue for feed highlights, security verification badges, and calling states — never competes with emerald.
- **Surface (#111B21) / SurfaceAlt (#202C33):** Layered elevations for cards, input bars, bottom sheets. 2-value system keeps depth readable.
- **Neutral (#F0F2F5):** Light mode inversion, used only inside message bubbles for contrast checks.

All text on emerald passes WCAG AA (emerald #00A884 on #0B141A = 6.2:1). White on SurfaceAlt passes 12:1.

## Typography

Inter throughout — precise, neutral, engineered. No serif editorial play here; this is a tool that must feel fast and trustworthy at 12px.

- h1 for empty states and onboarding headlines (32px bold, tight tracking)
- h2 for contact names and feed usernames (20px semibold)
- body-md for messages (16px regular, 1.5 leading —WhatsApp parity)
- body-sm for previews and captions (14px)
- label for tabs, timestamps, SECURITY badges (12px caps, 0.06em tracking)

## Layout & Spacing

Density is WhatsApp-dense but breathing room where it counts.

- Chat list: 72px rows, 16px avatar, 12px divider, 16px horizontal padding
- Message thread: max 72% bubble width, 8px between grouped messages, 20px between senders
- Feed: 16px card gap, 24px vertical rhythm, full-bleed media with 16px inner padding
- Bottom nav: 64px height, 4 equal tabs, centered FAB for new chat
- All touch targets min 44px, input bar 48px

## Elevation & Depth

No shadows. Depth is conveyed through surface layering only:

- Level 0: Primary (#0B141A) — background
- Level 1: Surface (#111B21) — list containers
- Level 2: SurfaceAlt (#202C33) — cards, bubbles, sheets
- Level 3: Overlay (SurfaceAlt + 8% white scrim) — modals

Keeps the app flat, fast, and OLED-pure. Borders are 1px #2A3942 at 40% opacity — barely there.

## Shapes

- Message bubbles: 16px radius, 4px tail corner (outgoing tail bottom-right, incoming bottom-left)
- Avatars: full circle, 2px emerald ring when online, 3px ring when story active
- Buttons: pill (9999px) for primary actions, 12px for destructive
- Feed cards: 24px radius, media corners match
- Input bar: 24px radius container, inner field 20px

## Components

- `message-out` / `message-in`: Distinction is color + alignment only. No tails in CSS; tails via border-radius tweak. Timestamps inside bubble, 11px, 60% opacity.
- `button-primary`: Emerald pill, Inter 600, no icon unless context demands. Hover is #008069.
- `tab-active`: SurfaceAlt pill with emerald text — not underline, not filled bar.
- `feed-card`: SurfaceAlt with 1px border, media bleeds to edge, action bar below (like, comment, share, bookmark) 44px each.

## Do's and Don'ts

Do: Keep one accent. Use emerald sparingly — it means "verified" or "you sent this." 
Do: Show lock icons on verified chats. Show safety number checks in profile, not in chat chrome.
Don't: Use gradients, blur, or neon security tropes. No hacker green on black.
Don't: Center-stack the chat list — it's an Operate surface, not a marketing page.
Do: Animate only state changes (sending → sent → delivered → read) with 160ms ease-out.
Don't: Invent metrics for the feed preview — use real post copy, not "3.2k likes."
