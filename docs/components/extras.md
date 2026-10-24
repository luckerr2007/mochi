# 补充件 · 第二弹

五个小件：头像组、标签输入、环形进度、兑换码与倒计时——都是「少一个会让页面凑不起来」的角色。

## MochiAvatarGroup

头像组。叠放展示成员，悬停时头像被"拎起来"看一眼；超出的折叠成 +N。

<div class="demo demo-col">
  <MochiAvatarGroup :items="crew" />
  <MochiAvatarGroup :items="crew" size="sm" :max="3" />
</div>

```vue
<script setup>
import { ref } from 'vue';
const crew = ref([
  { name: '娜娜' },
  { name: '波波' },
  { name: '莉莉', src: '/nana.png' },
]);
</script>

<template>
  <MochiAvatarGroup :items="crew" :max="4" size="md" />
</template>
```

<script setup>
import { ref } from 'vue';
const crew = [
  { name: '娜娜' },
  { name: '波波' },
  { name: '莉莉' },
  { name: '阿保' },
  { name: '古信' },
];
const tags = ref(['家具', '衣服', '贝壳']);
const ring = ref(72);
const code = ref('');
const party = ref(Date.now() + 1000 * 60 * 90);
</script>

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `items` | `{ name, src? }[]` | — | 必填 |
| `max` | `number` | `4` | 最多展示几个，超出折叠为 +N |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 与 MochiAvatar 同档 |
| `label` | `string` | `'成员'` | 读屏朗读的群体名称 |

## MochiTagInput

标签输入。Enter 或分隔符添加，退格删除末尾，到上限后输入框让位给提示文案。

<div class="demo demo-col" style="width: 100%; max-width: 360px">
  <MochiTagInput v-model="tags" label="兴趣标签" hint="回车或逗号添加，最多 5 个" :max="5" />
  <p style="margin: 0">当前：<code>{{ tags.join('、') || '（无）' }}</code></p>
</div>

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `v-model` | `string[]` | `[]` | 标签集合 |
| `max` | `number` | `8` | 上限，超出后不再添加 |
| `delimiters` | `string[]` | `[',', '，', ' ']` | 触发添加的分隔符（回车始终可用） |
| `label` / `hint` / `placeholder` | `string` | — | 同 Input |
| `disabled` / `invalid` | `boolean` | `false` | — |

事件：`add(tag)` / `remove(tag)`。重复标签静默忽略。

## MochiProgressRing

环形进度。数值变化时沿圆弧平滑推进，圆心显示百分比。

<div class="demo">
  <MochiProgressRing v-model="ring" :size="88" label="今日活力" />
  <MochiProgressRing :value="40" tone="accent" :size="88" label="浇水" />
  <MochiProgressRing :value="88" tone="candy" :size="88" label="成就" />
</div>

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `value` | `number` | — | 必填，0-100（超出夹在边界） |
| `size` / `thickness` | `number` | `96` / `10` | 外径与描边厚度（px） |
| `tone` | `'primary' \| 'accent' \| 'candy' \| 'danger'` | `'primary'` | 进度弧颜色 |
| `showValue` | `boolean` | `true` | 圆心显示百分比 |
| `label` | `string` | `'进度'` | 进度条语义的朗读名 |

## MochiCodeInput

兑换码输入。N 个单格，输一位自动前进，粘贴从当前位置铺开，填满抛 `complete`。

<div class="demo demo-col">
  <MochiCodeInput v-model="code" :length="6" label="兑换码" hint="填满自动核销" @complete="() => {}" />
  <p style="margin: 0">已输入：<code>{{ code || '（空）' }}</code></p>
</div>

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `v-model` | `string` | `''` | 已输入的码（统一小写） |
| `length` | `number` | `6` | 位数 |
| `label` / `hint` | `string` | — | 同 Input |
| `disabled` / `invalid` | `boolean` | `false` | — |

键盘：退格在空格上会删前一位，←→ 移动光标。超出容量的粘贴按位置截断。

## MochiCountdown

倒计时。格子像游戏的活力值，每一位数字变化时弹一下，走完全部归零并抛 `finish`。

<div class="demo">
  <MochiCountdown :to="party" label="烟火大会" />
</div>

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `to` | `Date \| number \| string` | — | 必填，目标时刻 |
| `label` | `string` | `'倒计时'` | `role="timer"` 的朗读说明 |

事件：`finish`——归零时抛一次，计时器自动停止。
