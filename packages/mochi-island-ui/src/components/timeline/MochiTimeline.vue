<script setup lang="ts">
import type { MochiTimelineItem } from './types';
import css from './MochiTimeline.module.css';

defineOptions({ name: 'MochiTimeline' });

withDefaults(defineProps<{ items: MochiTimelineItem[] }>(), {});
</script>

<template>
  <ol :class="css.root">
    <li
      v-for="(item, index) in items"
      :key="`${item.title}-${index}`"
      :class="css.item"
      :style="{ '--_i': index }"
    >
      <span :class="css.dot" :data-tone="item.tone ?? 'primary'" aria-hidden="true" />
      <div :class="css.content">
        <time v-if="item.time" :class="css.time">{{ item.time }}</time>
        <strong :class="css.title">{{ item.title }}</strong>
        <p v-if="item.description" :class="css.desc">{{ item.description }}</p>
      </div>
    </li>
  </ol>
</template>
