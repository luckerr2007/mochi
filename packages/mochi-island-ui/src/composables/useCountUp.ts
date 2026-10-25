import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

/**
 * 数字滚动。抽成组合式函数，Statistic 与 CountUp 共用同一份实现。
 * 用 rAF + easeOutCubic：先快后慢，停下时不会突然截断。
 */
export function useCountUp(source: () => number, duration = 700) {
  const display = ref(0)
  let frame = 0

  function run(target: number) {
    cancelAnimationFrame(frame)

    const reduced =
      typeof globalThis.matchMedia === 'function' &&
      globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || typeof requestAnimationFrame === 'undefined') {
      display.value = target
      return
    }

    const from = display.value
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration)
      display.value = from + (target - from) * (1 - (1 - progress) ** 3)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
  }

  onMounted(() => run(source()))
  watch(source, (value) => run(value))
  onBeforeUnmount(() => cancelAnimationFrame(frame))

  return display
}

/** 千分位 + 固定小数位 */
export function formatNumber(value: number, precision = 0) {
  return new Intl.NumberFormat('zh-CN', {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  }).format(value)
}
