<script setup lang="ts">
import { computed, useId } from 'vue'
import FieldShell from '../../internal/FieldShell.vue'
import css from './MochiTextarea.module.css'

defineOptions({ name: 'MochiTextarea' })

withDefaults(
  defineProps<{
    label?: string
    hint?: string
    placeholder?: string
    rows?: number
    disabled?: boolean
    readonly?: boolean
    invalid?: boolean
  }>(),
  { rows: 3 },
)

const model = defineModel<string>({ default: '' })

const fieldId = useId()
const hintId = computed(() => `${fieldId}-hint`)
</script>

<template>
  <FieldShell :label="label" :hint="hint" :field-id="fieldId" :hint-id="hintId" :invalid="invalid">
    <textarea
      :id="fieldId"
      v-model="model"
      :class="css.control"
      :rows="rows"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :aria-invalid="invalid || undefined"
      :aria-describedby="hint ? hintId : undefined"
    />
  </FieldShell>
</template>
