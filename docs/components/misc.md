# 补充件

这些小件不占独立页面，但少一个都会让页面"凑"起来。

## MochiDropdown

<div class="demo">
  <MochiDropdown :items="menu" @select="picked = $event">
    <template #trigger>
      <MochiButton size="sm" variant="soft">更多操作</MochiButton>
    </template>
  </MochiDropdown>
  <MochiText v-if="picked" tone="soft" size="sm">已选择：{{ picked }}</MochiText>
</div>

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `items` | `{ key, label, disabled?, divider? }[]` | — | 必填 |
| `width` | `string` | `'180px'` | 菜单宽度 |

事件 `select(key)`。菜单项 `role="menuitem"`，`↑` `↓` 在可用项间移动焦点，
点击外部或 `Esc` 关闭（复用 Popover 的行为）。

**动效**：菜单项按索引错峰 24ms 上浮淡入，比整块一起出现更像"被拉出来"。

## MochiCountUp

<div class="demo" style="gap: var(--mochi-space-8)">
  <MochiCountUp :value="128450" suffix="铃" />
  <MochiCountUp :value="4.7" :precision="1" suffix="/ 5" />
</div>

| 名称 | 默认值 | 说明 |
| --- | --- | --- |
| `value` | — | 必填 |
| `duration` | `700` | 滚动时长（ms） |
| `precision` | `0` | 小数位 |
| `prefix` / `suffix` | — | 前后缀 |

内部就是 `useCountUp` 组合式函数（rAF + easeOutCubic + `Intl.NumberFormat`），
`MochiStatistic` 用的是同一份实现——数字滚动只有一处代码。

## MochiResult

<div class="demo" style="width: 100%">
  <MochiResult tone="success" title="捐赠成功" description="博物馆已经收到你的化石了。" style="width: 100%">
    <template #actions>
      <MochiButton size="sm" variant="soft">再捐一件</MochiButton>
    </template>
  </MochiResult>
</div>

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `tone` | `'success' \| 'info' \| 'warning' \| 'danger'` | `'info'` | — |
| `title` | `string` | — | 必填 |
| `description` | `string` | — | 补充说明 |

插槽：默认（额外内容）、`actions`。

**动效**：外圈从 0.7 弹到 1，勾/叉延迟 120ms 再"画"出来（`stroke-dashoffset`）——
先有容器再有符号，视线有先后。

## MochiSpace

```vue
<MochiSpace size="md" wrap>
  <MochiButton>一</MochiButton>
  <MochiButton>二</MochiButton>
</MochiSpace>
```

| 名称 | 默认值 | 说明 |
| --- | --- | --- |
| `size` | `'md'` | `sm`=8 / `md`=16 / `lg`=24，也可传数字（px） |
| `vertical` | `false` | 纵向排列 |
| `wrap` | `false` | 自动换行 |

语义档位全部映射回 4px 网格，不接受"随手写个 14px"。

## MochiLink

<div class="demo">
  <MochiLink href="https://example.com" external>外部链接</MochiLink>
  <MochiLink href="#用法" @click.prevent>页内链接</MochiLink>
  <MochiLink href="#" disabled>已禁用</MochiLink>
</div>

| 名称 | 默认值 | 说明 |
| --- | --- | --- |
| `href` | — | 禁用时会被摘掉，防止误跳 |
| `external` | `false` | 补 `target="_blank"` + `rel="noreferrer noopener"`，并显示外链箭头 |
| `disabled` | `false` | `aria-disabled` + 阻止默认行为 |

**动效**：下划线用 `background-size` 从 0 拉满（不触发重排），外链箭头同时向右上轻移 1px。

## MochiText

```vue
<MochiText as="p" size="sm" tone="soft">次要说明</MochiText>
<MochiText as="strong" tone="danger" bold>危险</MochiText>
```

| 名称 | 默认值 | 说明 |
| --- | --- | --- |
| `as` | `'span'` | 渲染的标签：`p` / `strong` / `small`… |
| `size` | `'base'` | `sm` / `base` / `lg` |
| `tone` | `'default'` | `default` / `soft` / `danger` / `accent` |
| `bold` | `false` | 加粗 |

<script setup>
import { ref } from 'vue';
const picked = ref('');
const menu = [
  { key: 'edit', label: '编辑' },
  { key: 'duplicate', label: '复制一份' },
  { key: 'remove', label: '删除', divider: true },
  { key: 'archive', label: '归档', disabled: true },
];
</script>
