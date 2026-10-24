<script setup lang="ts">
import { computed, TransitionGroup } from 'vue';
import css from './MochiList.module.css';

defineOptions({ name: 'MochiList' });

const props = withDefaults(
  defineProps<{
    ordered?: boolean;
    divided?: boolean;
    /** 入场错峰：每项比前一项晚 --mochi-stagger */
    stagger?: boolean;
    /**
     * 增删项时用 TransitionGroup 平滑位移：新项上浮进入，删掉的项淡出，
     * 剩下的项靠 move 过渡补位。列表内容是 v-for 动态增删时才开。
     */
    animated?: boolean;
  }>(),
  { ordered: false, divided: true, stagger: false, animated: false },
);

/** TransitionGroup 没有 component :is 的 tag 切换，按 ordered 选组件 */
const Group = computed(() => (props.animated ? TransitionGroup : null));
const tag = computed(() => (props.ordered ? 'ol' : 'ul'));
</script>

<template>
  <component
    :is="Group ?? tag"
    v-if="animated"
    :tag="tag"
    :class="css.root"
    :data-ordered="ordered || undefined"
    :data-divided="divided || undefined"
    :data-stagger="stagger || undefined"
    :data-animated="animated || undefined"
    :enter-active-class="css.itemEnter"
    :leave-active-class="css.itemLeave"
    :move-class="css.itemMove"
  >
    <slot />
  </component>
  <component :is="tag" v-else :class="css.root" :data-ordered="ordered || undefined" :data-divided="divided || undefined" :data-stagger="stagger || undefined">
    <slot />
  </component>
</template>
