<script setup lang="ts">
import { ref } from 'vue'
import MochiPopover from '../popover/MochiPopover.vue'
import MochiButton from '../button/MochiButton.vue'
import css from './MochiPopconfirm.module.css'
import { useMessages } from '../../locale'

defineOptions({ name: 'MochiPopconfirm' })

const m = useMessages()

withDefaults(
  defineProps<{
    title: string
    description?: string
    confirmText?: string
    cancelText?: string
    /** 危险操作用 danger，确认按钮会换成危险色 */
    tone?: 'default' | 'danger'
  }>(),
  { tone: 'default' },
)

const emit = defineEmits<{ confirm: []; cancel: [] }>()

const open = ref(false)

function confirm() {
  open.value = false
  emit('confirm')
}

function cancel() {
  open.value = false
  emit('cancel')
}
</script>

<template>
  <MochiPopover v-model:open="open" width="260px">
    <template #trigger="{ open: isOpen }">
      <span :class="css.trigger" :aria-expanded="isOpen ? 'true' : 'false'">
        <slot name="trigger" />
      </span>
    </template>

    <p :class="css.title">{{ title }}</p>
    <p v-if="description" :class="css.desc">{{ description }}</p>

    <div :class="css.actions">
      <MochiButton size="sm" variant="ghost" @click="cancel">{{
        cancelText ?? m.cancel
      }}</MochiButton>
      <MochiButton size="sm" :class="tone === 'danger' ? css.danger : ''" @click="confirm">
        {{ confirmText ?? m.confirm }}
      </MochiButton>
    </div>
  </MochiPopover>
</template>
