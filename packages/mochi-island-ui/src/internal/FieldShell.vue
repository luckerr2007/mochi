<script setup lang="ts">
import { computed, inject, watchEffect } from 'vue'
import css from './FieldShell.module.css'
import { MOCHI_FORM_ITEM } from './formItemContext'

defineOptions({ name: 'MochiFieldShell' })

/**
 * 表单件的公共外壳（label / 凹陷槽 / hint）。
 * 内部组件，不对外导出——Input、Textarea、Select 等共用，保证槽与间距永远一致。
 *
 * 套在 MochiFormItem 里时自动接通表单上下文：错误态下传（输入槽跟着变红，
 * 不需要使用者手动绑 invalid），并把自己的 fieldId 注册上去让 FormItem 的
 * <label for> 关联到真正的控件。
 */
const props = defineProps<{
  label?: string
  hint?: string
  /** 关联 label 的 for，由使用方传入 */
  fieldId?: string
  hintId?: string
  invalid?: boolean
}>()

const item = inject(MOCHI_FORM_ITEM, null)

const effectiveInvalid = computed(() => props.invalid || item?.invalid.value || false)

watchEffect(() => {
  if (props.fieldId) item?.setFieldId(props.fieldId)
})
</script>

<template>
  <div :class="css.root" :data-invalid="effectiveInvalid || undefined">
    <label v-if="label" :class="css.label" :for="fieldId">{{ label }}</label>
    <div :class="css.well">
      <slot />
    </div>
    <p v-if="hint" :id="hintId" :class="css.hint">{{ hint }}</p>
  </div>
</template>
