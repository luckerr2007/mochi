# MochiMentions

提及输入框。输入触发字符（默认 `@`）唤起候选列表，选中后拼回正文。

## 示例

<div class="demo demo-col" style="width: 100%; max-width: 360px">
  <MochiMentions v-model="message" :options="villagers" label="留言" hint="输入 @ 唤起村民" />
  <p style="margin: 0">内容：<code>{{ message || '（空）' }}</code></p>
</div>

```vue
<script setup>
import { ref } from 'vue';
const message = ref('');
const villagers = ['娜娜', '波波', '莉莉', '阿保'];
</script>

<template>
  <MochiMentions v-model="message" :options="villagers" label="留言" />
</template>
```

<script setup>
import { ref } from 'vue';
const message = ref('');
const villagers = ['娜娜', '波波', '莉莉', '阿保', '古信', '玲玲'];
</script>

## Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `options` | `string[]` | — | 必填，可提及的对象 |
| `v-model` | `string` | `''` | 整段文本（含提及部分） |
| `prefix` | `string` | `'@'` | 触发字符 |
| `label` / `hint` | `string` | — | 同 Input |
| `placeholder` | `string` | `` `输入 @ 唤起提及` `` | 随 `prefix` 变化 |
| `disabled` / `invalid` | `boolean` | `false` | — |
| `limit` | `number` | `8` | 最多展示几条建议 |

## 事件

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| `select` | `string` | 选中（点击或回车）的候选项 |

## 匹配规则

- 从光标向前找**最近**的触发字符；触发字符到光标之间出现空白即断开匹配
  （`@娜 哈喽` 不会持续弹层）。
- 选中后替换「触发字符 + 查询串」为 `prefix + 候选 + 空格`，光标落在空格之后，方便接着打字。

## 键盘

| 按键 | 行为 |
| --- | --- |
| `↑` `↓` | 移动高亮项 |
| `Enter` | 选中高亮项 |
| `Esc` | 收起建议区 |

## 已知限制

只有单行输入。多行 textarea 的提及需要把光标坐标换算成弹层位置
（镜像测量法），复杂度高一个量级，等有真实场景再上。
