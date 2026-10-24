import { readonly, ref } from 'vue';

export type MochiToastTone = 'info' | 'success' | 'warning' | 'danger';

export interface MochiToastOptions {
  title: string;
  description?: string;
  tone?: MochiToastTone;
  /** 自动消失毫秒数，传 0 表示不自动关闭 */
  duration?: number;
}

export interface MochiToastItem extends MochiToastOptions {
  id: number;
  tone: MochiToastTone;
  duration: number;
}

const items = ref<MochiToastItem[]>([]);
let seed = 0;

export const toastItems = readonly(items);

/** 压入一条通知，返回 id 便于手动关闭 */
export function pushToast(options: MochiToastOptions | string): number {
  const normalized: MochiToastOptions =
    typeof options === 'string' ? { title: options } : options;

  const id = ++seed;
  items.value = [
    ...items.value,
    { id, tone: 'info', duration: 3200, ...normalized },
  ];
  return id;
}

export function dismissToast(id: number) {
  items.value = items.value.filter((item) => item.id !== id);
}

/** 组件里用：const { toast, dismiss } = useToast() */
export function useToast() {
  return { toast: pushToast, dismiss: dismissToast, items: toastItems };
}
