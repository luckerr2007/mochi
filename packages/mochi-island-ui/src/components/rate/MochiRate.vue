<script setup lang="ts">
import { computed, ref, useId } from 'vue';
import css from './MochiRate.module.css';
import { useMessages } from '../../locale';

defineOptions({ name: 'MochiRate' });

const m = useMessages();

const props = withDefaults(
  defineProps<{
    max?: number;
    readOnly?: boolean;
    /** radiogroup 的无障碍名称 */
    label?: string;
  }>(),
  { max: 5, readOnly: false },
);

const model = defineModel<number>({ default: 0 });

const groupName = useId();
const hovered = ref(0);
/** 悬停时预览到第几颗，移开后回到真实分值 */
const display = computed(() => hovered.value || model.value);
</script>

<template>
  <div
    :class="css.root"
    :data-readonly="readOnly || undefined"
    role="radiogroup"
    :aria-label="label ?? m.rateLabel"
    @pointerleave="hovered = 0"
  >
    <label
      v-for="star in max"
      :key="star"
      :class="css.item"
      :style="{ '--_i': star - 1 }"
      @pointerenter="!readOnly && (hovered = star)"
    >
      <input
        v-model="model"
        :class="css.control"
        type="radio"
        :name="groupName"
        :value="star"
        :disabled="readOnly"
        :aria-label="m.rateStar(star)"
      />
      <svg :class="css.star" :data-filled="star <= display || undefined" viewBox="0 0 20 19" aria-hidden="true">
        <path
          d="M10 1.5 L12.6 6.9 L18.5 7.7 L14.2 11.9 L15.3 17.8 L10 15 L4.7 17.8 L5.8 11.9 L1.5 7.7 L7.4 6.9 Z"
        />
      </svg>
    </label>
  </div>
</template>
