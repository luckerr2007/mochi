# MochiColorPicker

颜色选择器。触发器显示色块与 HEX 值，弹层内是饱和度×明度面板 + 色相条 + HEX 输入 + 预设色板。

## 示例

<div class="demo demo-col" style="width: 100%; max-width: 320px">
  <MochiColorPicker v-model="color" label="品牌色" />
  <div :style="{ display: 'flex', alignItems: 'center', gap: '8px' }">
    <span :style="{ width: '24px', height: '24px', borderRadius: '8px', background: color, border: '1px solid var(--mochi-line)' }" />
    <span>当前：<code>{{ color }}</code></span>
  </div>
</div>

```vue
<script setup>
import { ref } from 'vue';
const color = ref('#f0875c');
</script>

<template>
  <MochiColorPicker v-model="color" label="品牌色" />
</template>
```

<script setup>
import { ref } from 'vue';
const color = ref('#f0875c');
</script>

## Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `v-model` | `string` | `'#f0875c'` | `#rrggbb`，小写 |
| `label` | `string` | — | 触发器的 `aria-label`，同时作为 HEX 输入的朗读文本 |
| `disabled` | `boolean` | `false` | — |
| `swatches` | `string[]` | Mochi 令牌八色 | 预设色板 |

## 交互

| 位置 | 行为 |
| --- | --- |
| 取色面板 | 按住拖动取饱和度（横轴）与明度（纵轴），指针捕获保证移出面板不丢 |
| 色相条 | 原生 `<input type="range">`，方向键可微调 |
| HEX 输入 | 合法值即时生效；非法值不失焦就打回，失焦回读当前值 |
| 取色面板键盘 | 聚焦后方向键微调饱和度/明度，步长 4 |

## 无障碍与已知限制

- 不支持透明度（alpha）：Mochi 的界面语言是实色卡通，半透明色在这个体系里几乎用不上，
  需要时再加第四根轴。
- 取色面板是二维自由拖拽，读屏语义由两根一维轴补齐：色相条（原生 range）与 HEX 输入。
- HEX 输入合法时**原样回传**，不从取色状态反推——HSV 状态是整数，
  反推会让 `#7fc8c0` 漂移成 `#7dc7be` 这类肉眼可见的色差。
