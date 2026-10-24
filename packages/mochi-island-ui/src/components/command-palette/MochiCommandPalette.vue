<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue';
import { useOverlay } from '../../internal/useOverlay';
import type { MochiCommand } from './types';
import css from './MochiCommandPalette.module.css';
import { useMessages } from '../../locale';

defineOptions({ name: 'MochiCommandPalette' });

const m = useMessages();

const props = withDefaults(
  defineProps<{
    commands: MochiCommand[];
    placeholder?: string;
    emptyText?: string;
    /** 按下 Cmd/Ctrl+K 自动打开 */
    hotkey?: boolean;
  }>(),
  { hotkey: true },
);

const emit = defineEmits<{ select: [MochiCommand] }>();

const open = defineModel<boolean>('open', { default: false });

const query = ref('');
const highlight = ref(-1);
const inputEl = ref<HTMLInputElement>();
const panel = ref<HTMLElement>();
const uid = useId();
const listId = computed(() => `${uid}-list`);
const { close, onKeydown: onOverlayKeydown } = useOverlay(open, panel);

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return props.commands;
  return props.commands.filter(
    (command) => command.label.toLowerCase().includes(q) || command.key.toLowerCase() === q,
  );
});

const enabledIndexes = computed(() =>
  filtered.value
    .map((command, index) => (command.disabled ? -1 : index))
    .filter((index) => index >= 0),
);

/** 组标题只渲染在每组的第一项之前 */
function isGroupStart(index: number) {
  const command = filtered.value[index];
  if (!command?.group) return false;
  return filtered.value.findIndex((item) => item.group === command.group) === index;
}

function move(step: 1 | -1) {
  const list = enabledIndexes.value;
  if (!list.length) return;
  const current = list.indexOf(highlight.value);
  const next = list[(current + step + list.length) % list.length];
  if (next !== undefined) highlight.value = next;
}

function pick(command: MochiCommand) {
  if (command.disabled) return;
  emit('select', command);
  close();
}

function onPaletteKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    move(1);
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    move(-1);
  } else if (event.key === 'Enter') {
    event.preventDefault();
    const command = filtered.value[highlight.value];
    if (command) pick(command);
  } else {
    onOverlayKeydown(event);
  }
}

// 打开时清空旧查询、聚焦搜索框；关闭时还原，下次打开是干净的。
// immediate 兜住「挂载时就带着 open=true」的用法，否则高亮一直是 -1
watch(
  open,
  async (isOpen) => {
    if (!isOpen) return;
    query.value = '';
    highlight.value = enabledIndexes.value[0] ?? -1;
    await nextTick();
    inputEl.value?.focus();
  },
  { immediate: true },
);

// 过滤结果变化后，高亮归位到第一个可用项
watch(filtered, () => {
  highlight.value = enabledIndexes.value[0] ?? -1;
});

/** Cmd/Ctrl+K 唤起；搜索框已聚焦或面板开着时不抢 */
function onGlobalKeydown(event: KeyboardEvent) {
  if (!props.hotkey || open.value) return;
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    open.value = true;
  }
}

onMounted(() => document.addEventListener('keydown', onGlobalKeydown));
onBeforeUnmount(() => document.removeEventListener('keydown', onGlobalKeydown));
</script>

<template>
  <Teleport to="body">
    <Transition :enter-active-class="css.fadeIn" :leave-active-class="css.fadeOut">
      <div v-if="open" :class="css.mask" @click.self="close">
        <div
          ref="panel"
          :class="css.panel"
          role="dialog"
          aria-modal="true"
          :aria-label="placeholder ?? m.palettePlaceholder"
          tabindex="-1"
          @keydown="onPaletteKeydown"
        >
          <div :class="css.searchRow">
            <svg :class="css.icon" viewBox="0 0 14 14" aria-hidden="true">
              <circle cx="6" cy="6" r="4.5" />
              <path d="M9.5 9.5 L13 13" />
            </svg>
            <input
              ref="inputEl"
              v-model="query"
              :class="css.input"
              type="text"
              :placeholder="placeholder ?? m.palettePlaceholder"
              role="combobox"
              :aria-expanded="'true'"
              aria-autocomplete="list"
              :aria-controls="listId"
              :aria-activedescendant="
                highlight >= 0 && filtered[highlight] ? `${listId}-${filtered[highlight]!.key}` : undefined
              "
              autocomplete="off"
            />
          </div>

          <ul :id="listId" :class="css.list" role="listbox" :aria-label="placeholder ?? m.palettePlaceholder">
            <template v-for="(command, index) in filtered" :key="command.key">
              <li v-if="isGroupStart(index)" :class="css.group" role="presentation">
                {{ command.group }}
              </li>
              <li
                :id="`${listId}-${command.key}`"
                :class="css.option"
                role="option"
                :aria-selected="index === highlight || undefined"
                :aria-disabled="command.disabled || undefined"
                :data-active="index === highlight || undefined"
                :style="{ '--_i': index }"
                @click="pick(command)"
                @mousemove="!command.disabled && (highlight = index)"
              >
                <span :class="css.label">{{ command.label }}</span>
                <kbd v-if="command.hint" :class="css.kbd">{{ command.hint }}</kbd>
              </li>
            </template>
            <li v-if="!filtered.length" :class="css.empty">{{ emptyText ?? m.paletteEmpty }}</li>
          </ul>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
