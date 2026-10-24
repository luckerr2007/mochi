# 基础件

小零件，但决定整体质感。

## MochiDivider

<div class="demo demo-col">
  <MochiDivider />
  <MochiDivider label="或者" />
  <div style="display: flex; align-items: center; gap: var(--mochi-space-3)">
    <span>上</span>
    <MochiDivider vertical />
    <span>下</span>
  </div>
</div>

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `vertical` | `boolean` | `false` | 竖线，靠 `align-self: stretch` 撑高 |
| `label` | `string` | — | 居中的文字，仅水平方向有效 |

带 `role="separator"` 与 `aria-orientation`。

## MochiBadge

<div class="demo">
  <MochiBadge :value="3"><MochiButton variant="soft">邮件</MochiButton></MochiBadge>
  <MochiBadge value="99+"><MochiAvatar name="咕噜" /></MochiBadge>
  <MochiBadge dot tone="accent"><MochiButton variant="ghost">在线</MochiButton></MochiBadge>
</div>

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `value` | `string \| number` | — | 角标内容 |
| `dot` | `boolean` | `false` | 只显示小圆点 |
| `tone` | `'primary' \| 'accent' \| 'candy' \| 'danger'` | `'danger'` | — |

角标用 `box-shadow: 0 0 0 2px surface` 做出与底色的"挖孔"边界，不依赖背景色。

## MochiAvatar

<div class="demo">
  <MochiAvatar size="sm" name="咕噜" />
  <MochiAvatar name="小动物" />
  <MochiAvatar size="lg" src="/missing.png" name="阿獭" />
</div>

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `src` | `string` | — | 图片地址 |
| `name` | `string` | — | 同时作为 `alt`；加载失败时取首字 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 28 / 40 / 56px |

上面第三个用了不存在的图片，`@error` 后自动退回首字——这一类兜底不写就会露出破图。
