<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, useId, watch } from 'vue';
import FieldShell from '../../internal/FieldShell.vue';
import type { MochiSelectOption } from './types';
import css from './MochiSelect.module.css';
import vcss from '../../styles/virtual.module.css';
import { shouldVirtualize } from '../../styles/virtual';
import { useMessages } from '../../locale';

defineOptions({ name: 'MochiSelect' });

const m = useMessages();

const props = withDefaults(
  defineProps<{
    options: MochiSelectOption[];
    label?: string;
    hint?: string;
    /** 未选择时的占位文案 */
    placeholder?: string;
    disabled?: boolean;
    invalid?: boolean;
    /**
     * CSS 虚拟化（opt-in）：选项超阈值时给选项加 content-visibility，
     * 弹层里屏外选项跳过布局/绘制、DOM 保留。超长选项列表再开。
     */
    virtual?: boolean;
  }>(),
  { virtual: false },
);

const model = defineModel<string>({ default: '' });

const fieldId = useId();
const hintId = computed(() => `${fieldId}-hint`);
const listId = computed(() => `${fieldId}-list`);

const open = ref(false);
const dropUp = ref(false);
const activeIndex = ref(-1);
const trigger = ref<HTMLButtonElement>();
const root = ref<HTMLElement>();
const listEl = ref<HTMLElement>();
/** 滑动高亮块的位置：JS 量一次 active 选项再交给 CSS 弹簧过渡（同 Tabs 指示块） */
const indicator = ref({ top: 0, height: 0 });
/** 首次定位不播过渡，定位完才开弹簧，避免打开时从 0 滑过去 */
const indicatorReady = ref(false);

const selected = computed(() => props.options.find((option) => option.value === model.value));
const enabledIndexes = computed(() =>
  props.options.map((option, index) => (option.disabled ? -1 : index)).filter((index) => index >= 0),
);
const virtualOn = computed(() => shouldVirtualize(props.options.length, props.virtual !== false));

function show() {
  if (props.disabled) return;
  open.value = true;

  const rect = trigger.value?.getBoundingClientRect();
  // 按选项数量估算弹层高度（每项约 40px，上限 240），放不下才向上开
  const needed = Math.min(240, props.options.length * 40 + 8);
  dropUp.value = rect ? rect.bottom + needed + 8 > window.innerHeight : false;

  const current = props.options.findIndex((option) => option.value === model.value);
  activeIndex.value = current >= 0 ? current : (enabledIndexes.value[0] ?? -1);
}

function close(focusBack = false) {
  open.value = false;
  activeIndex.value = -1;
  if (focusBack) trigger.value?.focus();
}

function toggle() {
  if (open.value) close();
  else show();
}

function pick(option: MochiSelectOption) {
  if (option.disabled) return;
  model.value = option.value;
  close(true);
}

function move(step: number) {
  const list = enabledIndexes.value;
  if (!list.length) return;
  const current = list.indexOf(activeIndex.value);
  const next = list[(current + step + list.length) % list.length];
  if (next !== undefined) activeIndex.value = next;
}

function syncIndicator() {
  const active = listEl.value?.querySelector<HTMLElement>('[data-active="true"]');
  if (!active) return;
  indicator.value = { top: active.offsetTop, height: active.offsetHeight };
}

watch(activeIndex, () => nextTick(syncIndicator));

function onKeydown(event: KeyboardEvent) {
  if (props.disabled) return;

  const handled = ['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter', ' ', 'Escape'];
  if (!handled.includes(event.key)) return;
  event.preventDefault();

  if (!open.value) {
    if (event.key !== 'Escape') show();
    return;
  }

  if (event.key === 'ArrowDown') move(1);
  else if (event.key === 'ArrowUp') move(-1);
  else if (event.key === 'Home') activeIndex.value = enabledIndexes.value[0] ?? -1;
  else if (event.key === 'End') activeIndex.value = enabledIndexes.value.at(-1) ?? -1;
  else if (event.key === 'Escape') close(true);
  else {
    const option = props.options[activeIndex.value];
    if (option) pick(option);
  }
}

// 弹层打开时滚到当前项（jsdom 没有 scrollIntoView，可选调用）；
// 高亮块先无过渡定位，下一帧再开弹簧
watch(open, async (isOpen) => {
  if (!isOpen) {
    indicatorReady.value = false;
    return;
  }
  await nextTick();
  syncIndicator();
  requestAnimationFrame(() => {
    indicatorReady.value = true;
  });
  const active = root.value?.querySelector<HTMLElement>('[data-active="true"]');
  active?.scrollIntoView?.({ block: 'nearest' });
});

// 点击外部关闭
function onPointerDown(event: PointerEvent) {
  if (open.value && root.value && !root.value.contains(event.target as Node)) close();
}

watch(open, (isOpen) => {
  if (isOpen) document.addEventListener('pointerdown', onPointerDown);
  else document.removeEventListener('pointerdown', onPointerDown);
});

onBeforeUnmount(() => document.removeEventListener('pointerdown', onPointerDown));
</script>

<template>
  <div ref="root" :class="css.root">
    <FieldShell
      :label="label"
      :hint="hint"
      :field-id="fieldId"
      :hint-id="hintId"
      :invalid="invalid"
    >
      <button
        :id="fieldId"
        ref="trigger"
        :class="css.trigger"
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        :aria-expanded="open"
        :aria-controls="listId"
        :aria-invalid="invalid || undefined"
        :aria-describedby="hint ? hintId : undefined"
        :disabled="disabled"
        @click="toggle"
        @keydown="onKeydown"
      >
        <span :class="css.value" :data-placeholder="!selected || undefined">
          {{ selected?.label ?? (placeholder ?? m.selectPlaceholder) }}
        </span>
        <svg :class="css.chevron" :data-open="open" viewBox="0 0 12 12" aria-hidden="true">
          <path d="M2 4.5 L6 8.5 L10 4.5" />
        </svg>
      </button>

      <!-- 弹层挂在输入槽内，absolute 以槽为定位基准 -->
      <Transition :enter-active-class="css.popEnter" :leave-active-class="css.popLeave">
        <ul
          v-if="open"
          :id="listId"
          ref="listEl"
          :class="css.list"
          role="listbox"
        >
          <span
            :class="css.indicator"
            :data-ready="indicatorReady || undefined"
            :style="{ transform: `translateY(${indicator.top}px)`, height: `${indicator.height}px` }"
            aria-hidden="true"
          />
          <li
            v-for="(option, index) in options"
            :key="option.value"
            :class="[css.option, virtualOn && vcss.row]"
            role="option"
            :data-virtual="virtualOn || undefined"
            :aria-selected="option.value === model"
            :aria-disabled="option.disabled || undefined"
            :data-active="index === activeIndex || undefined"
            :data-selected="option.value === model || undefined"
            @click="pick(option)"
            @mouseenter="!option.disabled && (activeIndex = index)"
          >
            {{ option.label }}
          </li>
        </ul>
      </Transition>
    </FieldShell>
  </div>
</template>
