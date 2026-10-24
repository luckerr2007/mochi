<script setup lang="ts">
import css from './MochiEmpty.module.css';

defineOptions({ name: 'MochiEmpty' });

withDefaults(defineProps<{ description?: string }>(), { description: '这里什么都没有' });
</script>

<template>
  <div :class="css.root">
    <span :class="css.mark" aria-hidden="true" />
    <p :class="css.text"><slot name="description">{{ description }}</slot></p>
    <div v-if="$slots.action" :class="css.action"><slot name="action" /></div>
  </div>
</template>
