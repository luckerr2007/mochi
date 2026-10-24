<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue';
import FieldShell from '../../internal/FieldShell.vue';
import MochiPopover from '../popover/MochiPopover.vue';
import MochiCalendar from '../calendar/MochiCalendar.vue';
import css from './MochiDatePicker.module.css';
import { useMessages } from '../../locale';

defineOptions({ name: 'MochiDatePicker' });

const m = useMessages();

withDefaults(
  defineProps<{
    label?: string;
    hint?: string;
    placeholder?: string;
    disabled?: boolean;
    invalid?: boolean;
  }>(),
  {},
);

const model = defineModel<Date | null>({ default: null });

const open = ref(false);
const fieldId = useId();
const hintId = computed(() => `${fieldId}-hint`);

const text = computed(() => {
  const date = model.value;
  if (!date) return '';
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
});

// 选完立刻收起，不让用户再点一次
watch(model, () => {
  if (open.value) open.value = false;
});
</script>

<template>
  <FieldShell :label="label" :hint="hint" :field-id="fieldId" :hint-id="hintId" :invalid="invalid">
    <MochiPopover v-model:open="open" width="272px" bare>
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
          <span :class="css.text" :data-placeholder="!text || undefined">{{ text || (placeholder ?? m.datePickerPlaceholder) }}</span>
          <svg :class="css.icon" viewBox="0 0 16 16" aria-hidden="true">
            <rect x="2.5" y="3.5" width="11" height="10" rx="2" />
            <path d="M2.5 6.5 H13.5 M5.5 2 V5 M10.5 2 V5" />
          </svg>
        </button>
      </template>

      <MochiCalendar v-model="model" label="选择日期" />
    </MochiPopover>
  </FieldShell>
</template>
