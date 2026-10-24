# MochiInput

单行输入框。视觉上是一块内凹的槽，聚焦时槽内仍保持凹陷，焦点环画在槽外。

## 示例

<div class="demo demo-col">
  <MochiInput v-model="nickname" label="昵称" hint="最多 12 个字，会显示在广场上" />
  <MochiInput v-model="email" label="邮箱" invalid hint="格式不正确" />
</div>

<p>当前昵称：<code>{{ nickname || '（空）' }}</code></p>

```vue
<script setup>
import { ref } from 'vue';
const nickname = ref('');
</script>

<template>
  <MochiInput v-model="nickname" label="昵称" hint="最多 12 个字" />
</template>
```

<script setup>
import { ref } from 'vue';
const nickname = ref('小动物');
const email = ref('not-an-email');
</script>

## Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `label` | `string` | — | 自动生成 `for` 并关联输入框 |
| `hint` | `string` | — | 说明文字，同时作为 `aria-describedby` 的目标 |
| `placeholder` | `string` | — | — |
| `type` | `string` | `'text'` | 原生 input type |
| `disabled` | `boolean` | `false` | — |
| `readonly` | `boolean` | `false` | — |
| `invalid` | `boolean` | `false` | 同步 `aria-invalid`，并把边框与 hint 转成错误色 |

`v-model` 绑定字符串。

## 为什么 id 是自动的

标题与说明文字的 `id` 由 `useId()` 生成并互相绑定，使用方不需要记得写 `id` / `for`。
这是最容易漏、又最容易用读屏软件发现的坑。

## 用到的令牌

`--mochi-surface-sunken`（槽底）、`--mochi-shadow-inset`（内凹）、`--mochi-line-strong`、
`--mochi-radius-md`、`--mochi-focus-ring`、`--mochi-danger`。

槽底没有用 `--mochi-bg-sunken`：那一档深了半级，叠上错误红边会糊成一片。
