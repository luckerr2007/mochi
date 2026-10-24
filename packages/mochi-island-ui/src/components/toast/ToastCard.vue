<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { dismissToast, type MochiToastItem } from '../../composables/toast';
import css from './MochiToastHost.module.css';
import { useMessages } from '../../locale';

const m = useMessages();

const props = defineProps<{ item: MochiToastItem; index?: number }>();

const paused = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;
let startedAt = 0;
let remaining = props.item.duration;

function start() {
  if (!props.item.duration) return;
  startedAt = performance.now();
  timer = setTimeout(() => dismissToast(props.item.id), remaining);
}

function pause() {
  if (!props.item.duration) return;
  paused.value = true;
  clearTimeout(timer);
  remaining -= performance.now() - startedAt;
}

function resume() {
  if (!props.item.duration) return;
  paused.value = false;
  start();
}

onMounted(start);
onBeforeUnmount(() => clearTimeout(timer));
</script>

<template>
  <div
    :class="css.card"
    :data-tone="item.tone"
    :style="{ '--_i': index ?? 0 }"
    role="status"
    @pointerenter="pause"
    @pointerleave="resume"
  >
    <span :class="css.spine" aria-hidden="true" />

    <div :class="css.content">
      <strong :class="css.title">{{ item.title }}</strong>
      <p v-if="item.description" :class="css.desc">{{ item.description }}</p>
    </div>

    <button :class="css.close" type="button" :aria-label="m.toastClose" @click="dismissToast(item.id)">
      <svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2 2 L8 8 M8 2 L2 8" /></svg>
    </button>

    <!-- 进度条用 CSS 动画而非 JS 逐帧：悬停时 animation-play-state 天然支持"暂停/续播" -->
    <span
      v-if="item.duration"
      :class="css.progress"
      :style="{ animationDuration: `${item.duration}ms`, animationPlayState: paused ? 'paused' : 'running' }"
      aria-hidden="true"
    />
  </div>
</template>
