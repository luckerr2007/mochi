<script setup lang="ts">
import type { MochiTagTone } from './types';
import css from './MochiTag.module.css';
import { useMessages } from '../../locale';

defineOptions({ name: 'MochiTag' });

const m = useMessages();

withDefaults(
  defineProps<{
    tone?: MochiTagTone;
    closable?: boolean;
    /** 关闭按钮的无障碍名称 */
    closeLabel?: string;
  }>(),
  { tone: 'neutral', closable: false },
);

defineEmits<{ close: [] }>();
</script>

<template>
  <span :class="css.root" :data-tone="tone">
    <slot />
    <button v-if="closable" :class="css.close" type="button" :aria-label="closeLabel ?? m.remove" @click="$emit('close')">
      <svg viewBox="0 0 10 10" aria-hidden="true" focusable="false">
        <path d="M2 2 L8 8 M8 2 L2 8" />
      </svg>
    </button>
  </span>
</template>
