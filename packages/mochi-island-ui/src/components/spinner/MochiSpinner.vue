<script setup lang="ts">
import css from './MochiSpinner.module.css';

defineOptions({ name: 'MochiSpinner' });

withDefaults(defineProps<{ size?: number; label?: string }>(), { size: 20, label: '加载中' });
</script>

<template>
  <span :class="css.root" role="status" :style="{ '--_size': `${size}px` }">
    <span :class="css.ring" aria-hidden="true" />
    <span :class="css.srOnly">{{ label }}</span>
  </span>
</template>
