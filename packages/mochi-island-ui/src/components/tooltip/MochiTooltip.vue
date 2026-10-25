<script setup lang="ts">
import { onBeforeUnmount, ref, useId } from 'vue'
import type { MochiTooltipPlacement } from './types'
import css from './MochiTooltip.module.css'

defineOptions({ name: 'MochiTooltip' })

const props = withDefaults(
  defineProps<{
    content: string
    placement?: MochiTooltipPlacement
    /** 移入后延迟多少毫秒出现，避免划过时闪一片 */
    delay?: number
  }>(),
  { placement: 'top', delay: 300 },
)

const uid = useId()
const visible = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

function show() {
  clearTimeout(timer)
  timer = setTimeout(() => {
    visible.value = true
  }, props.delay)
}

function hide() {
  clearTimeout(timer)
  visible.value = false
}

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <span
    :class="css.root"
    :aria-describedby="visible ? uid : undefined"
    @pointerenter="show"
    @pointerleave="hide"
    @focusin="show"
    @focusout="hide"
  >
    <slot />
    <Transition :enter-active-class="css.enter" :leave-active-class="css.leave">
      <span v-if="visible" :id="uid" :class="css.bubble" :data-placement="placement" role="tooltip">
        {{ content }}
      </span>
    </Transition>
  </span>
</template>
