<script setup lang="ts">
import css from './MochiSwitch.module.css'

defineOptions({ name: 'MochiSwitch' })

withDefaults(defineProps<{ label?: string; disabled?: boolean }>(), { disabled: false })

const model = defineModel<boolean>({ default: false })
</script>

<template>
  <label :class="css.root" :data-disabled="disabled || undefined">
    <!-- 原生 checkbox 承载语义与键盘行为，视觉交给 track / thumb -->
    <input
      v-model="model"
      :class="css.control"
      type="checkbox"
      role="switch"
      :disabled="disabled"
    />
    <span :class="css.track"><span :class="css.thumb" /></span>
    <span v-if="label || $slots.default" :class="css.text"
      ><slot>{{ label }}</slot></span
    >
  </label>
</template>
