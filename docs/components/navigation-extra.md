# 导航：Pagination 与 Steps

## MochiPagination

<div class="demo demo-col" style="width: 100%">
  <MochiPagination v-model="currentPage" :total="20" />
  <p style="margin: 0; color: var(--mochi-ink-soft); font-size: 13px">第 {{ currentPage }} 页</p>
</div>

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `total` | `number` | — | 总页数，必填 |
| `siblings` | `number` | `1` | 当前页两侧各显示几个页码 |
| `label` | `string` | `'分页'` | nav 的无障碍名称 |

`v-model` 绑定当前页。页码折叠规则：总数超过 `siblings × 2 + 5` 时才出现省略号，
首尾页永远可见。当前页带 `aria-current="page"`。

### 动效

每个页码都是 32px 的小台阶按钮：悬停抬 1px、台阶长 1px，按下塌回并压到 90ms。
和主按钮同一套物理，只是尺寸小一号。

## MochiSteps

<div class="demo demo-col" style="width: 100%">
  <MochiSteps :current="step" :items="steps" />
  <div class="row">
    <MochiButton size="sm" variant="soft" :disabled="step === 0" @click="step -= 1">上一步</MochiButton>
    <MochiButton size="sm" :disabled="step === steps.length - 1" @click="step += 1">下一步</MochiButton>
  </div>
</div>

<script setup>
import { ref } from 'vue';
const currentPage = ref(10);
const step = ref(1);
const steps = [
  { title: '下单', description: '选择商品' },
  { title: '付款', description: '铃钱或里程' },
  { title: '发货', description: '等待航班' },
];
</script>

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `items` | `{ title, description? }[]` | — | 必填 |
| `current` | `number` | `0` | 当前步骤下标（0 起） |

当前步带 `aria-current="step"`。已完成的步骤显示勾，未完成显示序号。

### 动效

- 连接线用 `scaleX` 从 0 拉到 1——改 `transform` 而不是 `width`，不触发重排
- 当前步骤的圆点从 0.8 弹到 1，走 `--mochi-spring`
- 状态颜色过渡 220ms，勾的出现与圆点同步
