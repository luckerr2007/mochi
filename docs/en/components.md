# Components

English reference for all 74 components. **Live demos are on the Chinese pages** — each section links
to its demo twin (sample data there is in Chinese). All user-facing strings inside components come
from your props, so the components themselves are locale-independent.

## General

### MochiButton — [demo](/components/button)

`variant`: `primary | soft | ghost` · `size`: `sm | md | lg` · `disabled` · `type`.
Press physics: hover lifts 1px, active sinks by `--mochi-shadow-offset`, press is 90ms.

### MochiTag — [demo](/components/tag)

Pill label with `tone`: `primary | accent | candy | danger | neutral`, optional `closable` +
`closeLabel`, emits `close`.

### MochiDivider — [demo](/components/basics)

Separator with optional centered `label`, `vertical` mode. `role="separator"` + orientation.

### MochiBadge — [demo](/components/basics)

Count or dot attached to slotted content. `value`, `dot`, `tone`. Numbers pop on change.

### MochiAvatar — [demo](/components/basics)

`src`, `name` (fallback initial), `size`: `sm | md | lg`. Falls back to the first character on image error.

### MochiAvatarGroup — [demo](/components/extras)

Overlapping avatars. `items: { name, src? }[]`, `max` (default 4, overflow becomes +N), `size`, `label`.
Hover lifts an avatar to the front.

### MochiSpace — [demo](/components/misc)

Flex gap wrapper. `size`: `sm | md | lg` (8/16/24) or px number, `vertical`, `wrap`. Semantic sizes map
to the 4px grid.

### MochiLink — [demo](/components/misc)

Styled anchor. `href`, `external` (adds target/rel + arrow), `disabled` (removes href, `aria-disabled`).

### MochiText — [demo](/components/misc)

Polymorphic text via `as`, `size`: `sm | base | lg`, `tone`: `ink | soft`.

### MochiImage — [demo](/components/page-extras)

Thumbnail button + teleported preview (mask fade, zoom spring). `src`, `alt`, `caption`, `width`, `height`.

### MochiWatermark — [demo](/components/page-extras)

Canvas-generated repeating watermark. `content`, `opacity`, slotted content; `pointer-events: none`.

### MochiKbd — [demo](/components/extras-2)

Keyboard key chip (sunken, step bottom). Slot is the key name.

## Forms

### MochiInput — [demo](/components/input)

`v-model`, `label` (auto `for`), `hint` (also `aria-describedby`), `placeholder`, `invalid`,
`disabled`. Sunken well + two-layer focus ring.

### MochiTextarea — [demo](/components/textarea)

Same shell as Input with `rows`.

### MochiSelect — [demo](/components/select)

Custom listbox combobox. `options: { label, value, disabled? }[]`, `v-model`, keyboard: ↑↓/Home/End/
Enter/Space/Esc. Flips up when the space below is short.

### MochiSwitch — [demo](/components/switch)

Native checkbox with `role="switch"`, space toggles. Squish animation while pressed.

### MochiCheckbox — [demo](/components/checkbox)

`v-model`, `label`, `disabled`. Check mark is drawn with `stroke-dashoffset`.

### MochiRadioGroup — [demo](/components/radio)

`options` array shares a generated `name` so arrow keys work. Group disable via fieldset.

### MochiRate — [demo](/components/rate)

Native radio stars. `v-model`, fill sweeps in staggered by 30ms.

### MochiForm / MochiFormItem — [demo](/components/forms-advanced)

Layout + error slot. FormItem passes `invalid` to the field and renders `role="alert"` errors;
validation logic stays yours.

### MochiInputNumber — [demo](/components/forms-advanced)

Stepper clamped to `min`/`max`.

### MochiSlider — [demo](/components/slider)

Transparent `range` under a custom track (keyboard/a11y free). `show-value`, disabled while dragging.

### MochiSegmented — [demo](/components/forms-advanced)

Sliding indicator segmented control. `options`, `label`, arrow keys skip disabled.

### MochiUpload — [demo](/components/table-upload)

Select + file list only (no upload transport). Drag-over scale, rows animate on remove.

