<script setup lang="ts">
import { computed, useId } from 'vue'
import FieldShell from '../../internal/FieldShell.vue'
import css from './MochiInputNumber.module.css'
import { useMessages } from '../../locale'

defineOptions({ name: 'MochiInputNumber' })

const m = useMessages()

const props = withDefaults(
  defineProps<{
    label?: string
    hint?: string
    min?: number
    max?: number
    step?: number
    disabled?: boolean
    invalid?: boolean
  }>(),
  { step: 1 },
)

const model = defineModel<number>({ default: 0 })

const fieldId = useId()
const hintId = computed(() => `${fieldId}-hint`)

function clamp(value: number) {
  const min = props.min ?? Number.NEGATIVE_INFINITY
  const max = props.max ?? Number.POSITIVE_INFINITY
  return Math.min(max, Math.max(min, value))
}

function nudge(direction: 1 | -1) {
  if (props.disabled) return
  model.value = clamp(model.value + direction * props.step)
}

function onInput(event: Event) {
  const value = Number((event.target as HTMLInputElement).value)
  if (!Number.isNaN(value)) model.value = clamp(value)
}
</script>

<template>
  <FieldShell :label="label" :hint="hint" :field-id="fieldId" :hint-id="hintId" :invalid="invalid">
    <button
      :class="css.step"
      type="button"
      :disabled="disabled"
      :aria-label="m.inputNumberDec"
      @click="nudge(-1)"
    >
      <svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2 5 H8" /></svg>
    </button>

    <input
      :id="fieldId"
      :class="css.control"
      type="text"
      inputmode="decimal"
      :value="model"
      :disabled="disabled"
      :aria-invalid="invalid || undefined"
      :aria-describedby="hint ? hintId : undefined"
      @input="onInput"
      @keydown.up.prevent="nudge(1)"
      @keydown.down.prevent="nudge(-1)"
    />

    <button
      :class="css.step"
      type="button"
      :disabled="disabled"
      :aria-label="m.inputNumberInc"
      @click="nudge(1)"
    >
      <svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2 5 H8 M5 2 V8" /></svg>
    </button>
  </FieldShell>
</template>
