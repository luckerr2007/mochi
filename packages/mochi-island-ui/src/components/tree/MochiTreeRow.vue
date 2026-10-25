<script setup lang="ts">
import type { MochiTreeNode } from './types'
import css from './MochiTree.module.css'
import vcss from '../../styles/virtual.module.css'

/**
 * 递归行：自己引用自己（名字与文件名一致）。
 * 展开/收起的补间在 .group 上，和 Menu 的分组同一套手法。
 */
defineOptions({ name: 'MochiTreeRow' })

const props = defineProps<{
  node: MochiTreeNode
  depth: number
  selectedKey: string
  expandedKeys: string[]
  /** 由根组件按总节点数算好传下来：行加 content-visibility（CSS 虚拟化） */
  virtual?: boolean
}>()

const emit = defineEmits<{ select: [MochiTreeNode]; toggle: [MochiTreeNode] }>()

const hasChildren = !!props.node.children?.length
const isOpen = () => props.expandedKeys.includes(props.node.key)
</script>

<template>
  <li :class="css.item" role="none">
    <button
      :class="[css.row, virtual && vcss.row]"
      type="button"
      role="treeitem"
      :data-virtual="virtual || undefined"
      :style="{ paddingLeft: `${depth * 16 + 8}px` }"
      :aria-level="depth + 1"
      :aria-selected="selectedKey === node.key || undefined"
      :aria-expanded="hasChildren ? isOpen() : undefined"
      :disabled="node.disabled"
      @click="hasChildren ? emit('toggle', node) : emit('select', node)"
    >
      <span
        :class="css.branch"
        :data-open="hasChildren && isOpen() ? 'true' : 'false'"
        :data-leaf="hasChildren ? undefined : 'true'"
        aria-hidden="true"
      >
        <svg viewBox="0 0 12 12"><path d="M4.5 2.5 L8 6 L4.5 9.5" /></svg>
      </span>
      <span :class="css.label">{{ node.label }}</span>
    </button>

    <div v-if="hasChildren" :class="css.group" :data-open="isOpen() || undefined">
      <ul :class="css.children" role="group">
        <MochiTreeRow
          v-for="child in node.children"
          :key="child.key"
          :node="child"
          :depth="depth + 1"
          :selected-key="selectedKey"
          :expanded-keys="expandedKeys"
          :virtual="virtual"
          @select="emit('select', $event)"
          @toggle="emit('toggle', $event)"
        />
      </ul>
    </div>
  </li>
</template>
