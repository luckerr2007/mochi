<script setup lang="ts">
import { computed, ref } from 'vue';
import css from './MochiCalendar.module.css';
import { useMessages } from '../../locale';

defineOptions({ name: 'MochiCalendar' });

const m = useMessages();

const props = withDefaults(defineProps<{ label?: string }>(), {});

const model = defineModel<Date | null>({ default: null });

const WEEKDAYS = computed(() => m.value.weekdays);

const today = new Date();
const anchor = ref(new Date(today.getFullYear(), today.getMonth(), 1));
/** 切换月份的方向，决定滑入动画从哪边来 */
const direction = ref<1 | -1>(1);

const year = computed(() => anchor.value.getFullYear());
const month = computed(() => anchor.value.getMonth() + 1);
const monthKey = computed(() => `${year.value}-${month.value}`);
const rootEl = ref<HTMLElement>();

/** 42 格：周一开头，前后补上邻月的日子 */
const cells = computed(() => {
  const first = new Date(anchor.value.getFullYear(), anchor.value.getMonth(), 1);
  const offset = (first.getDay() + 6) % 7;
  const start = new Date(first);
  start.setDate(first.getDate() - offset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return {
      date,
      outside: date.getMonth() !== first.getMonth(),
      today: sameDay(date, today),
      selected: model.value ? sameDay(date, model.value) : false,
    };
  });
});

/** 唯一能被 Tab 停靠的那一格：优先已选，其次今天，都没有就落到本月 1 号 */
const focusIndex = computed(() => {
  const selected = cells.value.findIndex((cell) => cell.selected);
  if (selected >= 0) return selected;
  const todayIndex = cells.value.findIndex((cell) => cell.today);
  if (todayIndex >= 0) return todayIndex;
  return cells.value.findIndex((cell) => !cell.outside);
});

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function shift(step: 1 | -1) {
  direction.value = step;
  anchor.value = new Date(year.value, anchor.value.getMonth() + step, 1);
}

function pick(date: Date) {
  model.value = date;
  // 选到邻月时同步翻页，不然选完看不见自己选了什么
  if (date.getMonth() !== anchor.value.getMonth()) {
    direction.value = date < anchor.value ? -1 : 1;
    anchor.value = new Date(date.getFullYear(), date.getMonth(), 1);
  }
}

/** ← → 一天，↑ ↓ 一周；焦点跟着走 */
function onKeydown(event: KeyboardEvent, index: number) {
  const steps: Record<string, number> = {
    ArrowLeft: -1,
    ArrowRight: 1,
    ArrowUp: -7,
    ArrowDown: 7,
  };
  const step = steps[event.key];
  if (!step) return;
  event.preventDefault();

  const target = cells.value[index + step];
  if (!target) return;
  pick(target.date);
  queueMicrotask(() => {
    // 限定在本组件内查找，同一页可能有多个日历
    rootEl.value?.querySelector<HTMLElement>(`[data-cal-index="${index + step}"]`)?.focus();
  });
}
</script>

<template>
  <div ref="rootEl" :class="css.root" :aria-label="label ?? m.calendarLabel">
    <header :class="css.head">
      <button :class="css.nav" type="button" :aria-label="m.prevMonth" @click="shift(-1)">
        <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M7.5 2.5 L4 6 L7.5 9.5" /></svg>
      </button>
      <strong :class="css.title">{{ year }} 年 {{ month }} 月</strong>
      <button :class="css.nav" type="button" :aria-label="m.nextMonth" @click="shift(1)">
        <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M4.5 2.5 L8 6 L4.5 9.5" /></svg>
      </button>
    </header>

    <div :class="css.weekdays" aria-hidden="true">
      <span v-for="day in WEEKDAYS" :key="day">{{ day }}</span>
    </div>

    <div :key="monthKey" :class="css.grid" :data-dir="direction">
      <button
        v-for="(cell, index) in cells"
        :key="cell.date.toISOString()"
        :class="css.day"
        type="button"
        :data-index="index"
        :data-outside="cell.outside || undefined"
        :data-today="cell.today || undefined"
        :data-selected="cell.selected || undefined"
        :tabindex="index === focusIndex ? 0 : -1"
        :aria-label="m.dateLabel(cell.date.getFullYear(), cell.date.getMonth() + 1, cell.date.getDate())"
        :aria-pressed="cell.selected || undefined"
        :data-cal-index="index"
        @click="pick(cell.date)"
        @keydown="onKeydown($event, index)"
      >
        {{ cell.date.getDate() }}
      </button>
    </div>
  </div>
</template>
