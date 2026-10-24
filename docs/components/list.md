# MochiList

列表。提供行距、分隔线与**错峰入场**——`--mochi-stagger` 这个令牌就是为它准备的。

## 示例

<div class="demo demo-col">
  <MochiList ordered stagger :key="replay">
    <li v-for="chore in chores" :key="chore">{{ chore }}</li>
  </MochiList>
  <MochiButton size="sm" variant="ghost" @click="replay += 1">重播入场</MochiButton>
</div>

<script setup>
import { ref } from 'vue';
const replay = ref(0);
const chores = ['给花浇水', '寄一封信给邻居', '把贝壳捐给博物馆'];
</script>

```vue
<MochiList ordered stagger>
  <li>给花浇水</li>
  <li>寄一封信给邻居</li>
</MochiList>
```

## Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `ordered` | `boolean` | `false` | 渲染 `<ol>` 而不是 `<ul>` |
| `divided` | `boolean` | `true` | 行间分隔线 |
| `stagger` | `boolean` | `false` | 错峰入场，默认关闭 |

## 错峰怎么实现

不数节点、不注入 index，纯 CSS 阶梯：

```css
.root[data-stagger] > * { animation: rise var(--mochi-duration-slow) var(--mochi-spring) both; }
.root[data-stagger] > *:nth-child(2) { animation-delay: var(--mochi-stagger); }
.root[data-stagger] > *:nth-child(3) { animation-delay: calc(var(--mochi-stagger) * 2); }
/* …前 7 项逐级递增，之后统一延迟最大值，长列表不会等到天荒地老 */
```

`both` 让每一项在延迟期间保持起始状态（透明），否则会先闪现再动。
`prefers-reduced-motion` 下整个动画关掉。

## 为什么默认关闭

入场动画适合"刚出现的通知/结果列表"，不适合静态内容列表——每次进页面都重播一遍很吵。
所以 `stagger` 是 opt-in 的。
