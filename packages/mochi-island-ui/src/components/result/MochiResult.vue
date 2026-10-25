<script setup lang="ts">
import { computed } from 'vue'
import type { MochiResultTone } from './types'
import css from './MochiResult.module.css'

defineOptions({ name: 'MochiResult' })

const props = withDefaults(
  defineProps<{ tone?: MochiResultTone; title: string; description?: string }>(),
  { tone: 'info' },
)

const marks: Record<MochiResultTone, string> = {
  success: 'M7 12.5 L10.5 16 L17 8.5',
  info: 'M12 11 V16.5 M12 7.5 V8',
  warning: 'M12 7.5 V14 M12 16.5 V17',
  danger: 'M8.5 8.5 L15.5 15.5 M15.5 8.5 L8.5 15.5',
}

const mark = computed(() => marks[props.tone])
</script>

<template>
  <div :class="css.root" :data-tone="tone" role="status">
    <span :class="css.badge">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle :class="css.ring" cx="12" cy="12" r="10" />
        <path :class="css.mark" :d="mark" />
      </svg>
    </span>

    <h3 :class="css.title">{{ title }}</h3>
    <p v-if="description" :class="css.desc">{{ description }}</p>

    <div v-if="$slots.default" :class="css.extra"><slot /></div>
    <div v-if="$slots.actions" :class="css.actions"><slot name="actions" /></div>
  </div>
</template>
