<script setup lang="ts">
import { computed, useId } from 'vue'
import FieldShell from '../../internal/FieldShell.vue'
import css from './MochiInput.module.css'

defineOptions({ name: 'MochiInput' })

withDefaults(
  defineProps<{
    label?: string
    /** 说明文字，同时作为 aria-describedby 的目标 */
    hint?: string
    placeholder?: string
    type?: string
    disabled?: boolean
    readonly?: boolean
    invalid?: boolean
  }>(),
  { type: 'text' },
)

const model = defineModel<string>({ default: '' })

// 关联 label / hint 与输入框，避免使用方忘记写 id
const inputId = useId()
const hintId = computed(() => `${inputId}-hint`)
</script>

<template>
  <FieldShell :label="label" :hint="hint" :field-id="inputId" :hint-id="hintId" :invalid="invalid">
    <input
      :id="inputId"
      v-model="model"
      :class="css.control"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :aria-invalid="invalid || undefined"
      :aria-describedby="hint ? hintId : undefined"
    />
  </FieldShell>
</template>
