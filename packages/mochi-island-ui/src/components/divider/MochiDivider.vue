<script setup lang="ts">
import css from './MochiDivider.module.css'

defineOptions({ name: 'MochiDivider' })

withDefaults(defineProps<{ vertical?: boolean; label?: string }>(), { vertical: false })
</script>

<template>
  <div
    :class="css.root"
    :data-vertical="vertical || undefined"
    role="separator"
    :aria-orientation="vertical ? 'vertical' : 'horizontal'"
  >
    <span v-if="label && !vertical" :class="css.label">{{ label }}</span>
  </div>
</template>
