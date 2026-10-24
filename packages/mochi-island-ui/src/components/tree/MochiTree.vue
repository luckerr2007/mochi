<script setup lang="ts">
import { ref } from 'vue';
import MochiTreeRow from './MochiTreeRow.vue';
import type { MochiTreeNode } from './types';
import css from './MochiTree.module.css';

defineOptions({ name: 'MochiTree' });

const props = withDefaults(
  defineProps<{
    data: MochiTreeNode[];
    defaultExpandAll?: boolean;
    label?: string;
  }>(),
  { defaultExpandAll: false, label: '树' },
);

const selected = defineModel<string>('selected', { default: '' });

function collectExpandable(nodes: MochiTreeNode[]): string[] {
  return nodes.flatMap((node) =>
    node.children?.length ? [node.key, ...collectExpandable(node.children)] : [],
  );
}

const expandedKeys = ref<string[]>(
  props.defaultExpandAll ? collectExpandable(props.data) : [],
);

function toggle(node: MochiTreeNode) {
  expandedKeys.value = expandedKeys.value.includes(node.key)
    ? expandedKeys.value.filter((key) => key !== node.key)
    : [...expandedKeys.value, node.key];
}

function select(node: MochiTreeNode) {
  if (node.disabled) return;
  selected.value = node.key;
}
</script>

<template>
  <ul :class="css.root" role="tree" :aria-label="label">
    <MochiTreeRow
      v-for="node in data"
      :key="node.key"
      :node="node"
      :depth="0"
      :selected-key="selected"
      :expanded-keys="expandedKeys"
      @select="select"
      @toggle="toggle"
    />
  </ul>
</template>
