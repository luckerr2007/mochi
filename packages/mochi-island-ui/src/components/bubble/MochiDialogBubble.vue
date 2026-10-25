<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { MochiDialogBubblePlacement } from './types'
// 结构类名来自 CSS Modules，视觉值全部走 var(--mochi-*)
import css from './MochiDialogBubble.module.css'

defineOptions({ name: 'MochiDialogBubble' })

const props = withDefaults(
  defineProps<{
    /** 打字机效果的文字源；带默认插槽时插槽优先，打字机不生效 */
    text?: string
    /** 尾巴朝向：left = 说话人在左侧 */
    placement?: MochiDialogBubblePlacement
    typewriter?: boolean
    /** 每个字符的间隔（毫秒） */
    speed?: number
  }>(),
  { placement: 'left', typewriter: false, speed: 30 },
)

const emit = defineEmits<{ done: [] }>()

// 开启打字机时初值为空，避免首帧闪出全文
const shown = ref(props.typewriter ? '' : (props.text ?? ''))
const typing = ref(false)
let timer: ReturnType<typeof setInterval> | undefined

function stopTyping() {
  if (timer !== undefined) {
    clearInterval(timer)
    timer = undefined
  }
  typing.value = false
}

function prefersReducedMotion() {
  return (
    typeof globalThis.matchMedia === 'function' &&
    globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function play() {
  stopTyping()
  const full = props.text ?? ''

  // 降低动态 / 无文字 / 未开启：一次性给出全文，动画不是必读信息
  if (!props.typewriter || !full || prefersReducedMotion()) {
    shown.value = full
    emit('done')
    return
  }

  shown.value = ''
  typing.value = true
  let cursor = 0

  timer = setInterval(
    () => {
      cursor += 1
      shown.value = full.slice(0, cursor)
      if (cursor >= full.length) {
        stopTyping()
        emit('done')
      }
    },
    Math.max(8, props.speed),
  )
}

// 挂载后再播，避免在 setup 阶段触发 done 事件
onMounted(play)
watch(() => [props.text, props.typewriter, props.speed], play)
onBeforeUnmount(stopTyping)
</script>

<template>
  <div :class="css.root" :data-placement="placement">
    <div :class="css.body">
      <template v-if="typewriter && text">
        <!-- 逐字显示的副本对读屏隐藏，整段文字由下方 live region 一次播报 -->
        <span :class="css.text" aria-hidden="true"
          >{{ shown }}<span v-if="typing" :class="css.caret"
        /></span>
        <span :class="css.srOnly" aria-live="polite">{{ text }}</span>
      </template>
      <span v-else :class="css.text"
        ><slot>{{ text }}</slot></span
      >
    </div>

    <!-- 手绘尾巴：fill 盖住气泡描边做出接缝，stroke 只描外轮廓 -->
    <svg :class="css.tail" viewBox="0 0 26 28" aria-hidden="true" focusable="false">
      <path :class="css.tailFill" d="M25 8 C16 6 8 12 3 22 C8 26 16 24 25 20 Z" />
      <path :class="css.tailStroke" d="M25 8 C16 6 8 12 3 22 C8 26 16 24 25 20" />
    </svg>
  </div>
</template>
