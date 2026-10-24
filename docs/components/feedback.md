# 反馈件

## MochiAlert

<div class="demo demo-col">
  <MochiAlert tone="info" title="今日公告">广场今晚有烟火大会，记得带毯子。</MochiAlert>
  <MochiAlert tone="success" title="已保存">你的岛屿档案更新了。</MochiAlert>
  <MochiAlert tone="warning" title="注意">背包快满了。</MochiAlert>
  <MochiAlert tone="danger" title="失败了" closable @close="() => {}">网络连接中断，请重试。</MochiAlert>
</div>

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `tone` | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'` | 决定徽章符号、底色与虚线框颜色 |
| `title` | `string` | — | 加粗标题行 |
| `closable` | `boolean` | `false` | 右侧关闭按钮 |
| `closeLabel` | `string` | `'关闭'` | 关闭按钮的无障碍名称 |

`role="status"`（polite），不会像 `role="alert"` 那样打断读屏正在读的内容。
色相全部由 `color-mix()` 从令牌派生，覆盖 `--mochi-danger` 时整条自动跟随。

## MochiSpinner

<div class="demo">
  <MochiSpinner :size="16" />
  <MochiSpinner />
  <MochiSpinner :size="32" label="正在读取岛屿数据" />
  <MochiButton disabled><MochiSpinner :size="16" /> 保存中</MochiButton>
</div>

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `size` | `number` | `20` | 直径（px） |
| `label` | `string` | `'加载中'` | 视觉隐藏的播报文本 |

外层 `role="status"`，旋转环本身 `aria-hidden`。`prefers-reduced-motion` 下把转速放慢到 3s，
而不是完全停住——停住的加载指示器比转得慢更让人困惑。

## MochiSkeleton

<div class="demo demo-col" style="width: 100%">
  <MochiSkeleton :lines="3" />
  <MochiSkeleton width="120px" height="40px" rounded="full" />
</div>

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `lines` | `number` | `1` | 多行时最后一行自动缩短到 60% |
| `width` / `height` | `string` | `100%` / `14px` | — |
| `rounded` | `'sm' \| 'md' \| 'full'` | `'sm'` | — |

骨架整体 `aria-hidden`——读屏用户不需要听"正在加载的灰色方块"。

## MochiEmpty

<div class="demo demo-col" style="width: 100%">
  <MochiEmpty description="还没有收藏任何家具">
    <template #action>
      <MochiButton size="sm">去逛逛</MochiButton>
    </template>
  </MochiEmpty>
</div>

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `description` | `string` | `'这里什么都没有'` | 也可用 `#description` 插槽 |

还有一个 `#action` 插槽放按钮。空状态的插图只用了虚线圆盘，不引入图片资源。
