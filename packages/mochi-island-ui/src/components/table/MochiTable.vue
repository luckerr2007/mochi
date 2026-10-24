<script setup lang="ts">
import { computed, ref, TransitionGroup } from 'vue';
import type { MochiTableColumn, MochiTableSort } from './types';
import css from './MochiTable.module.css';
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
  }>(),
  { rowKey: 'id' },
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
          v-for="(row, index) in sortedRows"
          :key="String(row[rowKey] ?? index)"
          :class="css.tr"
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
