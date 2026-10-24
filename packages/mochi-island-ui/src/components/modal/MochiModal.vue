<script setup lang="ts">
import { ref } from 'vue';
import { useOverlay } from '../../internal/useOverlay';
import css from './MochiModal.module.css';
import { useMessages } from '../../locale';

defineOptions({ name: 'MochiModal' });

const m = useMessages();

withDefaults(
  defineProps<{
    title?: string;
    /** 点遮罩是否关闭 */
    maskClosable?: boolean;
    closeLabel?: string;
  }>(),
  { maskClosable: true },
);

// v-model:open —— 开关状态用显式命名，避免和表单类组件的 v-model 混淆
const open = defineModel<boolean>('open', { default: false });

const panel = ref<HTMLElement>();
const { close, onKeydown } = useOverlay(open, panel);
</script>

<template>
  <Teleport to="body">
    <Transition :enter-active-class="css.fadeIn" :leave-active-class="css.fadeOut">
      <div v-if="open" :class="css.mask" @click.self="maskClosable && close()">
        <div
          ref="panel"
          :class="css.panel"
          role="dialog"
          aria-modal="true"
          :aria-label="title"
          tabindex="-1"
          @keydown="onKeydown"
        >
          <header v-if="title || $slots.header" :class="css.header">
            <slot name="header">
              <h2 :class="css.title">{{ title }}</h2>
            </slot>
            <button :class="css.close" type="button" :aria-label="closeLabel ?? m.close" @click="close">
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
