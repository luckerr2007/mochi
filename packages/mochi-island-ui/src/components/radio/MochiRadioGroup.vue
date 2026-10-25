<script setup lang="ts">
import { useId } from 'vue'
import type { MochiRadioOption } from './types'
import css from './MochiRadioGroup.module.css'

defineOptions({ name: 'MochiRadioGroup' })

withDefaults(
  defineProps<{
    options: MochiRadioOption[]
    legend?: string
    disabled?: boolean
  }>(),
  { disabled: false },
)

const model = defineModel<string>({ default: '' })

// 同名的原生 radio 才能用方向键在一组内切换，名字由组件自己保证一致
const groupName = useId()
</script>

<template>
  <fieldset :class="css.root" :disabled="disabled">
    <legend v-if="legend" :class="css.legend">{{ legend }}</legend>

    <div :class="css.options">
      <label
        v-for="option in options"
        :key="option.value"
        :class="css.option"
        :data-disabled="option.disabled || undefined"
      >
        <input
          v-model="model"
          :class="css.control"
          type="radio"
          :name="groupName"
          :value="option.value"
          :disabled="option.disabled"
        />
        <span :class="css.dot"><span :class="css.pip" /></span>
        <span :class="css.text">{{ option.label }}</span>
      </label>
    </div>
  </fieldset>
</template>
