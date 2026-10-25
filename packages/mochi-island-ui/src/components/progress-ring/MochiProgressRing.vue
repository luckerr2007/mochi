<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import css from './MochiProgressRing.module.css'
import { useMessages } from '../../locale'

defineOptions({ name: 'MochiProgressRing' })

const m = useMessages()

const props = withDefaults(
  defineProps<{
    /** 直接传值用法（与 v-model 二选一；v-model 优先） */
    value?: number
    /** 外径（px） */
    size?: number
    /** 描边厚度（px） */
    thickness?: number
    tone?: 'primary' | 'accent' | 'candy' | 'danger'
    /** 读屏朗读的名称 */
    label?: string
    /** 是否在圆心显示百分比 */
    showValue?: boolean
  }>(),
  { value: undefined, size: 96, thickness: 10, tone: 'primary', showValue: true },
)

/** 0-100，超出夹在边界。支持 v-model 也支持只传 value */
const model = defineModel<number>({ default: 0 })

const clamped = computed(() => {
  const raw = model.value || props.value || 0
  return Math.min(100, Math.max(0, Number(raw) || 0))
})
const radius = computed(() => (props.size - props.thickness) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
/** 入场从空弧扫到目标值：挂载后下一帧才放开 offset，让 transition 接管 */
const drawn = ref(false)
onMounted(() => {
  requestAnimationFrame(() => {
    drawn.value = true
  })
})
const offset = computed(() => {
  const target = circumference.value * (1 - clamped.value / 100)
  return drawn.value ? target : circumference.value
})
</script>

<template>
  <div
    :class="css.root"
    :data-tone="tone"
    role="progressbar"
    :aria-label="label ?? m.progressLabel"
    :aria-valuemin="0"
    :aria-valuemax="100"
    :aria-valuenow="clamped"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <svg
      :class="css.ring"
      :width="size"
      :height="size"
      :viewBox="`0 0 ${size} ${size}`"
      aria-hidden="true"
    >
      <circle
        :class="css.track"
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        :stroke-width="thickness"
        fill="none"
      />
      <circle
        :class="css.bar"
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        :stroke-width="thickness"
        fill="none"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="offset"
      />
    </svg>
    <span v-if="showValue" :class="css.value" aria-hidden="true"
      >{{ Math.round(clamped) }}<i :class="css.unit">%</i></span
    >
  </div>
</template>
