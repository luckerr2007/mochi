# 表格与上传

## MochiTable

<div class="demo" style="width: 100%">
  <MochiTable :columns="columns" :rows="rows" striped style="width: 100%">
    <template #cell-status="{ value }">
      <MochiTag :tone="value === '在售' ? 'accent' : 'neutral'">{{ value }}</MochiTag>
    </template>
  </MochiTable>
</div>

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `columns` | `{ key, title, width?, align?, sortable? }[]` | — | 必填 |
| `rows` | `Record<string, unknown>[]` | — | 必填 |
| `rowKey` | `string` | `'id'` | 行主键字段 |
| `striped` | `boolean` | `false` | 斑马纹 |
| `emptyText` | `string` | `'暂无数据'` | 空态文案 |

插槽：`cell-{key}` 自定义单元格（收到 `row` / `value` / `index`），`empty` 自定义空态。

### 排序

点表头在 **升序 → 降序 → 取消** 三态间循环，数字按大小、其余按 `localeCompare('zh-CN')` 比较。
表头带 `aria-sort`，排序状态变化时抛 `sort-change`。

### 动效

- 排序箭头旋转 180°（`--mochi-spring`），未排序时整组箭头透明
- 行悬停 120ms 底色过渡，斑马纹与悬停色叠在一层 `color-mix` 上，不会互相覆盖
- 表头底色比表体深一档（`--mochi-bg-sunken`），滚动时视线有落点

## MochiUpload

<div class="demo" style="width: 100%">
  <MochiUpload :max-size="2 * 1024 * 1024" style="width: 100%" />
</div>

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `accept` | `string` | — | 原生 accept |
| `multiple` | `boolean` | `true` | 多选 |
| `maxSize` | `number` | — | 单文件上限（字节），超出的会被静默丢弃 |
| `hint` | `string` | `'点击选择，或把文件拖进来'` | 提示文案 |
| `disabled` | `boolean` | `false` | — |

事件：`change(files: File[])`。**它只负责选择和列表，不上传**——上传请求的鉴权、并发、
重试每个项目都不一样，塞进组件只会变成又一个要配置的壳。

### 动效

- 拖入时整块"吸住"：边框换成主色、底色转浅、整体放大 1.01（`--mochi-spring`）
- 文件行滑入后，**离场的行绝对定位**再淡出，剩余行用 `move` 过渡补位——和 Toast 同一套手法
- 删除按钮悬停旋转 90°

<script setup>
import { ref } from 'vue';

const columns = [
  { key: 'name', title: '家具' },
  { key: 'price', title: '价格', sortable: true, align: 'right' },
  { key: 'status', title: '状态' },
];
const rows = [
  { id: 1, name: '藤编椅', price: 1200, status: '在售' },
  { id: 2, name: '贝壳灯', price: 860, status: '在售' },
  { id: 3, name: '化石模型', price: 3500, status: '已售出' },
];
</script>
