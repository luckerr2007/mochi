# Custom Components

The tokens are plain CSS custom properties — build your own components with the same language and
they will look native, retheme with `applyTheme()`, and pass the library's own discipline checks.

## Three hard rules

1. **Only `var(--mochi-*)` for colors, spacing, radii, shadows and durations.** Derive between tokens
   with `color-mix()`; spacing must be multiples of the 4px unit; control heights use
   `--mochi-control-sm|md|lg`.
2. **Focus is `box-shadow: var(--mochi-focus-ring)`** — never the default outline.
3. **Motion uses the token curves and durations only**, with a `prefers-reduced-motion: reduce`
   fallback.

## Two documented pitfalls

- **CSS Modules only hashes class names.** Attribute selectors (`[data-tone='x']`) and element
  selectors (`ul`, `h3`) are **global rules**. A bare `[data-tone]` once leaked out of the Badge
  module and tinted every element with that attribute. Always hang styles on your component's own
  class.
- **`defineModel` with an array type degrades if you pass a default** — proxy it with a
  computed get/set instead.

## Minimal example: a voucher

```vue
<script setup lang="ts">
import css from './Voucher.module.css';
withDefaults(defineProps<{ title: string; point: number }>(), { point: 0 });
</script>

<template>
  <div :class="css.root">
    <span :class="css.point">{{ point }}<i>bell</i></span>
    <span :class="css.title">{{ title }}</span>
  </div>
</template>
```

```css
/* Voucher.module.css — every rule hangs on the component's own class */
.root {
  display: inline-flex;
  align-items: center;
  gap: var(--mochi-space-3);
  padding: var(--mochi-space-3) var(--mochi-space-4);
  border: var(--mochi-border-hairline) dashed var(--mochi-primary-deep);
  border-radius: var(--mochi-radius-md);
  background: color-mix(in srgb, var(--mochi-primary-soft) 60%, var(--mochi-surface));
  box-shadow: 0 2px 0 0 var(--mochi-shadow-press-color);
  color: var(--mochi-ink);
  font-family: var(--mochi-font-family);
}
```

## Wiring it up

- Register through `unplugin-vue-components` (point `dirs` at your folder) or import explicitly.
- Because everything reads tokens, `applyTheme()` rethemes your component together with the library.
- To land a component in Mochi itself, follow the
  `packages/mochi-island-ui/src/components/<name>/` layout (`MochiX.vue`, `MochiX.module.css`,
  `types.ts`, `index.ts`) and register it in `src/resolver.ts`.

## Checklist

- [ ] No bare colors or off-grid spacing
- [ ] Focus ring and press travel (`--mochi-shadow-offset`) match the library
- [ ] All motion from tokens, with reduced-motion fallbacks
- [ ] No bare attribute/element selectors — styles hang on component classes
- [ ] Form controls carry correct ARIA (label association, `aria-invalid`, roles)
