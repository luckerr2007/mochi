<script setup lang="ts">
import { computed, ref } from 'vue';
import { useOverlay } from '../../internal/useOverlay';
import type { MochiDrawerPlacement } from './types';
import css from './MochiDrawer.module.css';

defineOptions({ name: 'MochiDrawer' });

const props = withDefaults(
  defineProps<{
    title?: string;
    placement?: MochiDrawerPlacement;
    width?: string;
    maskClosable?: boolean;
    closeLabel?: string;
  }>(),
  { placement: 'right', width: '320px', maskClosable: true, closeLabel: '关闭' },
);

const open = defineModel<boolean>('open', { default: false });

const panel = ref<HTMLElement>();
const { close, onKeydown } = useOverlay(open, panel);

const placementClass = computed(() => (props.placement === 'left' ? css.left : css.right));
</script>

<template>
  <Teleport to="body">
    <Transition :enter-active-class="css.fadeIn" :leave-active-class="css.fadeOut">
      <div v-if="open" :class="css.mask" @click.self="maskClosable && close()">
        <div
          ref="panel"
          :class="[css.panel, placementClass]"
          :style="{ width }"
          role="dialog"
          aria-modal="true"
          :aria-label="title"
          tabindex="-1"
          @keydown="onKeydown"
        >
          <header :class="css.header">
            <slot name="header">
              <h2 :class="css.title">{{ title }}</h2>
            </slot>
            <button :class="css.close" type="button" :aria-label="closeLabel" @click="close">
              <svg viewBox="0 0 10 10" aria-hidden="true" focusable="false">
                <path d="M2 2 L8 8 M8 2 L2 8" />
              </svg>
            </button>
          </header>

          <div :class="css.body"><slot /></div>

          <footer v-if="$slots.footer" :class="css.footer"><slot name="footer" /></footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
