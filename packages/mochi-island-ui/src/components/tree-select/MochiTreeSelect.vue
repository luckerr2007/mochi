<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import FieldShell from '../../internal/FieldShell.vue'
import MochiPopover from '../popover/MochiPopover.vue'
import MochiTree from '../tree/MochiTree.vue'
import type { MochiTreeNode } from '../tree/types'
import css from './MochiTreeSelect.module.css'
import { useMessages } from '../../locale'

defineOptions({ name: 'MochiTreeSelect' })

const m = useMessages()

const props = withDefaults(
  defineProps<{
    data: MochiTreeNode[]
    label?: string
    hint?: string
    placeholder?: string
    disabled?: boolean
    invalid?: boolean
    defaultExpandAll?: boolean
  }>(),
  { defaultExpandAll: true },
)

const model = defineModel<string>({ default: '' })

const open = ref(false)
const fieldId = useId()
const hintId = computed(() => `${fieldId}-hint`)

function findLabel(nodes: MochiTreeNode[], key: string): string {
  for (const node of nodes) {
    if (node.key === key) return node.label
    if (node.children) {
      const label = findLabel(node.children, key)
      if (label) return label
    }
  }
  return ''
}

const text = computed(() => (model.value ? findLabel(props.data, model.value) : ''))

function pick(key: string) {
  if (!key) return
  model.value = key
  open.value = false
}
</script>

<template>
  <FieldShell :label="label" :hint="hint" :field-id="fieldId" :hint-id="hintId" :invalid="invalid">
    <MochiPopover v-model:open="open" width="260px" bare>
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
          <span :class="css.text" :data-placeholder="!text || undefined">{{
            text || (placeholder ?? m.selectPlaceholder)
          }}</span>
          <svg :class="css.icon" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M2 4.5 L6 8.5 L10 4.5" />
          </svg>
        </button>
      </template>

      <div :class="css.panel">
        <MochiTree
          :data="data"
          :selected="model"
          :default-expand-all="defaultExpandAll"
          :label="label ?? m.treeSelectList"
          @update:selected="pick"
        />
      </div>
    </MochiPopover>
  </FieldShell>
</template>