### MochiDatePicker — [demo](/components/menu-calendar)

FieldShell + Popover + Calendar, closes on pick. `v-model: Date | null`.

### MochiTimePicker — [demo](/components/carousel-time)

Two 24/60 columns, smooth-scrolls the picked value to center, outputs `HH:mm`.

### MochiAutoComplete — [demo](/components/tree-search)

Free input with suggestion listbox. ↑↓ highlight, Enter select, `limit`.

### MochiCascader — [demo](/components/tree-search)

Column drill-down; `v-model` is the full key path (root → leaf).

### MochiTreeSelect — [demo](/components/tree-search)

Tree inside a popover; shares the Tree data shape.

### MochiMentions — [demo](/components/mentions)

`@`-triggered suggestions in a free input. Space breaks the match, insert replaces the query.
Single-line by design.

### MochiTransfer — [demo](/components/transfer)

Two panels + move buttons. `data`, `v-model` (target keys, order follows `data`), `searchable`,
`titles`. Disabled items never move.

### MochiColorPicker — [demo](/components/color-picker)

SV panel + native hue range + HEX input + swatches. Supports `v-model` and `:value`; HEX input
echoes exactly (no HSV rounding drift). No alpha by design.

### MochiCodeInput — [demo](/components/extras)

N-box redemption code. Auto-advance, paste distributes (truncated to capacity), Backspace deletes
the previous digit on an empty box, emits `complete` when full.

## Feedback

### MochiAlert — [demo](/components/feedback)

Note-style announcement: tone badge + dashed inner frame + step shadow. `tone`, `title`, `closable`,
emits `close`.

### MochiBanner — [demo](/components/extras-2)

Page-level announcement strip. `v-model:open` collapses the height (grid rows), `sticky` pins it to
the viewport top with depth shadow, `tone`, `title`, `closable`.

### MochiSpinner — [demo](/components/feedback)

Loading indicator; slows down under reduced motion instead of stopping. `size`, `label`.

### MochiSkeleton — [demo](/components/feedback)

Placeholder lines with a sweep; reduces to a static fill under reduced motion. `lines`.

### MochiEmpty — [demo](/components/feedback)

Dashed "empty plate" + text + `#action` slot. Entrance drop.

### MochiModal — [demo](/components/modal)

Teleported dialog: mask fade, panel spring, focus trap, scroll lock, Esc, focus return.
`v-model:open`, `title`, `maskClosable`.

### MochiDrawer — [demo](/components/overlays)

Side panel sharing the Modal behavior set. `placement`: `left | right`, `width`.

### MochiTooltip — [demo](/components/overlays)

Delayed hover/focus tooltip. `content`, `placement`: `top | bottom | left | right`, `delay` (300ms).

### MochiToast — [demo](/components/toast-popover)

Queue composable: `useToast()` / `pushToast()` + `<MochiToastHost />`. Tones, progress bar pauses on
hover, rows collapse smoothly. Toasts stack at the top center.

### MochiPopover — [demo](/components/toast-popover)

Anchored panel, flips up when short on space, Esc/outside close. `width`, `placement`, `bare`,
`panelRole`. Click handling belongs to the wrapper (see docs).

### MochiPopconfirm — [demo](/components/toast-popover)

Confirm popover based on Popover. `tone="danger"` restyles without resizing.

### MochiResult — [demo](/components/misc)

Result page: drawn check/cross badge, `tone`, `title`, `description`, `#actions`.

### MochiProgress — [demo](/components/progress)

Linear bar, `tone`, `show-value`; width transitions with slow ease.

### MochiProgressRing — [demo](/components/extras)

SVG ring, sweeps from empty on mount, spring on change. `v-model` / `:value` (0–100 clamped),
`size`, `thickness`, `tone`, `showValue`.

### MochiLoadMore — [demo](/components/extras-2)

One component, three states: idle (clickable) → loading (spinner) → done (dashed). Emits `more` when
idle.

### MochiCountdown — [demo](/components/extras)

Four-cell countdown, digits pop per change, zeroed cells fade, emits `finish` once. `to` accepts a
Date/timestamp/string.

