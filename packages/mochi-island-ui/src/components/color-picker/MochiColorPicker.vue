<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import MochiPopover from '../popover/MochiPopover.vue'
import { clamp, hexToHsv, hsvToHex, normalizeHex } from './color'
import css from './MochiColorPicker.module.css'
import { useMessages } from '../../locale'

defineOptions({ name: 'MochiColorPicker' })

const m = useMessages()

withDefaults(
  defineProps<{
    label?: string
    disabled?: boolean
    /** 预设色板；不传时用 Mochi 令牌的八个色 */
    swatches?: string[]
  }>(),
  {
    swatches: () => [
      '#f0875c',
      '#c2603c',
      '#bf4a46',
      '#ff9fb8',
      '#7fc8c0',
      '#d3bda2',
      '#7a6455',
      '#3d2f28',
    ],
  },
)

/** `#rrggbb`，小写 */
const model = defineModel<string>({ default: '#f0875c' })

const open = ref(false)
const hsv = reactive({ h: 24, s: 84, v: 94 })
const hexInput = ref(model.value)
const svEl = ref<HTMLDivElement>()
const dragging = ref(false)

watch(
  model,
  (hex) => {
    const parsed = hexToHsv(hex)
    // 拖拽中不回读，否则指针还没松手状态就被外部值拽走
    if (parsed && !dragging.value) Object.assign(hsv, parsed)
    hexInput.value = hex
  },
  { immediate: true },
)

function commit() {
  model.value = hsvToHex(hsv)
}

/* ---------- 取色面板：按住拖动，指针捕获保证移出面板也不丢 ---------- */
function applyPoint(event: PointerEvent) {
  const rect = svEl.value?.getBoundingClientRect()
  if (!rect) return
  hsv.s = clamp(Math.round(((event.clientX - rect.left) / rect.width) * 100), 0, 100)
  hsv.v = clamp(Math.round((1 - (event.clientY - rect.top) / rect.height) * 100), 0, 100)
  commit()
}

function onSvDown(event: PointerEvent) {
  dragging.value = true
  svEl.value?.setPointerCapture(event.pointerId)
  applyPoint(event)
}

function onSvMove(event: PointerEvent) {
  if (dragging.value) applyPoint(event)
}

function onSvUp(event: PointerEvent) {
  dragging.value = false
  svEl.value?.releasePointerCapture(event.pointerId)
}

/** 面板可聚焦，方向键微调饱和度/明度，键盘用户不必依赖指针 */
function onSvKeydown(event: KeyboardEvent) {
  const step =
    event.key === 'ArrowLeft'
      ? [-4, 0]
      : event.key === 'ArrowRight'
        ? [4, 0]
        : event.key === 'ArrowUp'
          ? [0, 4]
          : event.key === 'ArrowDown'
            ? [0, -4]
            : null
  if (!step) return
  event.preventDefault()
  hsv.s = clamp(hsv.s + step[0]!, 0, 100)
  hsv.v = clamp(hsv.v + step[1]!, 0, 100)
  commit()
}

function setHue(event: Event) {
  hsv.h = Number((event.target as HTMLInputElement).value)
  commit()
}

/** HEX 输入：合法即时生效并原样回传（不从四舍五入的 HSV 反推，避免 7fc8c0 → 7dc7be 这类漂移），非法等失焦再回读当前值 */
function onHexInput(event: Event) {
  const value = (event.target as HTMLInputElement).value
  hexInput.value = value
  const normalized = normalizeHex(value)
  if (normalized) {
    const parsed = hexToHsv(normalized)
    if (parsed) Object.assign(hsv, parsed)
    model.value = normalized
  }
}

function onHexBlur() {
  hexInput.value = model.value
}

function pickSwatch(hex: string) {
  const parsed = hexToHsv(hex)
  if (parsed) Object.assign(hsv, parsed)
  model.value = hex.toLowerCase()
}
</script>

<template>
  <span :class="css.root">
    <MochiPopover v-model:open="open" width="240px" bare>
      <template #trigger="{ attrs }">
        <button
          :class="css.trigger"
          type="button"
          :aria-label="label"
          :disabled="disabled"
          v-bind="attrs"
        >
          <span :class="css.swatch" :style="{ background: model }" aria-hidden="true" />
          <span :class="css.text">{{ model }}</span>
          <svg :class="css.chevron" :data-open="open" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M2 4.5 L6 8.5 L10 4.5" />
          </svg>
        </button>
      </template>

      <div :class="css.panel">
        <!-- 饱和度（横轴）× 明度（纵轴）面板：两层渐变叠在当前色相上。
             二维自由拖拽塞不进 slider 的单轴语义，故不用 role，读屏走两根真轴（色相条/HEX） -->
        <div
          ref="svEl"
          :class="css.sv"
          :style="{ '--_hue': `${hsv.h}deg` }"
          tabindex="0"
          :aria-label="m.svPanel(model)"
          @pointerdown="onSvDown"
          @pointermove="onSvMove"
          @pointerup="onSvUp"
          @pointercancel="onSvUp"
          @keydown="onSvKeydown"
        >
          <span
            :class="css.thumb"
            :style="{ left: `${hsv.s}%`, top: `${100 - hsv.v}%` }"
            aria-hidden="true"
          />
        </div>

        <input
          :class="css.hue"
          type="range"
          min="0"
          max="360"
          :value="hsv.h"
          :aria-label="m.hueSlider"
          @input="setHue"
        />

        <div :class="css.row">
          <input
            :class="css.hex"
            type="text"
            :value="hexInput"
            :aria-label="label || '颜色值'"
            spellcheck="false"
            maxlength="7"
            @input="onHexInput"
            @blur="onHexBlur"
            @keydown.enter="($event.target as HTMLInputElement).blur()"
          />
          <span :class="css.preview" :style="{ background: model }" aria-hidden="true" />
        </div>

        <div :class="css.swatches" role="listbox" :aria-label="m.swatchesLabel">
          <button
            v-for="hex in swatches"
            :key="hex"
            :class="css.dot"
            type="button"
            role="option"
            :aria-selected="hex.toLowerCase() === model"
            :style="{ background: hex }"
            :aria-label="hex"
            @click="pickSwatch(hex)"
          />
        </div>
      </div>
    </MochiPopover>
  </span>
</template>
