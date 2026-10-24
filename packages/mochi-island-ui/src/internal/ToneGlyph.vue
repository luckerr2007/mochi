<script setup lang="ts">
defineOptions({ name: 'MochiToneGlyph' });

/** 语气符号：info=i / success=✓ / warning·danger=!，线条交给父级样式 */
defineProps<{ tone: 'info' | 'success' | 'warning' | 'danger' }>();
</script>

<template>
  <svg viewBox="0 0 12 12" aria-hidden="true" focusable="false">
    <path v-if="tone === 'info'" d="M6 3.2 V3.3 M6 5.5 V9" />
    <path v-else-if="tone === 'success'" d="M2 6.2 L4.8 9 L10 3.4" />
    <path v-else d="M6 2.4 V6.8 M6 9.2 V9.3" />
  </svg>
</template>
