<script setup lang="ts">
import type { MochiBadgeTone } from './types'
import css from './MochiBadge.module.css'

defineOptions({ name: 'MochiBadge' })

withDefaults(
  defineProps<{
    value?: string | number
    /** 只显示小圆点，不显示数值 */
    dot?: boolean
    tone?: MochiBadgeTone
  }>(),
  { tone: 'danger' },
)
</script>

<template>
  <span :class="css.root">
    <!-- 用 display:contents 包一层，只为给 :has() 一个可以定位的落点，不参与布局 -->
    <span :class="css.content"><slot /></span>
    <span v-if="dot" :class="css.dot" :data-tone="tone" aria-hidden="true" />
    <span
      v-else-if="value !== undefined && value !== ''"
      :key="String(value)"
      :class="css.pill"
      :data-tone="tone"
    >
      {{ value }}
    </span>
  </span>
</template>
