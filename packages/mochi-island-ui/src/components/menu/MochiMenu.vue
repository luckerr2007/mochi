<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { MochiMenuItem } from './types';
import css from './MochiMenu.module.css';

defineOptions({ name: 'MochiMenu' });

const props = withDefaults(defineProps<{ items: MochiMenuItem[]; label?: string }>(), {
  label: '主导航',
});

const active = defineModel<string>({ default: '' });

const root = ref<HTMLElement>();
const indicator = ref({ top: 0, height: 0 });
/** 展开的分组 key 集合 */
const opened = ref<string[]>([]);

function syncIndicator() {
  // 选中项在收起的分组里时，指示条挂到父级上——否则它会停在旧位置，悬在盒子外面
  const parent = props.items.find((item) =>
    item.children?.some((child) => child.key === active.value),
  );
  const key = parent && !opened.value.includes(parent.key) ? parent.key : active.value;

  const el = key ? root.value?.querySelector<HTMLElement>(`[data-key="${key}"]`) : null;
  indicator.value = el
    ? { top: el.offsetTop, height: el.offsetHeight }
    : { top: 0, height: 0 };
}

onMounted(() => {
  // 选中项如果藏在分组里，先把分组展开，否则看不见指示条
  const parent = props.items.find((item) =>
    item.children?.some((child) => child.key === active.value),
  );
  if (parent) opened.value = [parent.key];

  nextTick(syncIndicator);
  window.addEventListener('resize', syncIndicator);
});
onBeforeUnmount(() => window.removeEventListener('resize', syncIndicator));
watch(active, () => nextTick(syncIndicator));
watch(opened, () => nextTick(syncIndicator));

function toggleGroup(key: string) {
  opened.value = opened.value.includes(key)
    ? opened.value.filter((item) => item !== key)
    : [...opened.value, key];
}

function choose(item: MochiMenuItem) {
  if (item.disabled) return;
  if (item.children) {
    toggleGroup(item.key);
    return;
  }
  active.value = item.key;
  nextTick(syncIndicator);
}

const hasActiveChild = (item: MochiMenuItem) =>
  item.children?.some((child) => child.key === active.value) ?? false;
</script>

<template>
  <nav ref="root" :class="css.root" :aria-label="label">
    <span
      :class="css.indicator"
      :style="{ transform: `translateY(${indicator.top}px)`, height: `${indicator.height}px` }"
      aria-hidden="true"
    />

    <ul :class="css.list">
      <li v-for="item in items" :key="item.key">
        <button
          :class="css.item"
          type="button"
          :aria-current="active === item.key ? 'page' : undefined"
          :aria-expanded="item.children ? opened.includes(item.key) : undefined"
          :disabled="item.disabled"
          :data-group="item.children ? true : undefined"
          :data-group-active="hasActiveChild(item) || undefined"
          :data-key="item.key"
          @click="choose(item)"
        >
          <span :class="css.label">{{ item.label }}</span>
          <svg
            v-if="item.children"
            :class="css.chevron"
            :data-open="opened.includes(item.key) ? 'true' : 'false'"
            viewBox="0 0 12 12"
            aria-hidden="true"
          >
            <path d="M2 4.5 L6 8.5 L10 4.5" />
          </svg>
        </button>

        <!-- 分组展开：用 grid-template-rows 0fr → 1fr 过渡，不需要 JS 测高 -->
        <div v-if="item.children" :class="css.group" :data-open="opened.includes(item.key) || undefined">
          <ul :class="css.sub">
            <li v-for="child in item.children" :key="child.key">
              <button
                :class="[css.item, css.child]"
                type="button"
                :aria-current="active === child.key ? 'page' : undefined"
                :data-parent-active="hasActiveChild(item) || undefined"
                :data-key="child.key"
                :disabled="child.disabled"
                @click="choose(child)"
              >
                <span :class="css.label">{{ child.label }}</span>
              </button>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </nav>
</template>
