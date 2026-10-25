<script setup lang="ts">
import css from './MochiSpinner.module.css'
import { useMessages } from '../../locale'

defineOptions({ name: 'MochiSpinner' })

const m = useMessages()

withDefaults(defineProps<{ size?: number; label?: string }>(), { size: 20 })
</script>

<template>
  <span :class="css.root" role="status" :style="{ '--_size': `${size}px` }">
    <span :class="css.ring" aria-hidden="true" />
    <span :class="css.srOnly">{{ label ?? m.spinnerLabel }}</span>
  </span>
</template>
