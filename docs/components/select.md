# MochiSelect

选择器。自绘弹层，视觉与其余组件一致。

## 示例

<div class="demo demo-col" style="width: 100%; max-width: 320px">
  <MochiSelect v-model="fruit" label="今天想吃什么" hint="广场水果摊每日更新" placeholder="请选择" :options="options" />
</div>

<p>已选：<code>{{ fruit || '未选择' }}</code></p>

```vue
<script setup>
import { ref } from 'vue';
const fruit = ref('');
const options = [
  { label: '苹果', value: 'apple' },
  { label: '橘子', value: 'orange' },
];
</script>

<template>
  <MochiSelect v-model="fruit" label="今天想吃什么" placeholder="请选择" :options="options" />
</template>
```

<script setup>
import { ref } from 'vue';
const fruit = ref('');
const options = [
  { label: '苹果', value: 'apple' },
  { label: '橘子', value: 'orange' },
  { label: '梨', value: 'pear' },
  { label: '船梨（缺货）', value: 'ship-pear', disabled: true },
];
</script>

## Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `options` | `{ label, value, disabled? }[]` | — | 必填 |
| `label` | `string` | — | 自动关联 `for` |
| `hint` | `string` | — | 同时作为 `aria-describedby` |
| `placeholder` | `string` | `'请选择'` | 未选中时的文案 |
| `disabled` / `invalid` | `boolean` | `false` | — |

## 键盘

| 按键 | 行为 |
| --- | --- |
| `↑` `↓` | 打开（关闭时）/ 移动高亮项（打开时），跳过禁用项 |
| `Home` `End` | 跳到首项 / 末项 |
| `Enter` `Space` | 打开 / 选中高亮项 |
| `Esc` | 关闭并把焦点还给触发器 |

## 无障碍

触发器是 `role="combobox"`，带 `aria-expanded` 与 `aria-controls`；弹层是 `role="listbox"`，
选项是 `role="option"` + `aria-selected` + `aria-disabled`。点击组件外部会自动关闭。

## 与原生 select 的取舍

第一版用的是原生 `<select>`：键盘与读屏全免费，但选项列表由系统绘制，颜色、圆角、
间距全都不受控制——在一块暖米白的界面里弹出一张系统菜单，风格断裂。

现在改成自绘 listbox，把 ARIA 语义和键盘行为手写补齐。**代价是**：浏览器原生的
首字母跳转（type-ahead）没有实现，选项很多时只能靠方向键或滚动。需要时再加。

弹层位置：默认向下，下方空间不足时向上翻，用选项数量估算高度而不是固定阈值——
固定阈值会让三个选项的小列表也误判翻上去。

