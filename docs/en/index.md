---
layout: home

hero:
  name: Mochi
  text: A cartoon component library that breathes
  # Keep the version in sync with packages/mochi-island-ui/package.json (the navbar badge is auto-read at build time)
  tagline: v2.1.0 · Every design token is a CSS custom property — retheme at runtime without a rebuild
  actions:
    - theme: brand
      text: Get started
      link: /en/guide/installation
    - theme: alt
      text: Components
      link: /en/components
    - theme: alt
      text: Blog template demo
      link: https://mochi.liveroom.dpdns.org/blog/

features:
  - title: Tokens are the API
    details: All --mochi-* variables are declared on :root and components only read var(). Override variables to retheme — this docs site themes itself the same way.
  - title: Motion has a signature
    details: Spring curves, press travel and staggered entrances. Every parameter is a token you can slow down or switch off globally.
  - title: Respects system preferences
    details: Under prefers-reduced-motion transitions and lifts are removed while state feedback stays; the focus ring has two layers so it stays visible on outlined buttons.
  - title: Ships with a blog template
    details: A bilingual blog example built from these components — announcement banner, archive timeline, load-more paging and a stats sidebar. Swap the data and ship.
---

## A quick look

<div class="demo demo-col">
  <div class="demo">
    <MochiButton>Primary</MochiButton>
    <MochiButton variant="soft">Soft</MochiButton>
    <MochiButton variant="ghost">Ghost</MochiButton>
  </div>
  <MochiDialogBubble placement="left" text="今天的胡萝卜收成不错，要不要一起去广场看看？" />
  <MochiPanel title="Panel">
    header / body / footer anatomy with three soft border layers.
    <template #footer>
      <MochiTag tone="candy">Candy</MochiTag>
      <MochiTag tone="accent">Mint</MochiTag>
    </template>
  </MochiPanel>
</div>

None of the components above need an import — the docs site registers them through the same `unplugin-vue-components` resolver.

## About these English pages

The English locale ships a full guide set and a components reference. The **live demos live on the
Chinese pages** (sample data is in Chinese) — every English page links straight to its demo twin.
The component library itself is locale-independent: all user-facing strings inside components come
from your props.
