<script setup lang="ts">
import { computed } from 'vue';
import css from './MochiPagination.module.css';

defineOptions({ name: 'MochiPagination' });

const props = withDefaults(
  defineProps<{
    total: number;
    /** 当前页两侧各显示几个页码 */
    siblings?: number;
    label?: string;
  }>(),
  { siblings: 1, label: '分页' },
);

const model = defineModel<number>({ default: 1 });

const current = computed(() => Math.min(Math.max(1, model.value), Math.max(1, props.total)));

/** 首尾常驻，中间放当前页 ± siblings，超过阈值才用省略号 */
const pages = computed<(number | '...')[]>(() => {
  const total = Math.max(1, props.total);
  const span = props.siblings * 2 + 5;
  if (total <= span) return Array.from({ length: total }, (_, index) => index + 1);

  const left = Math.max(current.value - props.siblings, 2);
  const right = Math.min(current.value + props.siblings, total - 1);
  const list: (number | '...')[] = [1];
  if (left > 2) list.push('...');
  for (let page = left; page <= right; page += 1) list.push(page);
  if (right < total - 1) list.push('...');
  list.push(total);
  return list;
});

function go(page: number) {
  const next = Math.min(Math.max(1, page), Math.max(1, props.total));
  if (next !== model.value) model.value = next;
}
</script>

<template>
  <nav :class="css.root" :aria-label="label">
    <button :class="css.nav" type="button" :disabled="current <= 1" aria-label="上一页" @click="go(current - 1)">
      <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M7.5 2.5 L4 6 L7.5 9.5" /></svg>
    </button>

    <template v-for="(page, index) in pages" :key="`${page}-${index}`">
      <span v-if="page === '...'" :class="css.gap" aria-hidden="true">···</span>
      <button
        v-else
        :class="css.page"
        type="button"
        :aria-current="page === current ? 'page' : undefined"
        @click="go(page)"
      >
        {{ page }}
      </button>
    </template>

    <button
      :class="css.nav"
      type="button"
      :disabled="current >= total"
      aria-label="下一页"
      @click="go(current + 1)"
    >
      <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M4.5 2.5 L8 6 L4.5 9.5" /></svg>
    </button>
  </nav>
</template>
