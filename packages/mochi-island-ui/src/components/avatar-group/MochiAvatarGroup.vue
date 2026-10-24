<script setup lang="ts">
import { computed } from 'vue';
import MochiAvatar from '../avatar/MochiAvatar.vue';
import type { MochiAvatarGroupItem, MochiAvatarGroupSize } from './types';
import css from './MochiAvatarGroup.module.css';

defineOptions({ name: 'MochiAvatarGroup' });

const props = withDefaults(
  defineProps<{
    items: MochiAvatarGroupItem[];
    /** 最多展示几个头像，超出折叠成 +N */
    max?: number;
    size?: MochiAvatarGroupSize;
    /** 读屏朗读的群体名称 */
    label?: string;
  }>(),
  { max: 4, size: 'md', label: '成员' },
);

const shown = computed(() => props.items.slice(0, Math.max(1, props.max)));
const rest = computed(() => props.items.length - shown.value.length);
</script>

<template>
  <!-- 悬停的头像会浮到最上层并上浮 2px，像被拎起来看了一眼 -->
  <div :class="css.root" :data-size="size" role="group" :aria-label="`${label}，共 ${items.length} 位`">
    <span v-for="(item, index) in shown" :key="item.name" :class="css.item" :style="{ '--_i': index }">
      <MochiAvatar :name="item.name" :src="item.src" :size="size" />
    </span>
    <span v-if="rest > 0" :class="[css.item, css.more]" :title="`其余 ${rest} 位`">
      <span :class="css.moreText" aria-hidden="true">+{{ rest }}</span>
    </span>
  </div>
</template>
