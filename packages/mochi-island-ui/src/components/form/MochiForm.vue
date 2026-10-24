<script setup lang="ts">
import css from './MochiForm.module.css';

defineOptions({ name: 'MochiForm' });

withDefaults(defineProps<{ layout?: 'vertical' | 'horizontal' }>(), { layout: 'vertical' });

const emit = defineEmits<{ submit: [] }>();
</script>

<template>
  <form :class="css.root" :data-layout="layout" @submit.prevent="emit('submit')">
    <slot />
  </form>
</template>
