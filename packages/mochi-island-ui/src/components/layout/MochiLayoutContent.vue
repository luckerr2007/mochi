<script setup lang="ts">
import css from './MochiLayout.module.css'

/** 主内容区：flex:1 吃剩余空间，min-width:0 防止内部宽表格撑破骨架 */
defineOptions({ name: 'MochiLayoutContent' })
</script>

<template>
  <main :class="css.content">
    <slot />
  </main>
</template>
