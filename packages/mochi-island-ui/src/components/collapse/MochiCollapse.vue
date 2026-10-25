<script setup lang="ts">
import css from './MochiCollapse.module.css'

defineOptions({ name: 'MochiCollapse' })

/**
 * 用原生 details/summary：展开、键盘、读屏全部免费。
 * 展开状态不受控（非受控组件），需要受控请在外层用 :key 或 v-if 重建。
 */
withDefaults(defineProps<{ title: string; open?: boolean }>(), { open: false })
</script>

<template>
  <details :class="css.root" :open="open || undefined">
    <summary :class="css.summary">{{ title }}</summary>
    <div :class="css.content"><slot /></div>
  </details>
</template>
