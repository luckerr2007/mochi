# MochiQRCode

二维码。SVG 渲染、内容变化时弹簧重绘，中文自动按 UTF-8 编码。

## 示例

<div class="demo demo-col" style="width: 100%; max-width: 320px">
  <MochiQRCode :value="qrText" :size="152" />
  <MochiInput v-model="qrText" label="二维码内容" hint="改一下内容，看它重绘" />
</div>

```vue
<script setup>
import { ref } from 'vue';
const qrText = ref('https://mochi.dev');
</script>

<template>
  <MochiQRCode :value="qrText" :size="152" />
</template>
```

<script setup>
import { ref } from 'vue';
const qrText = ref('https://mochi.dev');
</script>

## Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `value` | `string` | — | 必填，编码内容 |
| `size` | `number` | `160` | 边长（px） |
| `level` | `'L' \| 'M' \| 'Q' \| 'H'` | `'M'` | 纠错级别，越高越抗遮挡、容量越小 |
| `margin` | `number` | `2` | 四周静区（模块数），扫码器需要 |
| `label` | `string` | 内容本身 | 读屏朗读的描述 |

## 实现取舍

- **编码器用 [qrcode-generator](https://www.npmjs.com/package/qrcode-generator)**，
  不手搓 Reed-Solomon 编码与掩码评分——二维码错的不是"看起来不对"，是"扫不出来"，
  只有经过大规模验证的实现才敢交付。它是组件级依赖，只有引入 MochiQRCode 的项目才打包它。
- 版本号传 0（自动选最小可容纳版本）；内容超出容量时渲染占位文案而不是崩溃。
- 默认编码按 latin-1 截断会把中文变乱码，这里换成平台自带的 `TextEncoder`（UTF-8）。
- 模块是一整条 `<path>` + `shape-rendering: crispEdges`，不做逐格动画——
  二维码是拿来扫的，入场整体弹簧缩放一次就够。

## 无障碍

根节点是 `role="img"`，默认朗读内容本身；内容是链接时可传 `label` 换成人话。
