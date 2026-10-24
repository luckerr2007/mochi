import { nextTick, onBeforeUnmount, ref, watch, type Ref } from 'vue';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * 浮层的公共行为：滚动锁、焦点陷阱、Esc 关闭、关闭后焦点归还。
 * Modal 与 Drawer 只差外观，交互完全一致，所以抽在这里。
 */
export function useOverlay(open: Ref<boolean>, panel: Ref<HTMLElement | undefined>) {
  const lastFocused = ref<HTMLElement | null>(null);

  function close() {
    open.value = false;
  }

  function onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== 'Tab' || !panel.value) return;

    const nodes = [...panel.value.querySelectorAll<HTMLElement>(FOCUSABLE)];
    if (!nodes.length) return;

    const first = nodes[0]!;
    const last = nodes[nodes.length - 1]!;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  watch(open, async (isOpen) => {
    if (isOpen) {
      lastFocused.value = document.activeElement as HTMLElement | null;
      document.documentElement.style.overflow = 'hidden';
      await nextTick();
      panel.value?.focus();
    } else {
      document.documentElement.style.overflow = '';
      lastFocused.value?.focus();
    }
  });

  onBeforeUnmount(() => {
    document.documentElement.style.overflow = '';
  });

  return { close, onKeydown };
}
