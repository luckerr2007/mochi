<script setup lang="ts">
import type { MochiBreadcrumbItem } from './types';
import css from './MochiBreadcrumb.module.css';

defineOptions({ name: 'MochiBreadcrumb' });

withDefaults(defineProps<{ items: MochiBreadcrumbItem[]; label?: string }>(), { label: '面包屑' });
</script>

<template>
  <nav :class="css.root" :aria-label="label">
    <ol :class="css.list">
      <li v-for="(item, index) in items" :key="item.label" :class="css.item">
        <a v-if="item.href && index < items.length - 1" :class="css.link" :href="item.href">
          {{ item.label }}
        </a>
        <span
          v-else
          :class="css.text"
          :aria-current="index === items.length - 1 ? 'page' : undefined"
        >
          {{ item.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>
