# MochiButton

胶囊按钮。主按钮带 3D 台阶，按下时整体下沉——位移量正好等于台阶高度。

## 变体

<div class="demo">
  <MochiButton>主要操作</MochiButton>
  <MochiButton variant="soft">次级操作</MochiButton>
  <MochiButton variant="ghost">幽灵按钮</MochiButton>
  <MochiButton disabled>禁用</MochiButton>
</div>

```vue
<MochiButton>主要操作</MochiButton>
<MochiButton variant="soft">次级操作</MochiButton>
<MochiButton variant="ghost">幽灵按钮</MochiButton>
```

## 尺寸

<div class="demo">
  <MochiButton size="sm">小号</MochiButton>
  <MochiButton size="md">中号</MochiButton>
  <MochiButton size="lg">大号</MochiButton>
</div>

## Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `variant` | `'primary' \| 'soft' \| 'ghost'` | `'primary'` | 只有前两者带立体台阶 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 内边距是 4px 网格的整数倍 |
| `disabled` | `boolean` | `false` | 透传到原生 `button` |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | — |

其余属性（`@click`、`aria-*` 等）直接落到原生 `<button>` 上。

## 用到的令牌

| 令牌 | 作用 |
| --- | --- |
| `--mochi-shadow-press` | 静止时的 4px 实色台阶 |
| `--mochi-shadow-offset` | 按下位移量，与台阶高度同源 |
| `--mochi-spring` | 松手回弹的过冲曲线 |
| `--mochi-duration-fast` | 按压时长 |
| `--mochi-focus-ring` | 双层焦点环 |

悬停时抬升 1px、台阶同步长到 5px（`calc(偏移 + 1px)`），视觉上始终"贴着地面"。
`prefers-reduced-motion: reduce` 下移除过渡与悬停抬升，但保留按下这一状态反馈。
