<script setup lang="ts">
import css from './MochiLayout.module.css';

/**
 * 侧栏：宽度可配，collapsible 时右缘出折叠钮，收起动画走弹簧令牌。
 * 折叠态宽度 = 折叠钮自身宽度（--sider-collapsed-w）。
 */
defineOptions({ name: 'MochiLayoutSider' });

const props = withDefaults(
  defineProps<{
    width?: number;
    collapsible?: boolean;
  }>(),
  { width: 208, collapsible: false },
);

const collapsed = defineModel<boolean>('collapsed', { default: false });
</script>

<template>
  <aside
    :class="[css.sider, collapsible && css.collapsible]"
    :data-collapsed="collapsed || undefined"
    :style="{ '--sider-w': `${width}px` }"
  >
    <div :class="css.siderBody">
      <slot />
    </div>
    <button
      v-if="collapsible"
      :class="css.siderToggle"
      type="button"
      :aria-expanded="!collapsed"
      :aria-label="collapsed ? '展开侧栏' : '收起侧栏'"
      @click="collapsed = !collapsed"
    >
      <svg viewBox="0 0 10 10" aria-hidden="true" focusable="false">
        <path d="M6.5 2 L3.5 5 L6.5 8" />
      </svg>
    </button>
  </aside>
</template>
