# 数据展示件：Statistic · Descriptions · Timeline · Breadcrumb

## MochiStatistic

<div class="demo">
  <MochiStatistic title="铃钱余额" :value="128450" suffix="铃" />
  <MochiStatistic title="岛屿评分" :value="4.7" :precision="1" suffix="/ 5" />
</div>

| props | 默认 | 说明 |
| --- | --- | --- |
| `value` | — | 必填，数字 |
| `precision` | `0` | 小数位 |
| `prefix` / `suffix` | — | 前后缀 |
| `duration` | `700` | 滚动时长（ms） |

数字从 0 滚到目标值，`easeOutCubic` 收尾，用 `Intl.NumberFormat` 加千分位。
`prefers-reduced-motion` 下直接显示终值——数字滚动对晕动敏感的人不友好。

## MochiDescriptions

<div class="demo" style="width: 100%">
  <MochiDescriptions :columns="2" :items="profile" />
</div>

| props | 默认 | 说明 |
| --- | --- | --- |
| `items` | — | `{ label, value }[]` |
| `columns` | `2` | 列数，窄屏自动退成单列 |

语义是 `<dl>/<dt>/<dd>`，不是一排 div。

## MochiTimeline

<div class="demo" style="width: 100%">
  <MochiTimeline :items="events" />
</div>

| props | 说明 |
| --- | --- |
| `items` | `{ title, description?, time?, tone? }[]` |
| `tone` | `primary` / `accent` / `candy` |

色点按索引错峰 60ms 弹入（`--mochi-stagger`），轴线是静态的——动的东西只该有一个焦点。

## MochiBreadcrumb

<div class="demo">
  <MochiBreadcrumb :items="crumbs" />
</div>

| props | 说明 |
| --- | --- |
| `items` | `{ label, href? }[]`，最后一项渲染为 `aria-current="page"` |
| `label` | nav 的无障碍名称，默认「面包屑」 |

分隔符由 CSS `::before` 生成，不占 DOM，也不会被读屏念成"斜杠"。

<script setup>
import { ref } from 'vue';
const profile = [
  { label: '岛名', value: '薄荷岛' },
  { label: '岛主', value: '咕噜' },
  { label: '评级', value: '五星' },
  { label: '人口', value: '8 人' },
];
const events = [
  { title: '登岛', time: '第 1 天' },
  { title: '开出第一间店', time: '第 12 天', tone: 'accent' },
  { title: '博物馆落成', time: '第 88 天', tone: 'candy' },
];
const crumbs = [
  { label: '首页', href: '/' },
  { label: '家具', href: '/furniture' },
  { label: '藤编系列' },
];
</script>
