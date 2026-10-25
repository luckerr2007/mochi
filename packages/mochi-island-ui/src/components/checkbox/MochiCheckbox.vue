<script setup lang="ts">
import css from './MochiCheckbox.module.css'

defineOptions({ name: 'MochiCheckbox' })

withDefaults(defineProps<{ label?: string; disabled?: boolean }>(), { disabled: false })

const model = defineModel<boolean>({ default: false })
</script>

<template>
  <label :class="css.root" :data-disabled="disabled || undefined">
    <input v-model="model" :class="css.control" type="checkbox" :disabled="disabled" />
    <span :class="css.box">
      <!-- 勾选标记是矢量路径，边缘保持锐利 -->
      <svg :class="css.mark" viewBox="0 0 12 10" aria-hidden="true" focusable="false">
        <path d="M1 5 L4.5 8.5 L11 1.5" />
      </svg>
    </span>
    <span v-if="label || $slots.default" :class="css.text"
      ><slot>{{ label }}</slot></span
    >
  </label>
</template>
