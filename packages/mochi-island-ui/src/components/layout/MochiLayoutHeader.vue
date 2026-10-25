<script setup lang="ts">
import css from './MochiLayout.module.css';

/** 顶栏：默认吸顶（sticky 不占文档流外的位，滚出也会回来） */
defineOptions({ name: 'MochiLayoutHeader' });

withDefaults(
  defineProps<{
    sticky?: boolean;
  }>(),
  { sticky: true },
);
</script>

<template>
  <header :class="[css.header, sticky && css.sticky]">
    <slot />
  </header>
</template>
