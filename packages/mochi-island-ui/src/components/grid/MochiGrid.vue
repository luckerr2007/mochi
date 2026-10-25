<script setup lang="ts">
import css from './MochiGrid.module.css';

/**
 * 栅格容器：cols 列等宽（minmax(0,1fr) 防内容撑破），gap 单位 px。
 * 子项用 MochiGridItem 控制 span（含 sm/md/lg 断点覆盖）。
 */
defineOptions({ name: 'MochiGrid' });

withDefaults(
  defineProps<{
    cols?: number;
    gap?: number;
  }>(),
  { cols: 12, gap: 12 },
);
</script>

<template>
  <div :class="css.root" :style="{ '--grid-cols': cols, '--grid-gap': `${gap}px` }">
    <slot />
  </div>
</template>
