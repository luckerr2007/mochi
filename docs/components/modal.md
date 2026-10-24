# MochiModal

对话框。遮罩淡入、面板弹起，焦点锁在内部。

## 示例

<MochiButton @click="open = true">打开对话框</MochiButton>

<MochiModal v-model:open="open" title="确认出售">
  这个化石能卖 3500 铃钱，卖出后无法找回。确定吗？
  <template #footer>
    <MochiButton variant="ghost" size="sm" @click="open = false">再想想</MochiButton>
    <MochiButton size="sm" @click="open = false">卖出</MochiButton>
  </template>
</MochiModal>

```vue
<script setup>
import { ref } from 'vue';
const open = ref(false);
</script>

<template>
  <MochiButton @click="open = true">打开对话框</MochiButton>

  <MochiModal v-model:open="open" title="确认出售">
    这个化石能卖 3500 铃钱。
    <template #footer>
      <MochiButton size="sm" @click="open = false">卖出</MochiButton>
    </template>
  </MochiModal>
</template>
```

<script setup>
import { ref } from 'vue';
const open = ref(false);
</script>

## Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | — | 头部标题，同时作为对话框的无障碍名称 |
| `maskClosable` | `boolean` | `true` | 点击遮罩是否关闭 |
| `closeLabel` | `string` | `'关闭'` | 关闭按钮的无障碍名称 |

`v-model:open` 绑定开关。插槽：默认（正文）、`#header`、`#footer`。

## 键盘与焦点

- `Esc` 关闭
- 打开时焦点移到面板，`Tab` / `Shift+Tab` 在**面板内部**循环，不会跑到背景页面
- 关闭后焦点还给打开它的那个元素
- 打开期间 `html` 的 `overflow: hidden`，背景不跟着滚

## 动效细节

| 元素 | 处理 |
| --- | --- |
| 遮罩 | 220ms 淡入，关闭时 120ms 加速离场（`--mochi-ease-in`） |
| 面板 | 上移 8px + 缩放到 0.96 起手，用 `--mochi-spring-soft`——过冲比按钮小，对话框不该像果冻 |
| 关闭按钮 | 悬停旋转 90° |
| 降低动态 | 全部动画关闭，只保留出现/消失 |
