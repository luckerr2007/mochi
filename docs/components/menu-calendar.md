# 菜单、日历与日期选择

## MochiMenu

<div class="demo" style="width: 480px; max-width: 100%">
  <MochiMenu v-model="activeMenu" :items="menuItems" style="flex: 1" />
  <MochiCalendar v-model="date" style="flex: none" />
</div>

<p style="color: var(--mochi-ink-soft); font-size: 13px">
  当前菜单：<code>{{ activeMenu }}</code> · 当前日期：<code>{{ date ? date.toLocaleDateString('zh-CN') : '未选' }}</code>
</p>

### Menu 的 props

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| `items` | `{ key, label, disabled?, children? }[]` | `children` 支持一级子菜单 |
| `label` | `string` | nav 的无障碍名称 |

`v-model` 绑定当前项 key。

**动效**：
- 选中指示条是一条 `3px` 的竖条，在条目之间**滑动**（只动 `transform`，不触发重排）
- 分组展开用 `grid-template-rows: 0fr → 1fr` 补间，不需要 JS 测高度，也就不需要监听内容变化
- 箭头旋转 180°，与展开状态同步

**为什么只支持一级子菜单**：再深就该换布局（侧边栏折叠 / 面包屑），
而不是继续往菜单里塞缩进。

## MochiDatePicker

<div class="demo" style="width: 100%; max-width: 320px">
  <MochiDatePicker v-model="picked2" label="入住日期" hint="点开选择，选完自动收起" />
</div>

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `v-model` | `Date \| null` | `null` | 选中日期 |
| `label` / `hint` | `string` | — | 与输入框一致 |
| `placeholder` | `string` | `'选择日期'` | 未选择时的文案 |
| `disabled` / `invalid` | `boolean` | `false` | — |

底下就是 `MochiCalendar`，外面套 `FieldShell`（同款凹陷槽）+ `Popover`（无边框模式）。
**选完自动收起**——日期选择器不该让用户再点一次外部。

### 动效

- 弹层从触发框下方弹入（`scale(0.96)` + 4px 位移，`--mochi-spring`）
- 日历自带换月滑动与选中弹起，两层动效叠加但方向一致

## MochiCalendar

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| `v-model` | `Date \| null` | 选中的日期 |
| `label` | `string` | 无障碍名称 |

### 键盘

| 按键 | 行为 |
| --- | --- |
| `←` `→` | 前一天 / 后一天 |
| `↑` `↓` | 前一周 / 后一周 |
| `Tab` | 只在「今天」和「已选日」之间停靠（roving tabindex） |

### 动效

- 换月时整块网格按方向滑入 8px 并淡入——往后翻从右边来，往前翻从左边来
- 选中日从 `scale(0.9)` 弹到 1（`--mochi-spring`）
- 「今天」只描一圈细边，不填色，把实心留给选中态

### 已知限制

不支持日期范围选择、快捷选项（今天/最近七天）、禁用日期。这些是 DatePicker 的职责，
等它做的时候从 Calendar 拆出来，而不是往日历里堆 props。

<script setup>
import { ref } from 'vue';

const activeMenu = ref('museum');
const date = ref(new Date());
const picked2 = ref(null);

const menuItems = [
  { key: 'home', label: '首页' },
  {
    key: 'island',
    label: '岛屿',
    children: [
      { key: 'museum', label: '博物馆' },
      { key: 'shop', label: '商店' },
      { key: 'airport', label: '机场', disabled: true },
    ],
  },
  { key: 'resident', label: '岛民名册' },
];
</script>
