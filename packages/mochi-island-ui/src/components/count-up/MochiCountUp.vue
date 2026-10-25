<script setup lang="ts">
import { computed } from 'vue'
import { formatNumber, useCountUp } from '../../composables/useCountUp'
import css from './MochiCountUp.module.css'

defineOptions({ name: 'MochiCountUp' })

const props = withDefaults(
  defineProps<{
    value: number
    duration?: number
    precision?: number
    prefix?: string
    suffix?: string
  }>(),
  { duration: 700, precision: 0 },
)

const display = useCountUp(() => props.value, props.duration)
const text = computed(() => formatNumber(display.value, props.precision))
</script>

<template>
  <span :class="css.root">
    <span v-if="prefix" :class="css.affix">{{ prefix }}</span>
    <span :class="css.number">{{ text }}</span>
    <span v-if="suffix" :class="css.affix">{{ suffix }}</span>
  </span>
</template>
