<script setup lang="ts">
import { ref } from 'vue'
import css from './MochiUpload.module.css'
import { useMessages } from '../../locale'

defineOptions({ name: 'MochiUpload' })

const m = useMessages()

const props = withDefaults(
  defineProps<{
    accept?: string
    multiple?: boolean
    disabled?: boolean
    /** 单文件大小上限（字节） */
    maxSize?: number
    hint?: string
  }>(),
  { multiple: true },
)

const emit = defineEmits<{ change: [File[]] }>()

const files = ref<File[]>([])
const dragging = ref(false)
const input = ref<HTMLInputElement>()

function human(size: number) {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / 1024 / 1024).toFixed(1)} MB`
}

function add(list: File[]) {
  if (props.disabled || !list.length) return
  const accepted = list.filter((file) => !props.maxSize || file.size <= props.maxSize)
  files.value = props.multiple ? [...files.value, ...accepted] : accepted.slice(0, 1)
  emit('change', files.value)
}

function onPick(event: Event) {
  const target = event.target as HTMLInputElement
  add([...(target.files ?? [])])
  target.value = ''
}

function onDrop(event: DragEvent) {
  dragging.value = false
  add([...(event.dataTransfer?.files ?? [])])
}

function remove(index: number) {
  files.value = files.value.filter((_, i) => i !== index)
  emit('change', files.value)
}
</script>

<template>
  <div :class="css.root" :data-disabled="disabled || undefined">
    <label
      :class="css.drop"
      :data-dragging="dragging || undefined"
      @dragover.prevent="dragging = true"
      @dragleave="dragging = false"
      @drop.prevent="onDrop"
    >
      <input
        ref="input"
        :class="css.input"
        type="file"
        :accept="accept"
        :multiple="multiple"
        :disabled="disabled"
        @change="onPick"
      />

      <svg :class="css.icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 16 V4 M7 9 L12 4 L17 9" />
        <path d="M4 16 V19 A1 1 0 0 0 5 20 H19 A1 1 0 0 0 20 19 V16" />
      </svg>

      <span :class="css.hint">{{ hint ?? m.uploadHint }}</span>
      <span v-if="maxSize" :class="css.limit">单个文件不超过 {{ human(maxSize) }}</span>
    </label>

    <TransitionGroup v-if="files.length" tag="ul" :class="css.list" name="file">
      <li v-for="(file, index) in files" :key="`${file.name}-${index}`" :class="css.item">
        <span :class="css.name">{{ file.name }}</span>
        <span :class="css.size">{{ human(file.size) }}</span>
        <button
          :class="css.remove"
          type="button"
          :aria-label="`移除 ${file.name}`"
          @click="remove(index)"
        >
          <svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2 2 L8 8 M8 2 L2 8" /></svg>
        </button>
      </li>
    </TransitionGroup>
  </div>
</template>
