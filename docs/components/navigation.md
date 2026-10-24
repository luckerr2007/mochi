# 导航件

## MochiTabs

<div class="demo demo-col" style="width: 100%">
  <MochiTabs v-model="tab" :items="tabs">
    <template #home>今天可以给花浇水、寄信、或者去海边发呆。</template>
    <template #bag>背包里有 3 个苹果、1 把虫网。</template>
    <template #map>地图上还有两个没去过的小岛。</template>
  </MochiTabs>
</div>

<script setup>
import { ref } from 'vue';
const tab = ref('home');
const tabs = [
  { key: 'home', label: '今天' },
  { key: 'bag', label: '背包' },
  { key: 'map', label: '地图' },
  { key: 'shop', label: '商店', disabled: true },
];
</script>

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `items` | `{ key, label, disabled? }[]` | — | 必填 |
| `label` | `string` | — | tablist 的无障碍名称 |

`v-model` 绑定当前 `key`。内容用**同名插槽**提供：`<template #home>…</template>`。

### 键盘

- `←` / `→` 在可用项之间循环，跳过禁用项
- `Home` 回到第一项
- 只有当前项 `tabindex=0`，其余为 `-1`——Tab 键只会在整组里停一次

面板带 `role="tabpanel"` 与 `aria-labelledby`，`tabindex="0"` 便于键盘用户进入内容区。

## MochiCollapse

<div class="demo demo-col" style="width: 100%">
  <MochiCollapse title="岛屿等级怎么提升？">
    完成日常委托、捐建公共设施、保持环境整洁都会累积评价。
  </MochiCollapse>
  <MochiCollapse title="默认展开的一项" open>
    展开状态由 `open` 属性初始化，之后是浏览器原生行为。
  </MochiCollapse>
</div>

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | — | 必填，渲染进 `<summary>` |
| `open` | `boolean` | `false` | 初始展开状态 |

### 为什么是详细信息元素

`<details>` / `<summary>` 自带展开、键盘（Enter/Space）、读屏语义和浏览器内查找的展开行为，
一行 JS 都不用写。代价是**非受控**：展开后组件不再跟踪状态，需要受控展开时用 `v-if` 重建。

箭头用 `::before` 画的两个边框旋转 45°，和全局的描边风格一致。
