<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, useId, watch } from 'vue'
import type { MochiPopoverPlacement } from './types'
import css from './MochiPopover.module.css'
import { useMessages } from '../../locale'

defineOptions({ name: 'MochiPopover' })

const m = useMessages()

const props = withDefaults(
  defineProps<{
    placement?: MochiPopoverPlacement
    width?: string
    /** 面板语义：普通浮层是 dialog，下拉菜单要设成 menu */
    panelRole?: 'dialog' | 'menu'
    /** 去掉面板自带的边框/内边距，交给内容自己画（例如内嵌日历） */
    bare?: boolean
  }>(),
  { placement: 'bottom', width: '240px', panelRole: 'dialog', bare: false },
)

const open = defineModel<boolean>('open', { default: false })

const uid = useId()
/** 交给触发槽的 ARIA 属性；用 as const 保住 'dialog' 的字面量类型 */
const triggerAttrs = computed(
  () =>
    ({
      'aria-expanded': open.value,
      'aria-haspopup': 'dialog',
      'aria-controls': uid,
    }) as const,
)
const root = ref<HTMLElement>()
const trigger = ref<HTMLElement>()
const panel = ref<HTMLElement>()
/** 实际方向：下方放不下时翻到上方 */
const actual = ref<MochiPopoverPlacement>(props.placement)

function show() {
  actual.value = props.placement
  open.value = true
  nextTick(() => {
    if (!trigger.value || !panel.value) return
    if (props.placement !== 'bottom' && props.placement !== 'top') return
    const rect = trigger.value.getBoundingClientRect()
    const needed = panel.value.offsetHeight + 12
    if (props.placement === 'bottom' && rect.bottom + needed > window.innerHeight) {
      actual.value = 'top'
    }
  })
}

function toggle() {
  if (open.value) open.value = false
  else show()
}

function close() {
  open.value = false
}

function onPointerDown(event: PointerEvent) {
  if (open.value && root.value && !root.value.contains(event.target as Node)) close()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') close()
}

watch(open, (isOpen) => {
  if (isOpen) {
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeydown)
  } else {
    document.removeEventListener('pointerdown', onPointerDown)
    document.removeEventListener('keydown', onKeydown)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onPointerDown)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <span ref="root" :class="css.root">
    <span ref="trigger" :class="css.trigger" @click="toggle">
      <slot name="trigger" :open="open" :attrs="triggerAttrs" />
    </span>

    <Transition :enter-active-class="css.enter" :leave-active-class="css.leave">
      <div
        v-if="open"
        :id="uid"
        ref="panel"
        :class="[css.panel, css[actual]]"
        :style="{ width }"
        :data-bare="bare || undefined"
        :role="panelRole"
        :aria-label="panelRole === 'menu' ? m.menu : undefined"
      >
        <slot :close="close" />
      </div>
    </Transition>
  </span>
</template>
