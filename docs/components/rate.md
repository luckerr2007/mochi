# MochiRate

评分。五个原生 radio 藏起来，可见的是星星。

## 示例

<div class="demo demo-col">
  <MochiRate v-model="score" label="岛屿评分" />
  <p style="margin: 0; color: var(--mochi-ink-soft); font-size: 13px">当前：{{ score }} 星</p>
  <MochiRate :model-value="3" read-only label="只读评分" />
</div>

<script setup>
import { ref } from 'vue';
const score = ref(2);
</script>

```vue
<script setup>
import { ref } from 'vue';
const score = ref(0);
</script>

<template>
  <MochiRate v-model="score" label="岛屿评分" />
</template>
```

## Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `max` | `number` | `5` | 星星数量 |
| `readOnly` | `boolean` | `false` | 只读，不可点击 |
| `label` | `string` | `'评分'` | radiogroup 的无障碍名称 |

`v-model` 绑定分值（数字）。

## 交互与动效

- 悬停时预览到指针所在的那颗，移开回到真实分值
- 填充按索引**错峰**（每颗晚 30ms），从左往右扫过去，不是整排一起亮
- 指针停在哪颗，哪颗微微鼓起（`scale: 1.12`）

用原生 radio 而不是按钮，是因为方向键切换、读屏播报、表单提交都是免费的——
自己用 `<button role="radio">` 得把这三样全部重写。
