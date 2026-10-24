# MochiPanel

带 header / body / footer 三段 anatomy 的面板。三层边框：外描边 → 4px 空气层 → 内描边。

## 示例

<MochiPanel title="背包">
  <p style="margin: 0">面板主体。可以只有 header 和 body，footer 不给就不渲染。</p>
  <template #footer>
    <MochiButton size="sm" variant="soft">整理</MochiButton>
    <MochiButton size="sm">使用</MochiButton>
  </template>
</MochiPanel>

```vue
<MochiPanel title="背包">
  面板主体。
  <template #footer>
    <MochiButton size="sm">使用</MochiButton>
  </template>
</MochiPanel>
```

## 自定义头部

头部插槽优先于 `title`，适合放标题 + 操作按钮：

<MochiPanel>
  <template #header>
    <div style="display: flex; align-items: center; justify-content: space-between">
      <strong>今日委托</strong>
      <MochiTag tone="candy">3 件</MochiTag>
    </div>
  </template>
  头部完全自定义时，`title` 不会再渲染。
</MochiPanel>

## Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | — | 头部标题 |
| `headingLevel` | `2 \| 3 \| 4 \| 5 \| 6` | `3` | 标题的 HTML 层级，避免文档里跳级 |

## 插槽

| 名称 | 说明 |
| --- | --- |
| `header` | 自定义头部，优先于 `title` |
| default | 主体 |
| `footer` | 页脚；不传则不渲染，也不会留白 |

## 用到的令牌

三层边框由三条 `box-shadow` 叠成，没有额外 DOM：

```css
box-shadow:
  inset 0 0 0 var(--mochi-space-1) var(--mochi-surface),                          /* 空气层 */
  inset 0 0 0 calc(var(--mochi-space-1) + var(--mochi-border-hairline)) var(--mochi-line), /* 内框 */
  var(--mochi-shadow-soft);                                                       /* 氛围 */
```

分隔线用伪元素左右内缩 16px，这样不会把内框切断。
