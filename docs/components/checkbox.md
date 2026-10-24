# MochiCheckbox

复选框。勾选标记是矢量路径，边缘保持锐利，不做任何模糊。

## 示例

<div class="demo demo-col">
  <MochiCheckbox v-model="agree" label="同意《广场公约》" />
  <MochiCheckbox :model-value="true" label="已勾选" />
  <MochiCheckbox :model-value="false" disabled label="禁用" />
</div>

<p>同意状态：<code>{{ agree ? '已同意' : '未同意' }}</code></p>

```vue
<script setup>
import { ref } from 'vue';
const agree = ref(false);
</script>

<template>
  <MochiCheckbox v-model="agree" label="同意《广场公约》" />
</template>
```

<script setup>
import { ref } from 'vue';
const agree = ref(false);
</script>

## Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `label` | `string` | — | 也可用默认插槽 |
| `disabled` | `boolean` | `false` | — |

`v-model` 绑定布尔值。

## 用到的令牌

`--mochi-surface`（未选中）、`--mochi-primary`（选中）、`--mochi-on-primary`（勾）、
`--mochi-radius-xs`、`0 2px 0 --mochi-shadow-press-color`（小台阶）。
勾选标记用 `--mochi-spring` 从 0.6 倍弹到 1 倍。
