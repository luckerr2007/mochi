<script setup lang="ts">
import css from './MochiGrid.module.css'

/**
 * 栅格子项：span 默认整行；sm/md/lg 是从对应断点起生效的覆盖
 * （≥640/≥768/≥1024），不传则沿用更小档的值。
 */
defineOptions({ name: 'MochiGridItem' })

withDefaults(
  defineProps<{
    span?: number
    sm?: number
    md?: number
    lg?: number
  }>(),
  { span: 12 },
)
</script>

<template>
  <div
    :class="css.item"
    :data-sm="sm ?? undefined"
    :data-md="md ?? undefined"
    :data-lg="lg ?? undefined"
    :style="{ '--span': span, '--sm': sm, '--md': md, '--lg': lg }"
  >
    <slot />
  </div>
</template>
