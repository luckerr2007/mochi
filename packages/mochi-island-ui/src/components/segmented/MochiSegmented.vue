<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue';
import type { MochiSegmentedOption } from './types';
import css from './MochiSegmented.module.css';

defineOptions({ name: 'MochiSegmented' });

defineProps<{ options: MochiSegmentedOption[]; label?: string }>();

const model = defineModel<string>({ required: true });
const uid = useId();

const rootEl = ref<HTMLElement>();
const indicator = ref({ left: 0, width: 0 });

function sync() {
  const active = rootEl.value?.querySelector<HTMLElement>('[aria-checked="true"]');
  if (!active) return;
  indicator.value = { left: active.offsetLeft, width: active.offsetWidth };
}

onMounted(() => {
  sync();
  window.addEventListener('resize', sync);
});
onBeforeUnmount(() => window.removeEventListener('resize', sync));
watch(model, () => nextTick(sync));

/** ← → 在选项间移动，与原生 radiogroup 行为一致 */
function move(step: 1 | -1, options: MochiSegmentedOption[]) {
  const usable = options.filter((option) => !option.disabled);
  if (!usable.length) return;
  const index = usable.findIndex((option) => option.value === model.value);
  const next = usable[(index + step + usable.length) % usable.length];
  if (next) model.value = next.value;
}
</script>

<template>
  <div ref="rootEl" :class="css.root" role="radiogroup" :aria-label="label">
    <span
      :class="css.indicator"
      :style="{ transform: `translateX(${indicator.left}px)`, width: `${indicator.width}px` }"
      aria-hidden="true"
    />
    <button
      v-for="option in options"
      :id="`${uid}-${option.value}`"
      :key="option.value"
      :class="css.item"
      type="button"
      role="radio"
      :aria-checked="model === option.value"
      :disabled="option.disabled"
      @click="model = option.value"
      @keydown.left.prevent="move(-1, options)"
      @keydown.right.prevent="move(1, options)"
    >
      {{ option.label }}
    </button>
  </div>
</template>
