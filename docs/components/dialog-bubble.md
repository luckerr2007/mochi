# MochiDialogBubble

对话气泡。尾巴是两段 SVG 路径而不是 CSS 三角形——这样才能做出不对称的手绘弧度。

## 示例

<div class="demo demo-col">
  <MochiDialogBubble
    placement="left"
    text="今天的胡萝卜收成不错，要不要一起去广场看看？"
    typewriter
    :speed="35"
  />
  <MochiDialogBubble placement="right" text="好呀，等我换上外套！" style="align-self: flex-end" />
</div>

```vue
<MochiDialogBubble placement="left" text="今天的胡萝卜收成不错……" typewriter />
<MochiDialogBubble placement="right" text="好呀，等我换上外套！" />
```

## 打字机

<div class="demo">
  <MochiButton variant="soft" size="sm" @click="replay += 1">重播</MochiButton>
  <MochiDialogBubble :key="replay" text="呼——终于把令牌都整理好了。" typewriter :speed="60" />
</div>

<script setup>
import { ref } from 'vue';
const replay = ref(0);
</script>

`typewriter` 会逐字显示 `text`，播完抛 `done`。若传了默认插槽，插槽优先、打字机不生效
（任意富内容的逐字控制不属于组件职责）。

## Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `text` | `string` | — | 打字机效果的文字源 |
| `placement` | `'left' \| 'right'` | `'left'` | 尾巴朝向 |
| `typewriter` | `boolean` | `false` | 逐字显示 |
| `speed` | `number` | `30` | 每字间隔（毫秒） |

## 事件

| 名称 | 说明 |
| --- | --- |
| `done` | 文字全部显示后触发；未开打字机时挂载即触发 |

## 无障碍

逐字显示的副本带 `aria-hidden`，整段文字放在 `aria-live="polite"` 的视觉隐藏区里——
读屏用户一次听到完整句子，而不是被逐字打断。`prefers-reduced-motion` 下跳过动画，直接给全文。

## 用到的令牌

`--mochi-surface`（气泡与尾巴共用同一个局部变量，保证颜色同步）、`--mochi-line`、
`--mochi-radius-lg`、`--mochi-shadow-soft`、`--mochi-font-size-base`。
