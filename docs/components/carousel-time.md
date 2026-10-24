# 轮播与时间选择

## MochiCarousel

<div class="demo" style="width: 100%; padding: 0">
  <MochiCarousel :items="slides" :interval="3500" height="180px" style="width: 100%">
    <template #slide="{ item }">
      <div
        :style="{
          width: '100%',
          height: '100%',
          display: 'grid',
          placeItems: 'center',
          background: item.bg,
          color: 'var(--mochi-ink)',
          fontSize: 'var(--mochi-font-size-lg)',
          fontWeight: 'var(--mochi-font-weight-bold)',
        }"
      >
        {{ item.alt }}
      </div>
    </template>
  </MochiCarousel>
</div>

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `items` | `{ key, alt?, ... }[]` | — | 必填，内容走 `#slide` 作用域插槽 |
| `interval` | `number` | `4000` | 自动播放间隔，`0` 关闭 |
| `height` | `string` | `'220px'` | 高度 |
| `label` | `string` | `'轮播'` | 无障碍名称 |

### 动效

- 轨道用 `transform` 平移，不重排；曲线 `--mochi-spring-soft`，比对话框慢一档
- 指示点选中时是**内层 `scaleX` 从 0 拉开**，不是改 width——改 width 会触发布局
- 箭头平时透明，悬停整块才淡入，不抢画面
- 鼠标移入即暂停，移开继续（不是重新计时）

### 交互

拖动超过 40px 也能切（`pointerdown/up` 记录位移）。`prefers-reduced-motion` 下不自动播放。

## MochiTimePicker

<div class="demo" style="width: 100%; max-width: 320px">
  <MochiTimePicker v-model="dinner" label="晚餐时间" hint="点开选择，选完自动收起" />
</div>

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `v-model` | `string` | `''` | `'HH:mm'` 字符串 |
| `label` / `hint` | `string` | — | 与输入框一致 |
| `placeholder` | `string` | `'选择时间'` | — |

两列 24/60 个选项，打开时用 `scrollIntoView({ block: 'center' })` 把已选项滑到列中间——
配合 `scroll-behavior: smooth`，是滑过去而不是瞬移。

**为什么不提供 `step`**：分钟粒度通常是 1 或 5，加一个 prop 就要多一条边界（边界值、非整数、键盘步进）。
需要 5 分钟粒度时，外层传 5 的倍数进来、过滤掉不符合的选项更直接。

<script setup>
import { ref } from 'vue';

const slides = [
  { key: 'a', alt: '薄荷岛', bg: 'color-mix(in srgb, var(--mochi-primary) 22%, var(--mochi-surface))' },
  { key: 'b', alt: '博物馆', bg: 'color-mix(in srgb, var(--mochi-accent) 22%, var(--mochi-surface))' },
  { key: 'c', alt: '小径', bg: 'color-mix(in srgb, var(--mochi-accent-candy) 22%, var(--mochi-surface))' },
];
const dinner = ref('18:30');
</script>
