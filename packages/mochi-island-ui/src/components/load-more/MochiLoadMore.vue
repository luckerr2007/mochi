<script setup lang="ts">
import MochiSpinner from '../spinner/MochiSpinner.vue';
import css from './MochiLoadMore.module.css';

defineOptions({ name: 'MochiLoadMore' });

withDefaults(
  defineProps<{
    /** idle 可点击 / loading 加载中 / done 没有更多 */
    status?: 'idle' | 'loading' | 'done';
    idleText?: string;
    loadingText?: string;
    doneText?: string;
  }>(),
  { status: 'idle', idleText: '加载更多', loadingText: '加载中…', doneText: '没有更多了' },
);

const emit = defineEmits<{ more: [] }>();
</script>

<template>
  <button
    :class="css.root"
    :data-status="status"
    type="button"
    :disabled="status !== 'idle'"
    :aria-busy="status === 'loading' || undefined"
    @click="status === 'idle' && emit('more')"
  >
    <MochiSpinner v-if="status === 'loading'" :size="14" />
    <span :class="css.text">
      {{ status === 'loading' ? loadingText : status === 'done' ? doneText : idleText }}
    </span>
  </button>
</template>
