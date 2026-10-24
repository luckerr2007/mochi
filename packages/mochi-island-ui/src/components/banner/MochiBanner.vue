<script setup lang="ts">
import ToneGlyph from '../../internal/ToneGlyph.vue';
import css from './MochiBanner.module.css';
import { useMessages } from '../../locale';

defineOptions({ name: 'MochiBanner' });

const m = useMessages();

withDefaults(
  defineProps<{
    tone?: 'info' | 'success' | 'warning' | 'danger';
    title?: string;
    /** 吸顶：固定在视口顶部，适合全站公告 */
    sticky?: boolean;
    closable?: boolean;
    closeLabel?: string;
  }>(),
  { tone: 'info', sticky: false, closable: true },
);

const emit = defineEmits<{ close: [] }>();

/** 内部持有开合：关闭时高度收起而不是瞬间消失 */
const open = defineModel<boolean>('open', { default: true });

function dismiss() {
  open.value = false;
  emit('close');
}
</script>

<template>
  <!-- grid-template-rows 1fr → 0fr 由浏览器补间，收起高度不用 JS 量 -->
  <div :class="css.collapse" :data-open="open || undefined">
    <div :class="css.clip">
      <div :class="css.root" :data-tone="tone" :data-sticky="sticky || undefined" role="status">
        <span :class="css.badge" aria-hidden="true">
          <ToneGlyph :tone="tone" />
        </span>

        <p :class="css.text">
          <strong v-if="title" :class="css.title">{{ title }}</strong>
          <slot />
        </p>

        <button v-if="closable" :class="css.close" type="button" :aria-label="closeLabel ?? m.bannerClose" @click="dismiss">
          <svg viewBox="0 0 10 10" aria-hidden="true" focusable="false">
            <path d="M2 2 L8 8 M8 2 L2 8" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
