<script setup lang="ts">
import css from './MochiKbd.module.css';

defineOptions({ name: 'MochiKbd' });
</script>

<template>
  <kbd :class="css.root"><slot /></kbd>
</template>
