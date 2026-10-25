<script setup lang="ts">
import css from './MochiSkeleton.module.css'

defineOptions({ name: 'MochiSkeleton' })

withDefaults(
  defineProps<{
    /** 行数；多于一行时最后一行自动缩短 */
    lines?: number
    width?: string
    height?: string
    rounded?: 'sm' | 'md' | 'full'
  }>(),
  { lines: 1, width: '100%', height: '14px', rounded: 'sm' },
)
</script>

<template>
  <div :class="css.root" aria-hidden="true">
    <span
      v-for="line in lines"
      :key="line"
      :class="css.bar"
      :data-rounded="rounded"
      :style="{ width: line === lines && lines > 1 ? '60%' : width, height }"
    />
  </div>
</template>
