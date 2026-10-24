# 浮层：Tooltip 与 Drawer

两者都属于"从边上冒出来"的东西，共用一套进出场节奏：入场慢、离场快。

## MochiTooltip

<div class="demo">
  <MochiTooltip content="保存在本地，不会上传" placement="top">
    <MochiButton variant="soft" size="sm">悬停看看</MochiButton>
  </MochiTooltip>
  <MochiTooltip content="右侧" placement="right">
    <MochiTag>右侧</MochiTag>
  </MochiTooltip>
</div>

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `content` | `string` | — | 必填 |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | 相对触发元素的位置 |
| `delay` | `number` | `300` | 移入后延迟出现，避免划过时闪一片 |

鼠标移入、键盘聚焦都会显示；离开或失焦立即消失。气泡带 `role="tooltip"`。

**已知限制**：不做碰撞检测，靠近视口边缘时会溢出。内容短、位置可控时够用；
需要自动翻转请等 `MochiPopover`。

### 动效

出现时从 0.92 缩放 + 淡入，走 `--mochi-spring`；消失用 `--mochi-ease-in` 更快收掉，
不让鼠标离开后还挂着一块。延迟 300ms 是刻意的——划过一排图标时不该看到一片气泡。

## MochiDrawer

<MochiButton @click="drawer = true">打开抽屉</MochiButton>

<MochiDrawer v-model:open="drawer" title="岛民档案" placement="right" width="360px">
  <p style="margin: 0 0 12px">咕噜 · 岛龄 3 年</p>
  <p style="margin: 0">喜欢：钓鱼、看云、在广场发呆。</p>
  <template #footer>
    <MochiButton size="sm" variant="soft" @click="drawer = false">关闭</MochiButton>
    <MochiButton size="sm">加好友</MochiButton>
  </template>
</MochiDrawer>

<script setup>
import { ref } from 'vue';
const drawer = ref(false);
</script>

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | — | 头部标题，同时作为无障碍名称 |
| `placement` | `'left' \| 'right'` | `'right'` | 从哪一侧滑入 |
| `width` | `string` | `'320px'` | 抽屉宽度 |
| `maskClosable` | `boolean` | `true` | 点遮罩关闭 |

`v-model:open` 绑定开关。与 `MochiModal` 共用同一套浮层行为（`useOverlay`）：

- `Esc` 关闭，焦点陷阱在抽屉内部循环
- 打开时锁滚动，关闭后焦点还给触发元素

### 动效

整块抽屉从边缘滑入，时长 420ms、曲线 `--mochi-spring-soft`——比对话框更重的东西
应该更慢、过冲更小。遮罩 220ms 淡入，关闭时 120ms 加速离场。
