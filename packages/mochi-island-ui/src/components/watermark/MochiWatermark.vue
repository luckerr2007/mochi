<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import css from './MochiWatermark.module.css'

defineOptions({ name: 'MochiWatermark' })

const props = withDefaults(
  defineProps<{
    content: string
    opacity?: number
    fontSize?: number
    rotate?: number
    /** 瓦片间距（px） */
    gap?: number
    color?: string
  }>(),
  { opacity: 0.08, fontSize: 14, rotate: -22, gap: 160, color: 'var(--mochi-ink)' },
)

const tile = ref('')

function resolveColor(): string {
  if (!props.color.startsWith('var(')) return props.color
  const name = props.color.slice(4, -1).trim()
  return (
    getComputedStyle(document.documentElement).getPropertyValue(name).trim() || 'rgba(0,0,0,0.6)'
  )
}

function render() {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  if (!context) return

  const padding = Math.round(props.fontSize * 0.6)
  context.font = `bold ${props.fontSize}px sans-serif`
  const metrics = context.measureText(props.content)
  const width = Math.ceil(metrics.width + padding * 2)
  const height = Math.ceil(props.fontSize + padding * 2)

  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')!
  ctx.translate(width / 2, height / 2)
  ctx.rotate((props.rotate * Math.PI) / 180)
  ctx.globalAlpha = props.opacity
  ctx.fillStyle = resolveColor()
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = `bold ${props.fontSize}px sans-serif`
  ctx.fillText(props.content, 0, 0)

  tile.value = canvas.toDataURL()
}

onMounted(() => {
  render()
  // 字体加载完成后再画一次，避免量宽不准
  document.fonts?.ready.then(render).catch(() => {})
})

watch(
  () => [props.content, props.opacity, props.fontSize, props.rotate, props.gap, props.color],
  () => render(),
)

const style = computed(() => ({
  backgroundImage: tile.value ? `url(${tile.value})` : undefined,
  backgroundSize: `${props.gap}px ${props.gap}px`,
}))
</script>

<template>
  <div :class="css.root">
    <slot />
    <span :class="css.layer" :style="style" aria-hidden="true" />
  </div>
</template>
