# 图片、锚点、钉住与水印

## MochiImage

<div class="demo">
  <MochiImage
    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='150'%3E%3Crect width='240' height='150' fill='%23f6e7d2'/%3E%3Ccircle cx='120' cy='70' r='36' fill='%23e8833a'/%3E%3Ctext x='120' y='132' text-anchor='middle' font-size='14' fill='%236b5d4f'%3E中心广场%3C/text%3E%3C/svg%3E"
    alt="中心广场"
    caption="中心广场 · 点击放大"
    width="200px"
    height="120px"
  />
</div>

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| `src` / `alt` | `string` | 必填，缩略图与预览共用 |
| `caption` | `string` | 预览底部的说明，默认用 `alt` |
| `width` / `height` | `string` | 缩略图尺寸 |

**动效**：遮罩淡入，大图从 `scale(0.92)` 弹到 1——和 Modal 同一套手感。
点遮罩任意处或按 `Esc` 关闭；光标在缩略图上是 `zoom-in`，预览里是 `zoom-out`。

## MochiAnchor

<div class="demo" style="width: 220px">
  <MochiAnchor :items="sections" />
</div>

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `items` | `{ id, label }[]` | — | 目标元素的 id（不带 `#`） |
| `offset` | `number` | `80` | 判定"已滚到"的顶部余量 |
| `v-model:active` | `string` | `''` | 当前章节 |

滚动监听是**被动的**（`passive: true`），每帧只做一次 `getBoundingClientRect` 循环。
指示条与 MochiMenu 同款：滑动，不重排。

## MochiAffix

```vue
<MochiAffix :offset-top="64">
  <MochiPanel title="悬浮工具条">…</MochiPanel>
</MochiAffix>
```

| 名称 | 默认值 | 说明 |
| --- | --- | --- |
| `offsetTop` | `64` | 距视口顶部多少像素时钉住 |

钉住后用**等高占位**撑住原布局，页面内容不会跳一下；同时加一圈景深阴影，
让"它现在是悬浮的"这件事可感知。高度变化由 `ResizeObserver` 跟踪。

## MochiWatermark

<div class="demo" style="width: 100%">
  <MochiWatermark content="MOCHI · 内部资料" :opacity="0.1" style="display: block; padding: var(--mochi-space-6); border: var(--mochi-border-hairline) dashed var(--mochi-line); border-radius: var(--mochi-radius-md)">
    这块内容的水印是 canvas 生成的：文字先画到离屏 canvas，旋转后转成 dataURL，
    再用 <code>background-repeat</code> 铺满。水印层 <code>pointer-events: none</code>，
    不挡下面的任何交互。
  </MochiWatermark>
</div>

| 名称 | 默认值 | 说明 |
| --- | --- | --- |
| `content` | — | 必填 |
| `opacity` | `0.08` | 透明度 |
| `fontSize` / `rotate` | `14` / `-22` | 字号与旋转角 |
| `gap` | `160` | 瓦片间距（px） |
| `color` | `var(--mochi-ink)` | 支持 CSS 变量，挂载时解析成实际颜色 |

**注意**：canvas 拿不到 CSS 变量的值，所以 `color` 传 `var(--mochi-ink)` 时会在挂载时
解析成具体颜色——这意味着换主题后水印颜色不会跟着变（这是刻意的取舍：
跟着变就得监听主题并重画，水印没这个必要）。

<script setup>
import { ref } from 'vue';
const sections = [
  { id: 'mochiimage', label: '图片预览' },
  { id: 'mochianchor', label: '锚点' },
  { id: 'mochiaffix', label: '钉住' },
  { id: 'mochiwatermark', label: '水印' },
];
</script>
