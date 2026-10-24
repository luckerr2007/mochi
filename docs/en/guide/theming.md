# Theming

Every visual decision is a CSS custom property declared on `:root`. Components never hardcode values — override a variable and the whole library (and anything you built with the same discipline) follows.

## Color

| Token | Role |
| --- | --- |
| `--mochi-primary` / `--mochi-primary-deep` | Primary actions / step edge & border of primary |
| `--mochi-primary-soft` / `--mochi-on-primary` | Tinted fills / text on primary (AA-checked) |
| `--mochi-bg` / `--mochi-bg-sunken` | Page canvas / sunken wells |
| `--mochi-surface` / `--mochi-surface-sunken` | Cards / inner wells |
| `--mochi-ink` / `--mochi-ink-soft` | Body text / secondary text |
| `--mochi-line` / `--mochi-line-strong` | Soft outer border / strong inner border |
| `--mochi-accent` / `--mochi-accent-candy` / `--mochi-danger` | Optional candy accents / danger |

## Geometry

Radii `--mochi-radius-xs|sm|md|lg|full` (8/12/16/20/999). Spacing lives on a 4px grid:
`--mochi-space-unit` × `--mochi-space-1|2|3|4|6|8`. Control heights: `--mochi-control-sm|md|lg` (32/40/48) —
controls on one row always share a baseline.

## Elevation

`--mochi-shadow-offset` (4px press travel), `--mochi-shadow-press` (the solid step), `--mochi-shadow-soft`
(ambient), `--mochi-shadow-inset` (sunken wells).

## Motion

| Token | Value | Use |
| --- | --- | --- |
| `--mochi-spring` | overshooting curve | entrances, hover pops |
| `--mochi-spring-soft` | gentler overshoot | large panels |
| `--mochi-ease-out` / `--mochi-ease-in` | enter / leave | content swaps |
| `--mochi-duration-press` | 90ms | press must be faster than release |
| `--mochi-duration-fast|base|slow` | 120/220/420ms | everything else |
| `--mochi-stagger` | 60ms | list entrances |

## Runtime theming

```ts
applyTheme({ '--mochi-primary': '#4fa89b' }, someElement?);
```

Call it on `:root` (default) or any container. Changing the primary also requires checking
`--mochi-on-primary` contrast — a test in the repo locks 4.5:1.

## Typography

`--mochi-font-family`, `--mochi-font-size-sm|base|lg` (13/15/18), `--mochi-line-height` (1.55),
`--mochi-font-weight-normal|bold` (500/800). Numerals that change should use `tabular-nums`.
