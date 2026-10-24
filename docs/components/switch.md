# MochiSwitch

开关。原生 checkbox 承载语义与键盘行为（空格键切换），视觉交给轨道和滑块。

## 示例

<div class="demo">
  <MochiSwitch v-model="notify" label="接收通知" />
  <MochiSwitch :model-value="true" disabled label="禁用（开）" />
</div>

<p>当前状态：<code>{{ notify ? '开' : '关' }}</code></p>

```vue
<script setup>
import { ref } from 'vue';
const notify = ref(true);
</script>

<template>
  <MochiSwitch v-model="notify" label="接收通知" />
</template>
```

<script setup>
import { ref } from 'vue';
const notify = ref(true);
</script>

## Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `label` | `string` | — | 也可用默认插槽 |
| `disabled` | `boolean` | `false` | — |

`v-model` 绑定布尔值。

## 尺寸与行程

轨道 44×26，滑块 18×18，全部整数 px：

```
行程 = 内宽 40 - 滑块 18 - 左右各 2 = 18px
```

滑块用 `--mochi-spring` 走完这 18px，会有轻微过冲——这是"果冻感"的来源。
`prefers-reduced-motion` 下直接跳到终点。

## 用到的令牌

`--mochi-bg-sunken` → `--mochi-primary`（开启态）、`--mochi-shadow-inset`（轨道内凹）、
`--mochi-shadow-press-color`（滑块 1px 台阶）、`--mochi-radius-full`、`--mochi-focus-ring`。
