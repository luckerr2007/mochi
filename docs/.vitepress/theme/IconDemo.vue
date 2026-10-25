<script setup lang="ts">
import { MochiIcon } from 'mochi-island-ui';
import { Sparkles, Rocket, Heart, MapPin, Calendar, Search } from 'lucide-vue-next';
</script>

<template>
  <div class="icon-demo-row">
    <span><MochiIcon :icon="Sparkles" /> 闪光</span>
    <span><MochiIcon :icon="Rocket" size="lg" /> 发射</span>
    <span><MochiIcon :icon="Heart" size="sm" /> 喜欢</span>
    <span><MochiIcon :icon="MapPin" label="地点" /></span>
    <span><MochiIcon :icon="Calendar" :stroke-width="1.5" /> 日程</span>
    <span><MochiIcon :icon="Search" size="sm" :stroke-width="1.5" /> 搜索</span>
  </div>
</template>

<style scoped>
.icon-demo-row {
  display: flex;
  gap: var(--mochi-space-4, 16px);
  align-items: center;
  font-size: 15px;
}
</style>
