# MochiRadioGroup

单选组。原生 radio + `fieldset`/`legend`，方向键在一组内切换是浏览器自带能力。

## 示例

<div class="demo demo-col">
  <MochiRadioGroup v-model="fruit" legend="今天想吃什么" :options="fruits" />
  <MochiRadioGroup
    :model-value="'apple'"
    legend="整组禁用"
    :options="fruits"
    disabled
  />
</div>

<p>已选：<code>{{ fruit }}</code></p>

```vue
<script setup>
import { ref } from 'vue';
const fruit = ref('apple');
const fruits = [
  { label: '苹果', value: 'apple' },
  { label: '橘子', value: 'orange' },
];
</script>

<template>
  <MochiRadioGroup v-model="fruit" legend="今天想吃什么" :options="fruits" />
</template>
```

<script setup>
import { ref } from 'vue';
const fruit = ref('apple');
const fruits = [
  { label: '苹果', value: 'apple' },
  { label: '橘子', value: 'orange' },
  { label: '梨', value: 'pear' },
];
</script>

## Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `options` | `{ label, value, disabled? }[]` | — | 必填 |
| `legend` | `string` | — | 渲染进 `<legend>` |
| `disabled` | `boolean` | `false` | 禁用整组（`fieldset[disabled]` 天然生效） |

`v-model` 绑定选中项的 `value`（字符串）。

## 为什么用 options 而不是插槽

同组的 `<input type="radio">` 必须共享同一个 `name`，方向键才有效。让使用方自己写五个 radio
并记得取同一个 name，是这个组件最容易出错的地方。名字由组件用 `useId()` 生成，一次都不会错。

代价是选项内容只能是文本；需要富内容时应另建组件，而不是把这里改成插槽。

## 用到的令牌

`--mochi-surface`（未选中）、`--mochi-primary`（选中）、`--mochi-on-primary`（内点）、
`--mochi-radius-full`、`0 2px 0 --mochi-shadow-press-color`（小台阶）。
内点用 `--mochi-spring` 从 0.5 倍弹到 1 倍。
