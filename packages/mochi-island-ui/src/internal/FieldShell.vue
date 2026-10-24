<script setup lang="ts">
import css from './FieldShell.module.css';

defineOptions({ name: 'MochiFieldShell' });

/**
 * 表单件的公共外壳（label / 凹陷槽 / hint）。
 * 内部组件，不对外导出——Input 与 Textarea 共用，保证两者的槽与间距永远一致。
 */
defineProps<{
  label?: string;
  hint?: string;
  /** 关联 label 的 for，由使用方传入 */
  fieldId?: string;
  hintId?: string;
  invalid?: boolean;
}>();
</script>

<template>
  <div :class="css.root" :data-invalid="invalid || undefined">
    <label v-if="label" :class="css.label" :for="fieldId">{{ label }}</label>
    <div :class="css.well">
      <slot />
    </div>
    <p v-if="hint" :id="hintId" :class="css.hint">{{ hint }}</p>
  </div>
</template>
