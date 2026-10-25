<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import css from './MochiAffix.module.css'

defineOptions({ name: 'MochiAffix' })

const props = withDefaults(defineProps<{ offsetTop?: number }>(), { offsetTop: 64 })

/** 钉住后用等高占位撑住布局，避免页面内容跳一下 */
const pinned = ref(false)
const height = ref(0)
const body = ref<HTMLElement>()

function measure() {
  height.value = body.value?.offsetHeight ?? 0
}

function onScroll() {
  const el = body.value
  if (!el) return
  // 用占位元素的位置判断：占位出现在视口顶部之上就该钉住了
  const anchorTop = (el.parentElement?.getBoundingClientRect().top ?? 0) + window.scrollY
  pinned.value = window.scrollY + props.offsetTop > anchorTop
}

let observer: ResizeObserver | undefined

onMounted(() => {
  measure()
  observer = new ResizeObserver(measure)
  if (body.value) observer.observe(body.value)
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onBeforeUnmount(() => {
  observer?.disconnect()
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <div :class="css.root">
    <div v-if="pinned" :class="css.spacer" :style="{ height: `${height}px` }" aria-hidden="true" />
    <div
      ref="body"
      :class="css.body"
      :data-pinned="pinned || undefined"
      :style="pinned ? { position: 'fixed', top: `${offsetTop}px` } : undefined"
    >
      <slot />
    </div>
  </div>
</template>
