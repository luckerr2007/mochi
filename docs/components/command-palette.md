# MochiCommandPalette

命令面板。`⌘K` / `Ctrl+K` 唤起的全局快捷入口：搜索过滤、方向键选择、回车执行。

## 示例

<div class="demo demo-col" style="width: 100%; max-width: 360px">
  <MochiButton @click="open = true">打开命令面板（试试 ⌘K）</MochiButton>
  <MochiCommandPalette v-model:open="open" :commands="commands" @select="(c) => (last = c.label)" />
  <p style="margin: 0">最近执行：<code>{{ last || '无' }}</code></p>
</div>

```vue
<script setup>
import { ref } from 'vue';
const open = ref(false);
const last = ref('');
const commands = [
  { key: 'save', label: '保存岛屿', hint: '⌘S' },
  { key: 'photo', label: '拍照模式' },
  { key: 'shop', label: '商店', group: '前往' },
  { key: 'museum', label: '博物馆', group: '前往' },
];
</script>

<template>
  <MochiButton @click="open = true">打开命令面板</MochiButton>
  <MochiCommandPalette v-model:open="open" :commands="commands" @select="c => last = c.label" />
</template>
```

<script setup>
import { ref } from 'vue';
const open = ref(false);
const last = ref('');
const commands = [
  { key: 'save', label: '保存岛屿', hint: '⌘S' },
  { key: 'photo', label: '拍照模式' },
  { key: 'shop', label: '商店', group: '前往' },
  { key: 'museum', label: '博物馆', group: '前往' },
  { key: 'airport', label: '机场（维护中）', group: '前往', disabled: true },
];
</script>

## Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `commands` | `MochiCommand[]` | — | 必填，命令清单 |
| `v-model:open` | `boolean` | `false` | 开关状态 |
| `placeholder` | `string` | `'搜索命令…'` | 搜索框占位文案，同时是面板的 `aria-label` |
| `emptyText` | `string` | `'没有匹配的命令'` | — |
| `hotkey` | `boolean` | `true` | 是否监听 `⌘K` / `Ctrl+K` 唤起 |

**MochiCommand**：`{ key, label, hint?, group?, disabled? }`。`hint` 一般放快捷键；
相邻同名 `group` 共用一个组标题。

## 事件

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| `select` | `MochiCommand` | 回车或点击某条命令；面板自动收起 |

## 键盘

| 按键 | 行为 |
| --- | --- |
| `⌘K` / `Ctrl+K` | 唤起（面板开着时不抢） |
| `↑` `↓` | 移动高亮项，跳过禁用项，循环 |
| `Enter` | 执行高亮命令并关闭 |
| `Esc` | 关闭，焦点归还给唤起前的元素 |
| `Tab` | 焦点困在面板内（`aria-modal` 对话框） |

## 行为细节

- 每次打开都清空上一次的查询——命令面板是"来去匆匆"的入口，不是持久搜索页。
- 面板钉在视口上方 20vh 处，符合命令面板惯例（视线偏上的位置），不做正中央对话框。
- 命令执行属于业务：组件只回传选中的命令，路由跳转、保存动作都由使用方接。
