# Installation

Mochi Island UI is a Vue 3 component library (Vue ≥ 3.5). The design tokens are plain CSS custom properties — import them once and every component speaks the same theme.

## Install

```bash
npm install mochi-island-ui
```

Peer dependency: `vue ^3.5`. No other runtime dependencies — even the QR encoder is bundled only when you import `MochiQRCode`.

## Wire it up

```ts
// main.ts
import { createApp } from 'vue';
// The theme is an explicit resource: tokens first…
import 'mochi-island-ui/styles/tokens.css';
// …then component styles (or let the resolver inject them per component)
import 'mochi-island-ui/style.css';
import App from './App.vue';

createApp(App).mount('#app');
```

The token sheet declares everything on `:root`. Override variables to retheme at runtime:

```ts
import { applyTheme } from 'mochi-island-ui';

const dispose = applyTheme({
  '--mochi-primary': '#4fa89b',
  '--mochi-primary-deep': '#35786f',
});

// dispose() restores the previous values
```

## On-demand imports

```ts
Components({ resolvers: [MochiResolver()] }); // from 'mochi-island-ui/resolver'
```

The resolver injects `mochi-island-ui/style.css` automatically (disable with `importStyle: false` when your build compiles component styles, e.g. aliasing to source).

## Entry points

| Path | Contents |
| --- | --- |
| `mochi-island-ui` | All components, `applyTheme`, types |
| `mochi-island-ui/components/*` | Per-component entry (`…/components/button`) |
| `mochi-island-ui/style.css` | Compiled component styles |
| `mochi-island-ui/styles/tokens.css` | The token sheet |
| `mochi-island-ui/resolver` | `unplugin-vue-components` resolver |
