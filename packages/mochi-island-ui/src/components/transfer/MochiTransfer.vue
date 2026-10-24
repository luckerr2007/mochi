<script setup lang="ts">
import { computed, ref, type Ref } from 'vue';
import MochiCheckbox from '../checkbox/MochiCheckbox.vue';
import type { MochiTransferItem } from './types';
import css from './MochiTransfer.module.css';
import { useMessages } from '../../locale';

defineOptions({ name: 'MochiTransfer' });

const m = useMessages();

const props = withDefaults(
  defineProps<{
    data: MochiTransferItem[];
    /** 两侧面板的标题，[左侧, 右侧] */
    titles?: [string, string];
    /** 是否显示各面板的搜索框 */
    searchable?: boolean;
    /** 无数据文案 */
    emptyText?: string;
  }>(),
  { searchable: false },
);

const emit = defineEmits<{ change: [string[]] }>();

/** 右侧面板持有的 key 集合。数组模型不给 default（类型会退化），用 computed 代理兜底空数组 */
const modelValue = defineModel<string[]>();
const model = computed<string[]>({
  get: () => modelValue.value ?? [],
  set: (keys) => {
    modelValue.value = keys;
  },
});

const sides = ['left', 'right'] as const;
type Side = (typeof sides)[number];

const checked: Record<Side, Ref<Set<string>>> = {
  left: ref(new Set<string>()),
  right: ref(new Set<string>()),
};
const queries = ref({ left: '', right: '' });
/** 未传 titles 时跟随语言 */
const panelTitles = computed(() => props.titles ?? [m.value.transferUnselected, m.value.transferSelected]);

const leftItems = computed(() => props.data.filter((item) => !model.value.includes(item.key)));
const rightItems = computed(() => props.data.filter((item) => model.value.includes(item.key)));

/** 搜索只影响可见性，不影响勾选状态本身 */
function visible(side: Side) {
  const items = side === 'left' ? leftItems.value : rightItems.value;
  const q = queries.value[side].trim().toLowerCase();
  if (!q) return items;
  return items.filter((item) => item.label.toLowerCase().includes(q));
}

function isChecked(side: Side, key: string) {
  return checked[side].value.has(key);
}

/** 面板勾选框的状态：全选 / 半选 / 未选，只统计可见且未禁用的项 */
function summary(side: Side) {
  const available = visible(side).filter((item) => !item.disabled);
  const count = available.filter((item) => isChecked(side, item.key)).length;
  return {
    count,
    total: available.length,
    all: available.length > 0 && count === available.length,
    some: count > 0 && count < available.length,
  };
}

function toggleCheck(side: Side, key: string, value: boolean) {
  const next = new Set(checked[side].value);
  if (value) next.add(key);
  else next.delete(key);
  checked[side].value = next;
}

function toggleAll(side: Side) {
  const state = summary(side);
  const next = new Set(checked[side].value);
  for (const item of visible(side)) {
    if (item.disabled) continue;
    if (state.all) next.delete(item.key);
    else next.add(item.key);
  }
  checked[side].value = next;
}

function move(toRight: boolean) {
  const side: Side = toRight ? 'left' : 'right';
  const source = checked[side].value;
  const pool = toRight ? leftItems.value : rightItems.value;
  const keys = [...source].filter((key) => pool.some((item) => item.key === key && !item.disabled));
  if (!keys.length) return;

  // 顺序始终跟随 data 的声明顺序，不跟随移动先后
  model.value = toRight
    ? props.data.filter((item) => model.value.includes(item.key) || keys.includes(item.key)).map((item) => item.key)
    : model.value.filter((key) => !keys.includes(key));
  emit('change', model.value);

  checked[side].value = new Set();
}
</script>

<template>
  <div :class="css.root">
    <section v-for="side in sides" :key="side" :class="css.panel" :aria-label="side === 'left' ? panelTitles[0] : panelTitles[1]">
      <header :class="css.header">
        <MochiCheckbox
          :model-value="summary(side).all"
          :data-indeterminate="summary(side).some || undefined"
          @update:model-value="toggleAll(side)"
        >
          <!-- accname 必须来自 label 内容（包裹层上的 aria-label 传不到 input），视觉上隐藏 -->
          <span :class="css.srOnly">全选{{ side === 'left' ? panelTitles[0] : panelTitles[1] }}</span>
        </MochiCheckbox>
        <span :class="css.title">{{ side === 'left' ? panelTitles[0] : panelTitles[1] }}</span>
        <span :class="css.count">{{ summary(side).count }} / {{ summary(side).total }}</span>
      </header>

      <div v-if="searchable" :class="css.search">
        <input
          v-model="queries[side]"
          :class="css.searchInput"
          type="search"
          :placeholder="m.transferSearch(side === 'left' ? panelTitles[0] : panelTitles[1])"
          :aria-label="m.transferSearch(side === 'left' ? panelTitles[0] : panelTitles[1])"
        />
      </div>

      <div :class="css.listbox">
        <!-- 增删项走 TransitionGroup：离场绝对定位，留下的项靠 move 平滑补位 -->
        <TransitionGroup
          tag="ul"
          :class="css.list"
          :enter-active-class="css.rowEnter"
          :leave-active-class="side === 'left' ? css.rowLeaveRight : css.rowLeaveLeft"
          :move-class="css.rowMove"
        >
          <li v-for="item in visible(side)" :key="item.key" :class="css.row">
            <MochiCheckbox
              :model-value="isChecked(side, item.key)"
              :disabled="item.disabled"
              @update:model-value="(value: boolean) => toggleCheck(side, item.key, value)"
            >
              {{ item.label }}
            </MochiCheckbox>
          </li>
        </TransitionGroup>
        <p v-if="!visible(side).length" :class="css.empty">{{ emptyText ?? m.transferEmpty }}</p>
      </div>
    </section>

    <div :class="css.actions">
      <button
        :class="css.move"
        type="button"
        :disabled="!summary('left').count"
        :aria-label="m.transferToRight"
        @click="move(true)"
      >
        <svg viewBox="0 0 14 12" aria-hidden="true" focusable="false">
          <path d="M2 6 H12 M8 2 L12 6 L8 10" />
        </svg>
      </button>
      <button
        :class="css.move"
        type="button"
        :disabled="!summary('right').count"
        :aria-label="m.transferToLeft"
        @click="move(false)"
      >
        <svg viewBox="0 0 14 12" aria-hidden="true" focusable="false">
          <path d="M12 6 H2 M6 2 L2 6 L6 10" />
        </svg>
      </button>
    </div>
  </div>
</template>
