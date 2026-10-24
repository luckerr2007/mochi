<script setup lang="ts">
import { computed } from 'vue';
import css from './MochiSlider.module.css';

defineOptions({ name: 'MochiSlider' });

const props = withDefaults(
  defineProps<{
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    showValue?: boolean;
    label?: string;
  }>(),
  { min: 0, max: 100, step: 1, showValue: false, label: '滑块' },
);

const model = defineModel<number>({ default: 0 });

const percent = computed(() => {
  const span = props.max - props.min || 1;
  return Math.min(100, Math.max(0, ((model.value - props.min) / span) * 100));
});
</script>

<template>
  <div :class="css.root" :data-disabled="disabled || undefined">
    <div :class="css.track">
      <span :class="css.fill" :style="{ width: `${percent}%` }" />
      <span :class="css.thumb" :style="{ left: `${percent}%` }" />
      <!-- 原生 range 铺在最上层：拖拽、键盘、读屏全部免费，只是把自己藏起来 -->
      <input
        v-model.number="model"
        :class="css.control"
        type="range"
        :min="min"
        :max="max"
        :step="step"
        :disabled="disabled"
        :aria-label="label"
      />
    </div>
    <output v-if="showValue" :class="css.value">{{ model }}</output>
  </div>
</template>
