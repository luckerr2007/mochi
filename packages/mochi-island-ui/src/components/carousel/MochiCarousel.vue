<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { MochiCarouselItem } from './types';
import css from './MochiCarousel.module.css';
import { useMessages } from '../../locale';

defineOptions({ name: 'MochiCarousel' });

const m = useMessages();

const props = withDefaults(
  defineProps<{
    items: MochiCarouselItem[];
    /** 自动播放间隔，0 表示不自动播放 */
    interval?: number;
    height?: string;
    label?: string;
  }>(),
  { interval: 4000, height: '220px' },
);

const index = ref(0);
const paused = ref(false);
const count = computed(() => props.items.length);
const track = computed(() => ({ transform: `translateX(-${index.value * 100}%)` }));

let timer: ReturnType<typeof setTimeout> | undefined;

function go(target: number) {
  if (!count.value) return;
  index.value = (target + count.value) % count.value;
}

function restart() {
  clearTimeout(timer);
  if (!props.interval || paused.value || count.value < 2) return;
  timer = setTimeout(() => {
    go(index.value + 1);
    restart();
  }, props.interval);
}

watch(index, restart);

// 拖动切换：按下记起点，抬起时看位移是否过阈值
let startX = 0;
let dragging = false;

function pause() {
  paused.value = true;
  clearTimeout(timer);
}

function resume() {
  paused.value = false;
  restart();
}

function onPointerDown(event: PointerEvent) {
  dragging = true;
  startX = event.clientX;
  pause();
}

function onPointerUp(event: PointerEvent) {
  if (!dragging) return;
  dragging = false;
  const delta = event.clientX - startX;
  if (Math.abs(delta) > 40) go(index.value + (delta < 0 ? 1 : -1));
  resume();
}

onMounted(() => {
  // jsdom 等环境没有 matchMedia，不能一上来就调
  const reduced =
    typeof globalThis.matchMedia === 'function' &&
    globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;
  restart();
});
onBeforeUnmount(() => clearTimeout(timer));
</script>

<template>
  <section
    :class="css.root"
    :style="{ height }"
    :aria-roledescription="label"
    :aria-label="label"
    @pointerenter="pause"
    @pointerleave="resume"
  >
    <div
      :class="css.viewport"
      @pointerdown="onPointerDown"
      @pointerup="onPointerUp"
      @pointercancel="dragging = false"
    >
      <div :class="css.track" :style="track">
        <div
          v-for="(item, i) in items"
          :key="item.key"
          :class="css.slide"
          :aria-hidden="i !== index ? 'true' : undefined"
        >
          <slot name="slide" :item="item" :index="i">{{ item.alt }}</slot>
        </div>
      </div>
    </div>

    <button v-if="count > 1" :class="[css.arrow, css.prev]" type="button" :aria-label="m.carouselPrev" @click="go(index - 1)">
      <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M7.5 2.5 L4 6 L7.5 9.5" /></svg>
    </button>
    <button v-if="count > 1" :class="[css.arrow, css.next]" type="button" :aria-label="m.carouselNext" @click="go(index + 1)">
      <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M4.5 2.5 L8 6 L4.5 9.5" /></svg>
    </button>

    <div v-if="count > 1" :class="css.dots" role="tablist" :aria-label="label">
      <button
        v-for="(item, i) in items"
        :key="`dot-${item.key}`"
        :class="css.dot"
        type="button"
        role="tab"
        :aria-selected="i === index"
        :aria-label="m.carouselSlide(i + 1)"
        @click="go(i)"
      />
    </div>
  </section>
</template>