### MochiBackTop — [demo](/components/page-extras)

Appears past `threshold` (320px), smooth-scrolls to top (instant under reduced motion).

## Data display

### MochiPanel — [demo](/components/panel)

Card anatomy: header (title or slot, `headingLevel`) / body / footer. Three soft border layers.
`animate` adds a one-time entrance.

### MochiList — [demo](/components/list)

`ordered`, `divided`, `stagger` entrances, `animated` for TransitionGroup paging of dynamic items.

### MochiDialogBubble — [demo](/components/dialog-bubble)

Speech bubble with hand-drawn tail, optional typewriter (`speed`, emits `done`). The mascot voice.

### MochiTabs — [demo](/components/navigation)

Shared sliding indicator + panel content swap. `items`, arrow keys, panel content fades in.

### MochiCollapse — [demo](/components/navigation)

Native `details/summary` with interpolated height (Chrome 129+, graceful fallback). `open` default.

### MochiStatistic — [demo](/components/data-display)

rAF count-up with easeOutCubic, `Intl.NumberFormat` grouping, `tabular-nums`. `title`, `value`,
`precision`, `prefix/suffix`.

### MochiDescriptions — [demo](/components/data-display)

Definition list from `items` + `columns`.

### MochiTimeline — [demo](/components/data-display)

Vertical timeline, tone dots stagger in. `items: { title, time?, tone? }`.

### MochiTable — [demo](/components/table-upload)

Real `<table>` with tri-state sorting (asc → desc → none), `aria-sort`, `#cell-<key>` slots, striped
mode, FLIP row reorder on sort, entrance stagger.

### MochiCountUp — [demo](/components/misc)

Standalone count-up sharing the Statistic engine.

### MochiCalendar — [demo](/components/menu-calendar)

Monday-first 6×7 grid, roving tabindex, arrow navigation, neighbor-month pick flips pages.

### MochiTree — [demo](/components/tree-search)

Recursive rows, expand/collapse via grid rows, `role="tree"` ARIA, `v-model:selected`.

### MochiQRCode — [demo](/components/qrcode)

SVG QR with UTF-8 (TextEncoder). `value`, `size`, `level`, `margin`, `label`. Oversize renders a
placeholder instead of crashing. Encoder: `qrcode-generator` (bundled only with this entry).

## Navigation

### MochiPagination — [demo](/components/navigation-extra)

Ellipsis folding, current page pops on change. `total`, `v-model`.

### MochiSteps — [demo](/components/navigation-extra)

Dot + connector (`scaleX`), `current`, states done/current/todo.

### MochiBreadcrumb — [demo](/components/data-display)

`items` with href (last item is `aria-current="page"`), separators via `::before`.

### MochiDropdown — [demo](/components/misc)

Menu on Popover: `role="menuitem"` items, ↑↓ focus movement, staggered entrance, `divider`.

### MochiMenu — [demo](/components/menu-calendar)

Vertical nav with sliding indicator, one level of groups (auto-expands to the selected item).

### MochiCarousel — [demo](/components/carousel-time)

Track translate, dot `scaleX` fill, hover pauses, 40px drag switches, arrows appear on hover.

### MochiAnchor — [demo](/components/page-extras)

Scroll spy with sliding indicator. `items: { id, label }`, `offset`.

### MochiAffix — [demo](/components/page-extras)

Pins with an equal-height placeholder (no layout jump). `offsetTop`, depth shadow while pinned.

### MochiCommandPalette — [demo](/components/command-palette)

⌘K/Ctrl+K palette: search filter, grouped commands, arrow keys skip disabled, Enter emits + closes,
focus trap and return. `commands: { key, label, hint?, group?, disabled? }[]`, `v-model:open`,
`hotkey`.

## Utilities

- **MochiBackTop** — see Navigation.
- **applyTheme(tokenMap, host?)** — runtime theming with restore handle.
- **MochiResolver** — `unplugin-vue-components` resolver (auto style injection).
- **MochiToneGlyph** (internal) — shared tone icons for Alert/Banner.
