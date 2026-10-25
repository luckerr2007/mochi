<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue';
import type { MochiTabItem } from './types';
import css from './MochiTabs.module.css';

defineOptions({ name: 'MochiTabs' });

const props = defineProps<{ items: MochiTabItem[]; label?: string }>();

const model = defineModel<string>({ required: true });
const uid = useId();

const listEl = ref<HTMLElement>();
/** 选中指示块的位置与宽度，靠 JS 量一次再交给 CSS 过渡 */
const indicator = ref({ left: 0, width: 0 });
let ro: ResizeObserver | undefined;

function syncIndicator() {
  const list = listEl.value;
  const active = list?.querySelector<HTMLElement>('[aria-selected="true"]');
  if (!list || !active) return;
  indicator.value = { left: active.offsetLeft, width: active.offsetWidth };
}

onMounted(() => {
  syncIndicator();
  // 在 display:none 的容器里挂载时（如 v-show 分节）量到 0 宽，指示块会塌成竖线；
  // 变可见/字体加载引起的尺寸变化都由 ResizeObserver 兜底重测
  if (typeof ResizeObserver === 'function' && listEl.value) {
    ro = new ResizeObserver(() => syncIndicator());
    ro.observe(listEl.value);
  }
  window.addEventListener('resize', syncIndicator);
});
onBeforeUnmount(() => {
  ro?.disconnect();
  window.removeEventListener('resize', syncIndicator);
});
watch(model, () => nextTick(syncIndicator));

const enabled = computed(() => props.items.filter((item) => !item.disabled));

/** 方向键在可用项之间循环，与原生 tablist 的行为一致 */
function move(step: 1 | -1) {
  const list = enabled.value;
  if (!list.length) return;
  const index = list.findIndex((item) => item.key === model.value);
  const next = list[(index + step + list.length) % list.length];
  if (next) model.value = next.key;
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowRight') move(1);
  else if (event.key === 'ArrowLeft') move(-1);
  else if (event.key === 'Home') {
    const first = enabled.value[0];
    if (first) model.value = first.key;
  } else return;
  event.preventDefault();
}
</script>

<template>
  <div :class="css.root">
    <div ref="listEl" :class="css.list" role="tablist" :aria-label="label">
      <span
        :class="css.indicator"
        :style="{ transform: `translateX(${indicator.left}px)`, width: `${indicator.width}px` }"
        aria-hidden="true"
      />
      <button
        v-for="item in items"
        :id="`${uid}-tab-${item.key}`"
        :key="item.key"
        :class="css.tab"
        type="button"
        role="tab"
        :aria-selected="model === item.key"
        :aria-controls="`${uid}-panel-${item.key}`"
        :tabindex="model === item.key ? 0 : -1"
        :disabled="item.disabled"
        @click="model = item.key"
        @keydown="onKeydown"
      >
        {{ item.label }}
      </button>
    </div>

    <div
      :id="`${uid}-panel-${model}`"
      :class="css.panel"
      role="tabpanel"
      :aria-labelledby="`${uid}-tab-${model}`"
      tabindex="0"
    >
      <!-- 切换标签时新内容淡入上浮；enter-only，旧内容即时让位不拖泥带水 -->
      <Transition :enter-active-class="css.panelIn">
        <div :key="model" :class="css.panelBody">
          <slot :name="model" />
        </div>
      </Transition>
    </div>
  </div>
</template>
