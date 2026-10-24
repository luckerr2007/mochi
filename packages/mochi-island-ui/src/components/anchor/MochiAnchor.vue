<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { MochiAnchorItem } from './types';
import css from './MochiAnchor.module.css';

defineOptions({ name: 'MochiAnchor' });

const props = withDefaults(defineProps<{ items: MochiAnchorItem[]; offset?: number; label?: string }>(), {
  offset: 80,
  label: '页内导航',
});

const active = defineModel<string>('active', { default: '' });
const root = ref<HTMLElement>();
const indicator = ref({ top: 0, height: 0 });

function syncIndicator() {
  const el = root.value?.querySelector<HTMLElement>(`[data-key="${active.value}"]`);
  indicator.value = el
    ? { top: el.offsetTop, height: el.offsetHeight }
    : { top: 0, height: 0 };
}

/** 找最后一个已经滚过视口顶部 + offset 的章节 */
function spy() {
  let current = '';
  for (const item of props.items) {
    const el = document.getElementById(item.id);
    if (!el) continue;
    if (el.getBoundingClientRect().top <= props.offset) current = item.id;
  }
  if (current !== active.value) active.value = current;
}

function jump(item: MochiAnchorItem) {
  const reduced =
    typeof globalThis.matchMedia === 'function' &&
    globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.getElementById(item.id)?.scrollIntoView({
    behavior: reduced ? 'auto' : 'smooth',
    block: 'start',
  });
}

function onScroll() {
  spy();
}

onMounted(() => {
  spy();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  nextTick(syncIndicator);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('resize', onScroll);
});

watch(active, () => nextTick(syncIndicator));
</script>

<template>
  <nav ref="root" :class="css.root" :aria-label="label">
    <span
      :class="css.indicator"
      :style="{ transform: `translateY(${indicator.top}px)`, height: `${indicator.height}px` }"
      aria-hidden="true"
    />
    <ul :class="css.list">
      <li v-for="item in items" :key="item.id">
        <a
          :class="css.link"
          :href="`#${item.id}`"
          :data-key="item.id"
          :aria-current="active === item.id ? 'true' : undefined"
          @click.prevent="jump(item)"
        >
          {{ item.label }}
        </a>
      </li>
    </ul>
  </nav>
</template>
