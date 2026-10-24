<script setup lang="ts">
import type { MochiDescriptionItem } from './types';
import css from './MochiDescriptions.module.css';

defineOptions({ name: 'MochiDescriptions' });

withDefaults(defineProps<{ items: MochiDescriptionItem[]; columns?: number }>(), { columns: 2 });
</script>

<template>
  <dl :class="css.root" :style="{ '--_cols': columns }">
    <div v-for="item in items" :key="item.label" :class="css.cell">
      <dt :class="css.label">{{ item.label }}</dt>
      <dd :class="css.value">{{ item.value }}</dd>
    </div>
  </dl>
</template>
