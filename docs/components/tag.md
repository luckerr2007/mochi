# MochiTag

标签 / 胶囊徽章。色相只由底色和描边承担，文字一律使用 `--mochi-ink`。

## 色调

<div class="demo">
  <MochiTag>中性</MochiTag>
  <MochiTag tone="accent">薄荷</MochiTag>
  <MochiTag tone="candy">糖果</MochiTag>
  <MochiTag tone="danger">已过期</MochiTag>
</div>

```vue
<MochiTag>中性</MochiTag>
<MochiTag tone="accent">薄荷</MochiTag>
<MochiTag tone="candy">糖果</MochiTag>
<MochiTag tone="danger">已过期</MochiTag>
```

## 可关闭

<div class="demo">
  <MochiTag
    v-for="tag in tags"
    :key="tag"
    closable
    :close-label="`移除 ${tag}`"
    @close="remove(tag)"
  >
    {{ tag }}
  </MochiTag>
  <MochiButton v-if="!tags.length" size="sm" variant="ghost" @click="reset">重置</MochiButton>
</div>

```vue
<MochiTag closable close-label="移除 草莓" @close="remove('草莓')">草莓</MochiTag>
```

<script setup>
import { ref } from 'vue';
const initial = ['草莓', '胡萝卜', '铃兰'];
const tags = ref([...initial]);
function remove(tag) {
  tags.value = tags.value.filter((item) => item !== tag);
}
function reset() {
  tags.value = [...initial];
}
</script>

`close` 只负责通知，移除逻辑由使用方决定——组件不持有列表状态。

## Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `tone` | `'neutral' \| 'accent' \| 'candy' \| 'danger'` | `'neutral'` | — |
| `closable` | `boolean` | `false` | 渲染关闭按钮 |
| `closeLabel` | `string` | `'移除'` | 关闭按钮的无障碍名称 |

## 事件

| 名称 | 说明 |
| --- | --- |
| `close` | 点击关闭按钮 |

## 为什么文字不用彩色

"浅红底 + 红字"看起来更像错误标签，但 13px 的红字在浅底上只有 3.9:1，达不到 AA。
改成深棕字（8.5:1），色相交给底色与描边，反而更像游戏里的贴纸标签。

色调由 `color-mix()` 从令牌派生：

```css
background: color-mix(in srgb, var(--mochi-danger) 14%, var(--mochi-surface));
border-color: color-mix(in srgb, var(--mochi-danger) 55%, var(--mochi-line));
```

所以覆盖 `--mochi-danger` 时，标签会自动跟着变。
