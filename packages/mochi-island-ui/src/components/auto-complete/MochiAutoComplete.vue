<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue';
import FieldShell from '../../internal/FieldShell.vue';
import MochiPopover from '../popover/MochiPopover.vue';
import css from './MochiAutoComplete.module.css';
import { useMessages } from '../../locale';

defineOptions({ name: 'MochiAutoComplete' });

const m = useMessages();

const props = withDefaults(
  defineProps<{
    options: string[];
    label?: string;
    hint?: string;
    placeholder?: string;
    disabled?: boolean;
    invalid?: boolean;
    /** 最多展示几条建议 */
    limit?: number;
  }>(),
  { limit: 8 },
);

const emit = defineEmits<{ select: [string] }>();

const model = defineModel<string>({ default: '' });

const open = ref(false);
const highlight = ref(-1);
const fieldId = useId();
const listId = computed(() => `${fieldId}-list`);
const hintId = computed(() => `${fieldId}-hint`);

const suggestions = computed(() => {
  const query = model.value.trim().toLowerCase();
  const matched = query
    ? props.options.filter((option) => option.toLowerCase().includes(query))
    : props.options;
  return matched.slice(0, props.limit);
});

function move(step: 1 | -1) {
  if (!suggestions.value.length) return;
  const total = suggestions.value.length;
  highlight.value = (highlight.value + step + total) % total;
}

function choose(option: string) {
  model.value = option;
  highlight.value = -1;
  open.value = false;
  emit('select', option);
}

function onEnter() {
  const option = suggestions.value[highlight.value];
  if (option) choose(option);
}

/** 打开时高亮归零；输入变化也归零，避免高亮停在已经被过滤掉的项上 */
watch([open, model], () => {
  highlight.value = -1;
});
</script>

<template>
  <FieldShell :label="label" :hint="hint" :field-id="fieldId" :hint-id="hintId" :invalid="invalid">
    <MochiPopover v-model:open="open" width="100%" bare>
      <template #trigger>
        <input
          :id="fieldId"
          v-model="model"
          :class="css.control"
          type="text"
          :placeholder="placeholder ?? m.autoCompletePlaceholder"
          :disabled="disabled"
          :invalid="invalid || undefined"
          role="combobox"
          :aria-expanded="open ? 'true' : 'false'"
          aria-autocomplete="list"
          :aria-controls="listId"
          autocomplete="off"
          @focus="open = true"
          @input="open = true"
          @keydown.down.prevent="move(1)"
          @keydown.up.prevent="move(-1)"
          @keydown.enter.prevent="onEnter"
        />
      </template>

      <ul :id="listId" :class="css.list" role="listbox" :aria-label="label ?? m.autoCompleteList">
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
        <li v-if="!suggestions.length" :class="css.empty">{{ m.autoCompleteEmpty }}</li>
      </ul>
    </MochiPopover>
  </FieldShell>
</template>
