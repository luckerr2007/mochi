<script setup lang="ts">
import { computed, useSlots } from 'vue';
import type { MochiPanelHeadingLevel } from './types';
import css from './MochiPanel.module.css';

defineOptions({ name: 'MochiPanel' });

const props = withDefaults(
  defineProps<{
    /** 不传时若提供 header 插槽则仍渲染头部 */
    title?: string;
    /** 标题层级，避免在文档里跳级 */
    headingLevel?: MochiPanelHeadingLevel;
    /** 入场时淡入上浮一次；页面首屏的面板开这个，常态面板别开 */
    animate?: boolean;
  }>(),
  { headingLevel: 3, animate: false },
);

const slots = useSlots();
const hasHeader = computed(() => Boolean(props.title) || Boolean(slots.header));
const headingTag = computed(() => `h${props.headingLevel}`);
</script>

<template>
  <section :class="css.root" :data-animate="animate || undefined">
    <!-- 多个 animate 面板排在一起时，用方可通过 style="--_i: 1" 传入错峰序号 -->
    <header v-if="hasHeader" :class="css.header">
      <slot name="header">
        <component :is="headingTag" :class="css.title">{{ title }}</component>
      </slot>
    </header>

    <div :class="css.body">
      <slot />
    </div>

    <footer v-if="$slots.footer" :class="css.footer">
      <slot name="footer" />
    </footer>
  </section>
</template>
