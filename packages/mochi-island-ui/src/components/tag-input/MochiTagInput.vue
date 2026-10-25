<script setup lang="ts">
import { computed, nextTick, ref, useId, watch } from 'vue'
import FieldShell from '../../internal/FieldShell.vue'
import css from './MochiTagInput.module.css'
import { useMessages } from '../../locale'

defineOptions({ name: 'MochiTagInput' })

const m = useMessages()

const props = withDefaults(
  defineProps<{
    label?: string
    hint?: string
    placeholder?: string
    disabled?: boolean
    invalid?: boolean
    /** 最多几个标签，超出后输入不再生效 */
    max?: number
    /** 触发添加的分隔符（回车始终可用） */
    delimiters?: string[]
  }>(),
  { max: 8, delimiters: () => [',', '，', ' '] },
)

const emit = defineEmits<{ add: [string]; remove: [string] }>()

/** 标签集合。数组模型不给 default（类型会退化），用 computed 代理兜底 */
const modelValue = defineModel<string[]>()
const model = computed<string[]>({
  get: () => modelValue.value ?? [],
  set: (value) => {
    modelValue.value = value
  },
})

const draft = ref('')
const inputEl = ref<HTMLInputElement>()
const fieldId = useId()
const hintId = computed(() => `${fieldId}-hint`)

const full = computed(() => model.value.length >= props.max)

/** 空格会打断输入体验，只在确有内容时把空格当作分隔符 */
function onInput() {
  const value = draft.value
  const lastChar = value.slice(-1)
  if (value.length > 1 && props.delimiters.includes(lastChar)) {
    add(value.slice(0, -1))
  }
}

function add(raw: string) {
  const tag = raw.trim()
  draft.value = ''
  if (!tag || model.value.includes(tag) || full.value) return
  model.value = [...model.value, tag]
  emit('add', tag)
}

function remove(tag: string) {
  model.value = model.value.filter((item) => item !== tag)
  emit('remove', tag)
}

/** 退格：输入框为空时删最后一个标签，光标不闪来回 */
function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    event.preventDefault()
    add(draft.value)
  } else if (event.key === 'Backspace' && draft.value === '' && model.value.length) {
    event.preventDefault()
    remove(model.value.at(-1)!)
  }
}

// 标签数达到上限后输入框让位隐藏，避免"能打字却加不进去"的困惑
const showInput = computed(() => !props.disabled && !full.value)

watch(showInput, async (visible) => {
  if (visible) {
    await nextTick()
    inputEl.value?.focus()
  }
})
</script>

<template>
  <FieldShell :label="label" :hint="hint" :field-id="fieldId" :hint-id="hintId" :invalid="invalid">
    <div :class="css.well" :data-disabled="disabled || undefined">
      <!-- 新标签弹入、移除淡出，剩下的靠 move 平滑补位 -->
      <TransitionGroup
        :class="css.tags"
        :enter-active-class="css.tagEnter"
        :leave-active-class="css.tagLeave"
        :move-class="css.tagMove"
      >
        <span v-for="tag in model" :key="tag" :class="css.tag">
          {{ tag }}
          <button
            :class="css.remove"
            type="button"
            :aria-label="`移除 ${tag}`"
            :disabled="disabled"
            @click="remove(tag)"
          >
            <svg viewBox="0 0 8 8" aria-hidden="true" focusable="false">
              <path d="M1.5 1.5 L6.5 6.5 M6.5 1.5 L1.5 6.5" />
            </svg>
          </button>
        </span>
      </TransitionGroup>

      <input
        v-if="showInput"
        :id="fieldId"
        ref="inputEl"
        v-model="draft"
        :class="css.input"
        type="text"
        :placeholder="model.length ? '' : (placeholder ?? m.tagInputPlaceholder)"
        :aria-label="label ?? m.tagInputLabel"
        :aria-describedby="hint ? hintId : undefined"
        :aria-invalid="invalid || undefined"
        autocomplete="off"
        @input="onInput"
        @keydown="onKeydown"
      />
      <span v-else :class="css.fullNote" aria-hidden="true">{{ m.tagInputFull(max) }}</span>
    </div>
  </FieldShell>
</template>
