<script setup lang="ts">
import { computed } from 'vue'
import { formatNumber, useCountUp } from '../../composables/useCountUp'
import css from './MochiStatistic.module.css'

defineOptions({ name: 'MochiStatistic' })

const props = withDefaults(
  defineProps<{
    title?: string
    value: number
    precision?: number
    prefix?: string
    suffix?: string
    duration?: number
  }>(),
  { precision: 0, duration: 700 },
)

const display = useCountUp(() => props.value, props.duration)
const formatted = computed(() => formatNumber(display.value, props.precision))
</script>

<template>
  <div :class="css.root">
    <p v-if="title" :class="css.title">{{ title }}</p>
    <p :class="css.value">
      <span v-if="prefix" :class="css.affix">{{ prefix }}</span>
      <span :class="css.number">{{ formatted }}</span>
      <span v-if="suffix" :class="css.affix">{{ suffix }}</span>
    </p>
  </div>
</template>
