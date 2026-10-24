# Coverage

Coverage compared against the component sets of the major libraries (Ant Design, Element Plus,
Material UI, Chakra, shadcn/ui, Naive UI).

The common core across every library is roughly **60 components**; Mochi ships **74** (Panel replaces
Card, DialogBubble is its own thing), including the cross-library P2 pieces — Transfer, ColorPicker,
Mentions, QRCode — and shadcn's CommandPalette.

## What is intentionally not built

- **Icon** — use an icon package; a UI library should not draw its own.
- **Grid / Layout** — CSS Grid is already the better tool; a wrapper only gets in the way.
- **Notification** — Toast covers it; two notification systems would fight.
- **Rich text editor** — heavy, and a poor fit for the cartoon language.

## See also

- Live demos: browse the Chinese component pages (demo sample data is in Chinese).
- Blog template: https://mochi.liveroom.dpdns.org/blog/
