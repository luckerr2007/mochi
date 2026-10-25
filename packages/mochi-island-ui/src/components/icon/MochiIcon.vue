<script setup lang="ts">
import { computed, type Component } from 'vue'
import css from './MochiIcon.module.css'

/**
 * 第三方图标适配器：接 lucide-vue-next 等任意"单组件一个图标"的图标库，
 * 统一尺寸令牌与卡通风描边。按图标名从图标库具名导入再传入（tree-shaking
 * 友好，不引入整包）：
 *
 *   import { Sparkles } from 'lucide-vue-next';
 *   <MochiIcon :icon="Sparkles" />
 */
defineOptions({ name: 'MochiIcon' })

const props = withDefaults(
  defineProps<{
    /** 图标组件（如 lucide-vue-next 的具名导出） */
    icon: Component
    /** 尺寸令牌：sm=16 md=20 lg=24，或直接给像素数 */
    size?: 'sm' | 'md' | 'lg' | number
    /** 描边宽度，卡通风默认加粗到 2.2 */
    strokeWidth?: number
    /** 装饰性图标标 aria-hidden（默认 true）；传达信息的图标给可读名称 */
    label?: string
  }>(),
  { size: 'md', strokeWidth: 2.2 },
)

const sizePx = computed(() =>
  typeof props.size === 'number' ? props.size : { sm: 16, md: 20, lg: 24 }[props.size],
)
</script>

<template>
  <component
    :is="icon"
    :class="css.root"
    :size="sizePx"
    :stroke-width="strokeWidth"
    :aria-hidden="label ? undefined : true"
    :aria-label="label || undefined"
    :role="label ? 'img' : undefined"
  />
</template>
