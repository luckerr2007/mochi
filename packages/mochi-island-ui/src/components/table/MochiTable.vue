<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, TransitionGroup, watch } from 'vue';
import type { MochiTableColumn, MochiTableSort } from './types';
import css from './MochiTable.module.css';
import vcss from '../../styles/virtual.module.css';
import { shouldVirtualize } from '../../styles/virtual';
import type { MochiVirtualSetting } from '../../styles/virtual';
import { useMessages } from '../../locale';

defineOptions({ name: 'MochiTable' });

const m = useMessages();

const props = withDefaults(
  defineProps<{
    columns: MochiTableColumn[];
    rows: Record<string, unknown>[];
    /** 行主键字段，用来给 v-for 一个稳定 key */
    rowKey?: string;
    striped?: boolean;
    emptyText?: string;
    /**
     * CSS 虚拟化三态：true 强制开（屏外行跳过布局/绘制，DOM 保留）；
     * false 强制关；'auto'（默认）按硬件自适应——低端设备自动开。
     */
    virtual?: MochiVirtualSetting;
    /**
     * 渐进分片渲染：行数超阈值时先渲染首块（200 行）尽快出屏，其余行在
     * idle 期补齐，DOM 最终全量保留（可 Ctrl+F）。补块大小按上一块的实际
     * patch 耗时 AIMD 调节（预算内翻倍、超时减半），慢硬件自动缩小、快硬件
     * 自动放大。排序/换数据会重置分片。
     */
    progressive?: boolean;
  }>(),
  { rowKey: 'id', virtual: 'auto', progressive: true },
);

const emit = defineEmits<{ 'sort-change': [MochiTableSort | null] }>();

const sort = ref<MochiTableSort | null>(null);

const sortedRows = computed(() => {
  const current = sort.value;
  if (!current) return props.rows;

  const factor = current.order === 'asc' ? 1 : -1;
  return [...props.rows].sort((a, b) => {
    const left = a[current.key];
    const right = b[current.key];
    if (left === right) return 0;
    // 数字按大小、其余按字符串比较
    if (typeof left === 'number' && typeof right === 'number') return (left - right) * factor;
    return String(left).localeCompare(String(right), 'zh-CN') * factor;
  });
});

/** 升序 → 降序 → 取消，三态循环 */
function toggleSort(column: MochiTableColumn) {
  if (!column.sortable) return;
  if (sort.value?.key !== column.key) sort.value = { key: column.key, order: 'asc' };
  else if (sort.value.order === 'asc') sort.value = { key: column.key, order: 'desc' };
  else sort.value = null;
  emit('sort-change', sort.value);
}

function ariaSort(column: MochiTableColumn) {
  if (sort.value?.key !== column.key) return 'none';
  return sort.value.order === 'asc' ? 'ascending' : 'descending';
}

const virtualOn = computed(() => shouldVirtualize(sortedRows.value.length, props.virtual));

/**
 * 渐进分片调度内核：先出首块，其余行 idle 期补齐（jsdom 里 requestIdleCallback
 * 缺席，退化为 setTimeout）。补块大小按上一块的真实 patch 耗时做 AIMD 调节
 * （约一帧的预算内 ×2 增长、超预算 ÷2 收缩、地板 200 保护慢机）：块追加要对
 * 既有列表做 keyed diff（成本随行数增长），固定块大小要么浪费 idle 预算（快机器）
 * 要么卡顿（慢机器），AIMD 让同一份代码在所有硬件上自己找到合适的块大小。
 */
const CHUNK = 200;
const MAX_CHUNK = 3200;
/** 预算约四个空闲帧：tick 固定成本含对既有行的 keyed diff（随 N 增长），且补齐跑在
 *  idle 期不占交互路径——预算太紧会把块压死在地板，反而拉长总时长（tick 数变多） */
