# MochiTextarea

多行输入。外壳与 `MochiInput` 共用同一个内部组件，所以两者的凹陷槽、label、hint 永远一致。

## 示例

<div class="demo demo-col">
  <MochiTextarea v-model="note" label="留言" hint="最多 200 字，会贴在公告板上" :rows="3" />
</div>

<p>当前内容：<code>{{ note.length }}</code> 字</p>

```vue
<script setup>
import { ref } from 'vue';
const note = ref('');
</script>

<template>
  <MochiTextarea v-model="note" label="留言" hint="最多 200 字" />
</template>
```

<script setup>
import { ref } from 'vue';
const note = ref('今天的广场特别热闹，晚上有烟火大会。');
</script>

## Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `label` | `string` | — | 自动关联 `for` |
| `hint` | `string` | — | 同时作为 `aria-describedby` 目标 |
| `placeholder` | `string` | — | — |
| `rows` | `number` | `3` | 原生 rows |
| `disabled` | `boolean` | `false` | — |
| `readonly` | `boolean` | `false` | — |
| `invalid` | `boolean` | `false` | 同步 `aria-invalid` |

`v-model` 绑定字符串。

## 为什么和 Input 共用外壳

凹陷槽、聚焦环、错误态这三件事在两种输入上必须完全一致，否则并排放置时会露出接缝。
它们被抽进内部组件 `FieldShell`——只在这里维护一份，两个组件都只是往槽里放一个原生控件。

`resize: vertical` 只允许纵向拉伸，避免用户把面板横向撑破。
