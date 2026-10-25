<script setup lang="ts">
import type { MochiButtonSize, MochiButtonVariant } from './types'
// CSS Modules 只负责结构类名，所有视觉值都来自 var(--mochi-*)；见同名 .module.css
import css from './MochiButton.module.css'

defineOptions({ name: 'MochiButton' })

withDefaults(
  defineProps<{
    variant?: MochiButtonVariant
    size?: MochiButtonSize
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
  }>(),
  { variant: 'primary', size: 'md', disabled: false, type: 'button' },
)
</script>

<template>
  <button
    :class="css.root"
    :data-variant="variant"
    :data-size="size"
    :type="type"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>
