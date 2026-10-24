<script setup lang="ts">
import { computed } from 'vue';
import css from './MochiSpace.module.css';

defineOptions({ name: 'MochiSpace' });

const props = withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg' | number;
    vertical?: boolean;
    wrap?: boolean;
  }>(),
  { size: 'md', vertical: false, wrap: false },
);

/** 语义档位映射到 4px 网格：sm=8 / md=16 / lg=24 */
const gap = computed(() => {
  if (typeof props.size === 'number') return `${props.size}px`;
  return `var(--mochi-space-${props.size === 'sm' ? 2 : props.size === 'lg' ? 6 : 4})`;
});
</script>

<template>
  <div
    :class="css.root"
    :style="{ gap }"
    :data-vertical="vertical || undefined"
    :data-wrap="wrap || undefined"
  >
    <slot />
  </div>
</template>
