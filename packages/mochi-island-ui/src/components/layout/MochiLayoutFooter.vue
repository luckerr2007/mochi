<script setup lang="ts">
import css from './MochiLayout.module.css';

/** 底栏：弱化文字色，常放版权与次要链接 */
defineOptions({ name: 'MochiLayoutFooter' });
</script>

<template>
  <footer :class="css.footer">
    <slot />
  </footer>
</template>
