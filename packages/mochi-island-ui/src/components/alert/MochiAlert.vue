<script setup lang="ts">
import ToneGlyph from '../../internal/ToneGlyph.vue';
import type { MochiAlertTone } from './types';
import css from './MochiAlert.module.css';

defineOptions({ name: 'MochiAlert' });

withDefaults(
  defineProps<{
    tone?: MochiAlertTone;
    title?: string;
    closable?: boolean;
    closeLabel?: string;
  }>(),
  { tone: 'info', closable: false, closeLabel: '关闭' },
);

defineEmits<{ close: [] }>();
</script>

<template>
  <div :class="css.root" :data-tone="tone" role="status">
    <!-- 语气徽章：软色底 + 墨色符号，读法与开关/勾选框一致 -->
    <span :class="css.badge" aria-hidden="true">
      <ToneGlyph :tone="tone" />
    </span>

    <div :class="css.body">
      <p v-if="title" :class="css.title">{{ title }}</p>
      <div :class="css.text"><slot /></div>
    </div>

    <button v-if="closable" :class="css.close" type="button" :aria-label="closeLabel" @click="$emit('close')">
      <svg viewBox="0 0 10 10" aria-hidden="true" focusable="false">
        <path d="M2 2 L8 8 M8 2 L2 8" />
      </svg>
    </button>
  </div>
</template>
