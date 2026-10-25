<script setup lang="ts">
import { toastItems } from '../../composables/toast'
import ToastCard from './ToastCard.vue'
import css from './MochiToastHost.module.css'
import { useMessages } from '../../locale'

const m = useMessages()
</script>

<template>
  <Teleport to="body">
    <!-- move-class 让剩余通知在别人消失时平滑上移，这是"堆叠不跳"的关键 -->
    <div :class="css.stack" role="region" :aria-label="m.notifications">
      <TransitionGroup
        :enter-active-class="css.cardEnter"
        :leave-active-class="css.cardLeave"
        :move-class="css.cardMove"
      >
        <ToastCard v-for="(item, index) in toastItems" :key="item.id" :item="item" :index="index" />
      </TransitionGroup>
    </div>
  </Teleport>
</template>
