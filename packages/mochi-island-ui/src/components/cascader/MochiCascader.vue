<script setup lang="ts">
import { computed, ref, useId } from 'vue';
import FieldShell from '../../internal/FieldShell.vue';
import MochiPopover from '../popover/MochiPopover.vue';
import type { MochiTreeNode } from '../tree/types';
import css from './MochiCascader.module.css';
import { useMessages } from '../../locale';

defineOptions({ name: 'MochiCascader' });

const m = useMessages();

const props = withDefaults(
  defineProps<{
    options: MochiTreeNode[];
    /** 选中值是从根到叶的 key 路径 */
    modelValue?: string[];
    label?: string;
    hint?: string;
    placeholder?: string;
    disabled?: boolean;
    invalid?: boolean;
  }>(),
  {},
);

const emit = defineEmits<{ 'update:modelValue': [string[]] }>();

/** 计算属性代理，绕开 defineModel 对数组默认值的类型限制 */
const model = computed<string[]>({
  get: () => props.modelValue ?? [],
  set: (value) => emit('update:modelValue', value),
});

const open = ref(false);
/** 当前下钻到的层级（每级一个 key），只影响面板里展开到哪一列 */
const path = ref<string[]>([]);
const fieldId = useId();
const hintId = computed(() => `${fieldId}-hint`);

/** 逐层下钻：path 里的每个 key 决定下一列的内容 */
const columns = computed<MochiTreeNode[][]>(() => {
  const list: MochiTreeNode[][] = [props.options];
  let level = props.options;
  for (const key of path.value) {
    const found = level.find((node) => node.key === key);
    if (!found?.children?.length) break;
    level = found.children;
    list.push(level);
  }
  return list;
});

function findLabel(nodes: MochiTreeNode[], key: string): string {
  for (const node of nodes) {
    if (node.key === key) return node.label;
    if (node.children) {
      const label = findLabel(node.children, key);
      if (label) return label;
    }
  }
  return '';
}

const text = computed(
  () => model.value.map((key) => findLabel(props.options, key)).filter(Boolean).join(' / '),
);

function choose(node: MochiTreeNode, level: number) {
  if (node.disabled) return;
  if (node.children?.length) {
    // 有下级：截断该层之后的路径，展开下一列
    path.value = [...path.value.slice(0, level), node.key];
    return;
  }
  model.value = [...path.value.slice(0, level), node.key];
  open.value = false;
}
</script>

<template>
  <FieldShell :label="label" :hint="hint" :field-id="fieldId" :hint-id="hintId" :invalid="invalid">
    <MochiPopover v-model:open="open" width="auto" bare>
      <template #trigger="{ attrs }">
        <button
          :id="fieldId"
          :class="css.trigger"
          type="button"
          :disabled="disabled"
          :aria-invalid="invalid || undefined"
          :aria-describedby="hint ? hintId : undefined"
          v-bind="attrs"
        >
          <span :class="css.text" :data-placeholder="!text || undefined">{{ text || (placeholder ?? m.selectPlaceholder) }}</span>
          <svg :class="css.icon" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M2 4.5 L6 8.5 L10 4.5" />
          </svg>
        </button>
      </template>

      <div :class="css.panel">
        <ul
          v-for="(column, level) in columns"
          :key="level"
          :class="css.column"
          role="listbox"
          :aria-label="m.cascaderLevel(level + 1)"
        >
          <li v-for="node in column" :key="node.key">
            <button
              :class="css.option"
              type="button"
              role="option"
              :aria-selected="model.includes(node.key) || undefined"
              :data-active="path[level] === node.key || undefined"
              :disabled="node.disabled"
              @click="choose(node, level)"
            >
              <span :class="css.optionLabel">{{ node.label }}</span>
              <svg v-if="node.children?.length" :class="css.branch" viewBox="0 0 12 12" aria-hidden="true">
                <path d="M4.5 2.5 L8 6 L4.5 9.5" />
              </svg>
            </button>
          </li>
        </ul>
      </div>
    </MochiPopover>
  </FieldShell>
</template>
