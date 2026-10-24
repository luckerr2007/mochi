# MochiProgress

进度条。数值变化时条子平滑推进，越界值会被夹在 0–100%。

## 示例

<div class="demo demo-col">
  <MochiProgress :value="xp" label="今日进度" show-value />
  <MochiProgress :value="42" tone="accent" label="钓鱼图鉴" show-value />
  <MochiProgress :value="18" tone="candy" label="糖果收集" show-value />
</div>

<MochiButton size="sm" variant="soft" @click="xp = (xp + 14) % 120">加一点</MochiButton>

<script setup>
import { ref } from 'vue';
const xp = ref(72);
</script>

## Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `value` | `number` | `0` | 当前值 |
| `max` | `number` | `100` | 上限 |
| `label` | `string` | `'进度'` | 无障碍名称，也可当数值行的标题 |
| `tone` | `'primary' \| 'accent' \| 'candy'` | `'primary'` | 条的颜色 |
| `showValue` | `boolean` | `false` | 是否显示标签 + 百分比行 |

## 无障碍

轨道带 `role="progressbar"`，并给出 `aria-valuenow` / `aria-valuemin` / `aria-valuemax` /
`aria-label`。注意 `aria-valuenow` 用的是原始 `value` 而不是百分比——
当 `max` 不是 100 时，这是唯一正确的写法。

## 用到的令牌

`--mochi-bg-sunken`（轨道）、`--mochi-shadow-inset`（内凹）、`--mochi-primary` /
`--mochi-accent` / `--mochi-accent-candy`（三种色调）、`--mochi-duration-slow`（推进动画）。
