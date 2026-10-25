<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import css from './MochiBackTop.module.css'
import { useMessages } from '../../locale'

defineOptions({ name: 'MochiBackTop' })

const m = useMessages()

const props = withDefaults(defineProps<{ threshold?: number; label?: string }>(), {
  threshold: 320,
})

const visible = ref(false)

function onScroll() {
  visible.value = window.scrollY > props.threshold
}

function toTop() {
  const reduced =
    typeof globalThis.matchMedia === 'function' &&
    globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <Teleport to="body">
    <Transition :enter-active-class="css.in" :leave-active-class="css.out">
      <button
        v-if="visible"
        :class="css.root"
        type="button"
        :aria-label="label ?? m.backTopLabel"
        @click="toTop"
      >
        <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 7 L6 3.5 L9.5 7" /></svg>
      </button>
    </Transition>
  </Teleport>
</template>
