<script setup lang="ts">
import { computed, nextTick, ref, useId, watch } from 'vue';
import FieldShell from '../../internal/FieldShell.vue';
import MochiPopover from '../popover/MochiPopover.vue';
import css from './MochiMentions.module.css';

defineOptions({ name: 'MochiMentions' });

const props = withDefaults(
  defineProps<{
    /** 可提及的对象列表 */
    options: string[];
    /** 触发字符，默认 @ */
    prefix?: string;
    label?: string;
    hint?: string;
    placeholder?: string;
    disabled?: boolean;
    invalid?: boolean;
    /** 最多展示几条建议 */
    limit?: number;
  }>(),
  { prefix: '@', limit: 8 },
);

const emit = defineEmits<{ select: [string] }>();

/** 整段文本；提及的人选完后拼回正文里 */
const model = defineModel<string>({ default: '' });

const open = ref(false);
const highlight = ref(-1);
const query = ref('');
const inputEl = ref<HTMLInputElement>();
const fieldId = useId();
const listId = computed(() => `${fieldId}-list`);
const hintId = computed(() => `${fieldId}-hint`);

const suggestions = computed(() => {
  const q = query.value.toLowerCase();
  const matched = q ? props.options.filter((option) => option.toLowerCase().includes(q)) : props.options;
  return matched.slice(0, props.limit);
});

const placeholderText = computed(() => props.placeholder ?? `输入 ${props.prefix} 唤起提及`);

function onInput(event: Event) {
  model.value = (event.target as HTMLInputElement).value;
  detect();
}

/**
 * 从光标向前找最近的触发字符：prefix 与光标之间不能有空白，
 * 找不到就收起。focus / click / input 都走这里，状态永远与光标一致。
 */
function detect() {
  const el = inputEl.value;
  if (!el || props.disabled) {
    open.value = false;
    return;
  }
  const caret = el.selectionStart ?? el.value.length;
  const before = el.value.slice(0, caret);
  const index = before.lastIndexOf(props.prefix);
  if (index === -1) {
    open.value = false;
    return;
  }
  const q = before.slice(index + props.prefix.length);
  if (/\s/.test(q)) {
    open.value = false;
    return;
  }
  query.value = q;
  open.value = true;
  highlight.value = suggestions.value.length ? 0 : -1;
}

function move(step: 1 | -1) {
  if (!suggestions.value.length) return;
  const total = suggestions.value.length;
  highlight.value = (highlight.value + step + total) % total;
}

function choose(option: string) {
  const el = inputEl.value;
  if (!el) return;
  const caret = el.selectionStart ?? el.value.length;
  const before = el.value.slice(0, caret);
  const index = before.lastIndexOf(props.prefix);
  if (index === -1) return;

  const start = index + props.prefix.length;
  const inserted = props.prefix + option + ' ';
  model.value = before.slice(0, index) + inserted + el.value.slice(caret);
  open.value = false;
  emit('select', option);

  // 光标落在插入内容之后；等模型回写完再定位
  void nextTick(() => {
    const pos = start + option.length + 1;
    el.setSelectionRange(pos, pos);
  });
}

function onEnter() {
  const option = suggestions.value[highlight.value];
  if (option) choose(option);
}

function onKeydown(event: KeyboardEvent) {
  if (!open.value) return;
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    move(1);
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    move(-1);
  } else if (event.key === 'Enter') {
    event.preventDefault();
    onEnter();
  } else if (event.key === 'Escape') {
    open.value = false;
  }
}

// 输入变化后建议列表会重算，高亮别停在已被过滤掉的项上
watch(suggestions, () => {
  highlight.value = suggestions.value.length ? 0 : -1;
});
</script>

<template>
  <FieldShell :label="label" :hint="hint" :field-id="fieldId" :hint-id="hintId" :invalid="invalid">
    <MochiPopover v-model:open="open" width="100%" bare>
      <template #trigger>
        <input
          :id="fieldId"
          ref="inputEl"
          :class="css.control"
          type="text"
          :value="model"
          :placeholder="placeholderText"
          :disabled="disabled"
          :aria-invalid="invalid || undefined"
          role="combobox"
          :aria-expanded="open ? 'true' : 'false'"
          aria-autocomplete="list"
          :aria-controls="listId"
          autocomplete="off"
          @input="onInput"
          @focus="detect"
          @click="detect"
          @keydown="onKeydown"
        />
      </template>

      <ul :id="listId" :class="css.list" role="listbox" :aria-label="label || '提及对象'">
        <li v-for="(option, index) in suggestions" :key="option">
          <button
            :class="css.option"
            type="button"
            role="option"
            :aria-selected="index === highlight || undefined"
            :data-active="index === highlight || undefined"
            :style="{ '--_i': index }"
            @click="choose(option)"
            @mousemove="highlight = index"
          >
            {{ option }}
          </button>
        </li>
        <li v-if="!suggestions.length" :class="css.empty">没有可提及的对象</li>
      </ul>
    </MochiPopover>
  </FieldShell>
</template>
