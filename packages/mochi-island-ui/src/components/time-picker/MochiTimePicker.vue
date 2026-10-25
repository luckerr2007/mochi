<script setup lang="ts">
import { computed, nextTick, ref, useId, watch } from 'vue'
import FieldShell from '../../internal/FieldShell.vue'
import MochiPopover from '../popover/MochiPopover.vue'
import css from './MochiTimePicker.module.css'
import { useMessages } from '../../locale'

defineOptions({ name: 'MochiTimePicker' })

const m = useMessages()

withDefaults(
  defineProps<{
    label?: string
    hint?: string
    placeholder?: string
    disabled?: boolean
    invalid?: boolean
  }>(),
  {},
)

const model = defineModel<string>({ default: '' })

const open = ref(false)
const hourCol = ref<HTMLElement>()
const minuteCol = ref<HTMLElement>()
const fieldId = useId()
const hintId = computed(() => `${fieldId}-hint`)

const hours = Array.from({ length: 24 }, (_, index) => index)
const minutes = Array.from({ length: 60 }, (_, index) => index)

const hour = computed(() => (model.value ? Number(model.value.split(':')[0]) : null))
const minute = computed(() => (model.value ? Number(model.value.split(':')[1]) : null))

const pad = (value: number) => String(value).padStart(2, '0')

function pick(nextHour: number, nextMinute: number) {
  model.value = `${pad(nextHour)}:${pad(nextMinute)}`
  open.value = false
}

/** 打开时把已选项滚到列中间，不然用户还要自己找 */
watch(open, async (isOpen) => {
  if (!isOpen) return
  await nextTick()
  hourCol.value?.querySelector<HTMLElement>('[data-selected]')?.scrollIntoView({ block: 'center' })
  minuteCol.value
    ?.querySelector<HTMLElement>('[data-selected]')
    ?.scrollIntoView({ block: 'center' })
})
</script>

<template>
  <FieldShell :label="label" :hint="hint" :field-id="fieldId" :hint-id="hintId" :invalid="invalid">
    <MochiPopover v-model:open="open" width="180px" bare>
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
          <span :class="css.text" :data-placeholder="!model || undefined">{{
            model || placeholder
          }}</span>
          <svg :class="css.icon" viewBox="0 0 16 16" aria-hidden="true">
            <circle cx="8" cy="8" r="6" />
            <path d="M8 4.8 V8 L10.4 9.6" />
          </svg>
        </button>
      </template>

      <div :class="css.panel">
        <ul ref="hourCol" :class="css.col" :aria-label="m.hourColumn">
          <li v-for="h in hours" :key="h">
            <button
              :class="css.option"
              type="button"
              :data-selected="h === hour || undefined"
              :aria-pressed="h === hour || undefined"
              @click="pick(h, minute ?? 0)"
            >
              {{ pad(h) }}
            </button>
          </li>
        </ul>

        <span :class="css.sep" aria-hidden="true">:</span>

        <ul ref="minuteCol" :class="css.col" :aria-label="m.minuteColumn">
          <li v-for="mm in minutes" :key="mm">
            <button
              :class="css.option"
              type="button"
              :data-selected="mm === minute || undefined"
              :aria-pressed="mm === minute || undefined"
              @click="pick(hour ?? 0, mm)"
            >
              {{ pad(mm) }}
            </button>
          </li>
        </ul>
      </div>
    </MochiPopover>
  </FieldShell>
</template>
