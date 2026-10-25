# MochiIcon

第三方图标适配器：接 [lucide-vue-next](https://lucide.dev) 等任意"一个图标一个组件"的图标库，统一尺寸令牌与卡通风描边。**本项目规范：不使用 emoji 做图标。**

按图标名从图标库具名导入再传入（tree-shaking 友好，用到的图标才会进产物）：

<IconDemo />

```vue
<script setup lang="ts">
import { MochiIcon } from 'mochi-island-ui';
import { Sparkles, Rocket, Heart } from 'lucide-vue-next';
</script>

<template>
  <MochiIcon :icon="Sparkles" />
  <MochiIcon :icon="Rocket" size="lg" />
  <MochiIcon :icon="Heart" size="sm" />
</template>
```

## 尺寸与描边

- `size`：`sm`=16 / `md`=20（默认）/ `lg`=24，或直接传像素数。
- `strokeWidth`：默认 2.2（比 lucide 默认 2 略粗，贴合卡通风）。
- 颜色继承 `currentColor`，跟随文字色。

## 无障碍

默认视为装饰性图标（`aria-hidden`）。传达信息的图标传 `label`，自动切换为 `role="img"` + `aria-label`（见上方演示第 4 枚"地点"图标）。
