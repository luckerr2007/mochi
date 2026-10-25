<script setup lang="ts">
import { computed } from 'vue'
import type { MochiProgressTone } from './types'
import css from './MochiProgress.module.css'
import { useMessages } from '../../locale'

defineOptions({ name: 'MochiProgress' })

const m = useMessages()

const props = withDefaults(
  defineProps<{
    value?: number
    max?: number
    /** 无障碍名称，进度条必须有 */
    label?: string
    tone?: MochiProgressTone
    showValue?: boolean
  }>(),
  { value: 0, max: 100, tone: 'primary', showValue: false },
)

// 越界值夹在 0-100%，避免脏数据把条子撑出轨道
const percent = computed(() => {
  const max = props.max > 0 ? props.max : 100
  return Math.min(100, Math.max(0, (props.value / max) * 100))
})
</script>

<template>
  <div :class="css.root">
    <div v-if="showValue" :class="css.head">
      <span>{{ label }}</span>
      <span>{{ Math.round(percent) }}%</span>
    </div>

    <div
      :class="css.track"
      role="progressbar"
      :aria-valuenow="value"
      aria-valuemin="0"
      :aria-valuemax="max"
      :aria-label="label ?? m.progressLabel"
    >
      <div :class="css.bar" :data-tone="tone" :style="{ width: `${percent}%` }" />
    </div>
  </div>
</template>
