# MochiTransfer

穿梭框。双栏勾选 + 中间按钮搬运，用于「从一批候选里挑出一组」的场景。

## 示例

<div class="demo demo-col" style="width: 100%; max-width: 560px">
  <MochiTransfer v-model="picked" :data="fruits" searchable :titles="['水果摊', '购物篮']" />
  <p style="margin: 0">已选：<code>{{ picked.join('、') || '无' }}</code></p>
</div>

```vue
<script setup>
import { ref } from 'vue';
const picked = ref(['pear']);
const fruits = [
  { key: 'apple', label: '苹果' },
  { key: 'pear', label: '梨' },
  { key: 'ship-pear', label: '船梨（缺货）', disabled: true },
];
</script>

<template>
  <MochiTransfer v-model="picked" :data="fruits" />
</template>
```

<script setup>
import { ref } from 'vue';
const picked = ref(['pear']);
const fruits = [
  { key: 'apple', label: '苹果' },
  { key: 'pear', label: '梨' },
  { key: 'peach', label: '桃子' },
  { key: 'ship-pear', label: '船梨（缺货）', disabled: true },
];
</script>

## Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `data` | `{ key, label, disabled? }[]` | — | 必填，候选池 |
| `v-model` | `string[]` | `[]` | 右侧面板持有的 key 集合，顺序始终跟随 `data` |
| `titles` | `[string, string]` | `['未选', '已选']` | 两侧面板标题 |
| `searchable` | `boolean` | `false` | 是否显示各面板的搜索框 |
| `emptyText` | `string` | `'无数据'` | 列表为空时的文案 |

## 事件

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| `change` | `string[]` | 每次搬运后的完整 key 集合 |

## 行为细节

- 禁用项不能勾选也不会被搬运；面板头部的计数只统计可用项。
- 头部复选框是「全选可见项」：搜索过滤后只全选过滤结果，与主流实现一致。
- 右侧顺序永远跟随 `data` 的声明顺序，不跟随搬运先后——穿梭框管理的是"哪些被选中"，
  不是"按什么顺序展示"，排序交给使用方自己排。

## 动效

条目跨栏搬运时，离开的一侧按移动方向滑出、到达的一侧上浮进场，
留在原地的条目靠 `TransitionGroup` 的 move 过渡平滑补位。

## 无障碍

行复选框是原生 `<input type="checkbox">`，键盘与读屏免费；两侧面板带 `aria-label`
（取自 `titles`）；移动按钮带 `aria-label` 并在无勾选时禁用。
