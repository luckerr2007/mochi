<script setup lang="ts">
import type { MochiStepItem } from './types'
import css from './MochiSteps.module.css'

defineOptions({ name: 'MochiSteps' })

withDefaults(
  defineProps<{
    items: MochiStepItem[]
    /** 当前进行到第几步（0 起） */
    current?: number
  }>(),
  { current: 0 },
)
</script>

<template>
  <ol :class="css.root">
    <li
      v-for="(item, index) in items"
      :key="item.title"
      :class="css.step"
      :data-state="index < current ? 'done' : index === current ? 'current' : 'todo'"
      :aria-current="index === current ? 'step' : undefined"
    >
      <span :class="css.dot">
        <svg v-if="index < current" viewBox="0 0 12 10" aria-hidden="true">
          <path d="M1 5 L4.5 8.5 L11 1.5" />
        </svg>
        <template v-else>{{ index + 1 }}</template>
      </span>

      <span :class="css.text">
        <strong :class="css.title">{{ item.title }}</strong>
        <small v-if="item.description" :class="css.desc">{{ item.description }}</small>
      </span>

      <span v-if="index < items.length - 1" :class="css.line" aria-hidden="true" />
    </li>
  </ol>
</template>
