<script setup lang="ts">
import css from './MochiLayout.module.css'

/**
 * 页面骨架容器：默认纵向排（Header/Content/Footer），传 hasSider 时横排容纳 Sider。
 * 自己不带视觉，视觉在 Header/Sider/Content/Footer 各自身上。
 */
defineOptions({ name: 'MochiLayout' })

defineProps<{
  hasSider?: boolean
}>()
</script>

<template>
  <div :class="[css.root, hasSider && css.row]">
    <slot />
  </div>
</template>