const FRAME_BUDGET_MS = 96;
const scheduleGrow: (cb: () => void) => number =
  typeof requestIdleCallback === 'function'
    ? (cb) => requestIdleCallback(cb, { timeout: 200 })
    : (cb) => window.setTimeout(cb, 16) as unknown as number;
// 兜底分支的 window 访问必须延迟到调用时：SSR（Node）没有 window，模块作用域直接取会炸
const cancelGrow: (id: number) => void =
  typeof cancelIdleCallback === 'function'
    ? (id) => cancelIdleCallback(id)
    : (id) => window.clearTimeout(id);

const progressiveOn = computed(() => shouldVirtualize(sortedRows.value.length, props.progressive !== false));
const renderedCount = ref<number>(Number.POSITIVE_INFINITY);
const visibleRows = computed(() => sortedRows.value.slice(0, renderedCount.value));
let growId: number | null = null;
let nextChunk = CHUNK;
let disposed = false;

function grow() {
  growId = null;
  const total = sortedRows.value.length;
  const chunk = nextChunk;
  renderedCount.value = Math.min(renderedCount.value + chunk, total);
  const startedAt = performance.now();
  nextTick(() => {
    if (disposed) return;
    const patchMs = performance.now() - startedAt;
    nextChunk =
      patchMs <= FRAME_BUDGET_MS
        ? Math.min(chunk * 2, MAX_CHUNK)
        : Math.max(Math.round(chunk / 2), CHUNK);
    if (renderedCount.value < total) growId = scheduleGrow(grow);
  });
}

watch(
  sortedRows,
  (rows) => {
    if (growId !== null) cancelGrow(growId);
    growId = null;
    nextChunk = CHUNK;
    if (!progressiveOn.value) {
      renderedCount.value = Number.POSITIVE_INFINITY;
      return;
    }
    renderedCount.value = Math.min(CHUNK, rows.length);
    if (renderedCount.value < rows.length) growId = scheduleGrow(grow);
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  disposed = true;
  if (growId !== null) cancelGrow(growId);
});
</script>

<template>
  <div :class="css.wrap">
    <table :class="css.root" :data-striped="striped || undefined">
      <thead>
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            :class="css.th"
            :style="{ width: column.width, textAlign: column.align ?? 'left' }"
            scope="col"
            :aria-sort="column.sortable ? ariaSort(column) : undefined"
          >
            <button
              v-if="column.sortable"
              :class="css.sorter"
              type="button"
              @click="toggleSort(column)"
            >
              {{ column.title }}
              <svg
                :class="css.arrow"
                :data-order="sort?.key === column.key ? sort.order : 'none'"
                viewBox="0 0 10 12"
                aria-hidden="true"
              >
                <path d="M5 1 L8.5 5 L1.5 5 Z" />
                <path d="M5 11 L1.5 7 L8.5 7 Z" />
              </svg>
            </button>
            <template v-else>{{ column.title }}</template>
          </th>
        </tr>
      </thead>

      <!-- 排序/过滤导致行序变化时，行按 key 复用并靠 move 过渡滑到新位置，而不是瞬移 -->
      <TransitionGroup tag="tbody" :class="css.tbody" :move-class="css.rowMove">
        <tr
          v-for="(row, index) in visibleRows"
          :key="String(row[rowKey] ?? index)"
          :class="[css.tr, virtualOn && vcss.row]"
          :data-virtual="virtualOn || undefined"
          :style="{ '--_i': index }"
        >
          <td
            v-for="column in columns"
            :key="column.key"
            :class="css.td"
            :style="{ textAlign: column.align ?? 'left' }"
          >
            <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]" :index="index">
              {{ row[column.key] }}
            </slot>
          </td>
        </tr>
      </TransitionGroup>

      <tbody v-if="!sortedRows.length">
        <tr>
          <td :class="css.empty" :colspan="columns.length">
            <slot name="empty">{{ emptyText ?? m.tableEmpty }}</slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
