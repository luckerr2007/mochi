<script setup lang="ts">
import { ref } from 'vue';
import MochiPopover from '../popover/MochiPopover.vue';
import type { MochiDropdownItem } from './types';
import css from './MochiDropdown.module.css';

defineOptions({ name: 'MochiDropdown' });

withDefaults(defineProps<{ items: MochiDropdownItem[]; width?: string }>(), { width: '180px' });

const emit = defineEmits<{ select: [string] }>();

const open = ref(false);

function choose(item: MochiDropdownItem) {
  if (item.disabled) return;
  open.value = false;
  emit('select', item.key);
}

/** ↑↓ 在可用项之间移动焦点，↑ 从第一项回绕到末项 */
function move(event: KeyboardEvent, step: 1 | -1) {
  const nodes = [...(event.currentTarget as HTMLElement).querySelectorAll<HTMLElement>(
    '[role="menuitem"]:not([disabled])',
  )];
  if (!nodes.length) return;
  const index = nodes.indexOf(document.activeElement as HTMLElement);
  const next = nodes[(index + step + nodes.length) % nodes.length];
  next?.focus();
}
</script>

<template>
  <MochiPopover v-model:open="open" :width="width" panel-role="menu">
    <template #trigger="{ attrs }">
      <span v-bind="attrs" :class="css.trigger"><slot name="trigger" /></span>
    </template>

    <div :class="css.list" @keydown.down.prevent="move($event, 1)" @keydown.up.prevent="move($event, -1)">
      <template v-for="(item, index) in items" :key="item.key">
        <hr v-if="item.divider" :class="css.divider" />
        <button
          :class="css.item"
          type="button"
          role="menuitem"
          :style="{ '--_i': index }"
          :disabled="item.disabled"
          @click="choose(item)"
        >
          {{ item.label }}
        </button>
      </template>
    </div>
  </MochiPopover>
</template>
