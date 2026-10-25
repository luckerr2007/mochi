<script setup lang="ts">
import css from './MochiEmpty.module.css'
import { useMessages } from '../../locale'

defineOptions({ name: 'MochiEmpty' })

const m = useMessages()

withDefaults(defineProps<{ description?: string }>(), {})
</script>

<template>
  <div :class="css.root">
    <span :class="css.mark" aria-hidden="true" />
    <p :class="css.text">
      <slot name="description">{{ description ?? m.emptyDescription }}</slot>
    </p>
    <div v-if="$slots.action" :class="css.action"><slot name="action" /></div>
  </div>
</template>
