<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { MochiAvatarSize } from './types';
import css from './MochiAvatar.module.css';

defineOptions({ name: 'MochiAvatar' });

const props = withDefaults(
  defineProps<{ src?: string; name?: string; size?: MochiAvatarSize }>(),
  { size: 'md' },
);

// 图片加载失败时退回首字，避免出现破图
const failed = ref(false);
watch(
  () => props.src,
  () => {
    failed.value = false;
  },
);

const initial = computed(() => props.name?.trim().slice(0, 1).toUpperCase() || '?');
</script>

<template>
  <span :class="css.root" :data-size="size">
    <img
      v-if="src && !failed"
      :class="css.img"
      :src="src"
      :alt="name || ''"
      @error="failed = true"
    />
    <span v-else :class="css.fallback" role="img" :aria-label="name || undefined">{{ initial }}</span>
  </span>
</template>
