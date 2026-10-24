# Metrics & Motion

The library's "feel" comes from a handful of numbers applied consistently.

## Sizes

- Control heights: `--mochi-control-sm|md|lg` = **32 / 40 / 48**. Anything that sits on a control row
  (inputs, selects, triggers, load-more) uses these.
- Off-grid sizes are deliberate: checkbox/radio 22, switch 44×26, avatars 28/40/56, tags auto.

## Spacing

Everything is a multiple of the 4px unit via `--mochi-space-*`. Borders are integer px
(1px hairline, 2px strong), shadow offset is 4px and equals the press travel.

## Motion signature

1. **Press faster than release.** `--mochi-duration-press` (90ms) on `:active`, base duration on
   release. Travel equals `--mochi-shadow-offset`.
2. **Two curves only.** Spring (with overshoot) for entrances and hover pops; `ease-in` for leaves —
   leave fast, never linger. Content swaps use `ease-out`.
3. **Stagger with the token.** List entrances delay by `--mochi-stagger` per index, capped so long
   lists don't wait forever.
4. **Respect reduced motion.** Every animation has a `prefers-reduced-motion: reduce` fallback that
   keeps state feedback (color, expansion) while dropping movement. Loading indicators slow down
   instead of stopping.

## Accessibility baseline

- Focus: two-layer ring via `--mochi-focus-ring`, never the default outline.
- Text contrast: ink pairs are AA-checked by a unit test.
- Form controls ship correct ARIA (label association, `aria-invalid`, listbox/combobox roles where
  applicable) and full keyboard behavior.
