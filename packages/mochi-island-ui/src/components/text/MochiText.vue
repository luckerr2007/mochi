<script setup lang="ts">
import type { MochiTextSize, MochiTextTone } from './types'
import css from './MochiText.module.css'

defineOptions({ name: 'MochiText' })

withDefaults(
  defineProps<{
    /** 渲染成什么标签：p / span / strong / small… */
    as?: string
    size?: MochiTextSize
    tone?: MochiTextTone
    bold?: boolean
  }>(),
  { as: 'span', size: 'base', tone: 'default' },
)
</script>

<template>
  <component
    :is="as"
    :class="css.root"
    :data-size="size"
    :data-tone="tone"
    :data-bold="bold || undefined"
  >
    <slot />
  </component>
</template>
