# 补充件 · 第三弹

页面级公告条、加载更多与键位徽章——配套上一篇的弹窗与列表使用。

## MochiBanner

页面级公告横幅。与 Alert 同一套语气语言，但形态是整行条幅；关闭时高度收起而不是瞬间消失。

<div class="demo demo-col" style="width: 100%">
  <MochiBanner v-model:open="bannerOpen" tone="info" title="版本公告">
    Mochi 迎来了 74 个组件，冬季更新到货。
  </MochiBanner>
  <MochiBanner v-model:open="warnOpen" tone="warning" title="维护预告" :closable="false">
    今晚 2:00-3:00 岛屿维护。
  </MochiBanner>
  <MochiButton size="sm" variant="soft" @click="bannerOpen = true; warnOpen = true">重新展开</MochiButton>
</div>

```vue
<script setup>
import { ref } from 'vue';
const open = ref(true);
</script>

<template>
  <MochiBanner v-model:open="open" tone="info" title="版本公告">
    冬季更新到货。
  </MochiBanner>
</template>
```

<script setup>
import { ref } from 'vue';
const bannerOpen = ref(true);
const warnOpen = ref(true);
const status = ref('idle');
function load() {
  status.value = 'loading';
  setTimeout(() => (status.value = 'done'), 1500);
}
</script>

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `v-model:open` | `boolean` | `true` | 开合；关闭时高度收起 |
| `tone` | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'` | 徽章符号与底色 |
| `title` | `string` | — | 加粗前缀 |
| `sticky` | `boolean` | `false` | 固定在视口顶部（全站公告） |
| `closable` | `boolean` | `true` | 是否显示关闭钮 |

事件：`close`。`sticky` 模式会带景深阴影并悬浮于页面之上。

## MochiLoadMore

加载更多。三种状态一个组件：可点击 → 加载中（线团旋转）→ 没有更多（虚线灰签）。

<div class="demo demo-col">
  <MochiLoadMore :status="status" @more="load" />
</div>

```vue
<script setup>
import { ref } from 'vue';
const status = ref('idle');
function load() {
  status.value = 'loading';
  setTimeout(() => (status.value = 'done'), 1200);
}
</script>

<template>
  <MochiLoadMore :status="status" @more="load" />
</template>
```

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `status` | `'idle' \| 'loading' \| 'done'` | `'idle'` | 状态机由使用方驱动 |
| `idleText` / `loadingText` / `doneText` | `string` | 见左 | 三态文案 |

事件：`more`——仅 idle 态可点击。

## MochiKbd

键位徽章。展示快捷键或按键提示，与 CommandPalette 里的键位同一套视觉。

<div class="demo">
  <span>按 <MochiKbd>⌘K</MochiKbd> 唤起命令面板，<MochiKbd>Esc</MochiKbd> 关闭，<MochiKbd>↑</MochiKbd><MochiKbd>↓</MochiKbd> 选择。</span>
</div>

无 props，内容即按键名。
