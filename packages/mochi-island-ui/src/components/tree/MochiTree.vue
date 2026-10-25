<script setup lang="ts">
import { computed, ref } from 'vue';
import MochiTreeRow from './MochiTreeRow.vue';
import type { MochiTreeNode } from './types';
import css from './MochiTree.module.css';
import { shouldVirtualize } from '../../styles/virtual';
import { useMessages } from '../../locale';

defineOptions({ name: 'MochiTree' });

const m = useMessages();

const props = withDefaults(
  defineProps<{
    data: MochiTreeNode[];
    defaultExpandAll?: boolean;
    label?: string;
    /**
     * CSS 虚拟化（opt-in）：总节点数超阈值时给行加 content-visibility，
     * 屏外行跳过布局/绘制、DOM 保留。低端设备或超大树再开。
     */
    virtual?: boolean;
  }>(),
  { defaultExpandAll: false, virtual: false },
);

const selected = defineModel<string>('selected', { default: '' });

function collectExpandable(nodes: MochiTreeNode[]): string[] {
  return nodes.flatMap((node) =>
    node.children?.length ? [node.key, ...collectExpandable(node.children)] : [],
  );
}

function countNodes(nodes: MochiTreeNode[]): number {
  return nodes.reduce((sum, node) => sum + 1 + (node.children?.length ? countNodes(node.children) : 0), 0);
}

const expandedKeys = ref<string[]>(
  props.defaultExpandAll ? collectExpandable(props.data) : [],
);

/** 按总节点数判断：全收起时多带几个类无副作用（cv 只跳过屏外行），展开后立即生效 */
const virtualOn = computed(() => shouldVirtualize(countNodes(props.data), props.virtual !== false));

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
  <ul :class="css.root" role="tree" :aria-label="label ?? m.treeLabel">
    <MochiTreeRow
      v-for="node in data"
      :key="node.key"
      :node="node"
      :depth="0"
      :selected-key="selected"
      :expanded-keys="expandedKeys"
      :virtual="virtualOn"
      @select="select"
      @toggle="toggle"
    />
  </ul>
</template>
