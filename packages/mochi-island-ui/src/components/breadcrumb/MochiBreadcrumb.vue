<script setup lang="ts">
import type { MochiBreadcrumbItem } from './types'
import css from './MochiBreadcrumb.module.css'
import { useMessages } from '../../locale'

defineOptions({ name: 'MochiBreadcrumb' })

const m = useMessages()

withDefaults(defineProps<{ items: MochiBreadcrumbItem[]; label?: string }>(), {})
</script>

<template>
  <nav :class="css.root" :aria-label="label ?? m.breadcrumbLabel">
    <ol :class="css.list">
      <li v-for="(item, index) in items" :key="item.label" :class="css.item">
        <a v-if="item.href && index < items.length - 1" :class="css.link" :href="item.href">
          {{ item.label }}
        </a>
        <span
          v-else
          :class="css.text"
          :aria-current="index === items.length - 1 ? 'page' : undefined"
        >
          {{ item.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>
