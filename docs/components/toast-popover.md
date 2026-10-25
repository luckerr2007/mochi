# 非阻塞提示与浮层

## MochiToastHost + useToast

<div class="demo">
  <MochiButton size="sm" @click="notify('success')">保存成功</MochiButton>
  <MochiButton size="sm" variant="soft" @click="notify('info')">有新邮件</MochiButton>
  <MochiButton size="sm" variant="ghost" @click="notify('danger')">上传失败</MochiButton>
  <MochiButton size="sm" variant="ghost" @click="sticky">不自动消失</MochiButton>
</div>

```ts
import { useToast } from 'mochi-island-ui';

const { toast } = useToast();
toast('已保存');                                    // 最简写法
toast({ title: '上传失败', tone: 'danger', description: '网络中断' });
toast({ title: '需要手动关闭', duration: 0 });        // 0 = 不自动消失
```

```vue
<!-- 应用根组件挂一次 -->
<MochiToastHost />
```

| 参数 | 默认 | 说明 |
| --- | --- | --- |
| `title` | — | 必填 |
| `description` | — | 第二行小字 |
| `tone` | `info` | `info` / `success` / `warning` / `danger` |
| `duration` | `3200` | 毫秒；`0` 表示常驻 |

### 动效细节

- **入场**：从上方 8px 处 `scale(0.96)` 弹入，走 `--mochi-spring`
- **离场**：**绝对定位**后再淡出——不然它一消失，下面的通知会"跳"一下补位
- **补位**：`TransitionGroup` 的 `move-class` 让剩余通知平滑上移，这是堆叠不抖的关键
- **进度条**：CSS 动画 + `animation-play-state`，鼠标悬停时**暂停**，移开**续播**（不是重新计时）
- 悬停同时暂停 JS 定时器并扣减剩余时间，两条时间线始终一致

## MochiPopover

<div class="demo">
  <MochiPopover>
    <template #trigger="{ attrs }">
      <MochiButton size="sm" variant="soft" v-bind="attrs">点我看详情</MochiButton>
    </template>
    <p style="margin: 0">浮层里可以放任意内容：表单、按钮、列表。</p>
    <p style="margin: 8px 0 0; color: var(--mochi-ink-soft); font-size: 12px">
      点击外部或按 Esc 关闭。
    </p>
  </MochiPopover>
</div>

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'bottom'` | 下方放不下会自动翻到上方 |
| `width` | `string` | `'240px'` | 浮层宽度 |
| `v-model:open` | `boolean` | `false` | 受控展开 |

触发槽会收到 `{ open, attrs }`，把 `attrs` 绑到自己的按钮上即可获得
`aria-expanded` / `aria-haspopup`。**点击由包装层统一处理**——槽里不要再绑 `@click`，
否则冒泡会触发两次、开了又关。浮层本身是 `role="dialog"`。

## MochiPopconfirm

<div class="demo">
  <MochiPopconfirm title="确定要移出岛屿吗？" description="这个操作无法撤销。" @confirm="confirmed = true">
    <template #trigger>
      <MochiButton size="sm" variant="soft">移出岛民</MochiButton>
    </template>
  </MochiPopconfirm>
</div>

<p v-if="confirmed" style="color: var(--mochi-ink-soft); font-size: 13px">已确认（演示用）</p>

| 名称 | 默认 | 说明 |
| --- | --- | --- |
| `title` | — | 必填 |
| `description` | — | 补充说明 |
| `confirmText` / `cancelText` | `确定` / `取消` | 按钮文案 |
| `tone` | `'default'` | `'danger'` 时确认按钮换成危险色 |

气泡确认框：删除等危险操作前的轻量二次确认，确认/取消后自动收起。事件：`confirm` / `cancel`。

<script setup>
import { ref } from 'vue';
import { useToast } from 'mochi-island-ui';

const { toast } = useToast();
const confirmed = ref(false);

function notify(tone) {
  const map = {
    success: { title: '已保存', description: '博物馆的捐赠记录更新了', tone: 'success' },
    info: { title: '有新邮件', description: '来自岛民「阿獭」', tone: 'info' },
    danger: { title: '上传失败', description: '网络连接中断，请重试', tone: 'danger' },
  };
  toast(map[tone]);
}

function sticky() {
  toast({ title: '这条不会自己消失', description: '点右侧 × 关闭', tone: 'warning', duration: 0 });
}
</script>

<MochiToastHost />
