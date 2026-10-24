import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import MochiDialogBubble from './MochiDialogBubble.vue';

const hidden = (wrapper: ReturnType<typeof mount>) => wrapper.find('[aria-hidden="true"]');

describe('MochiDialogBubble', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('尾巴方向由 placement 决定，默认 left', () => {
    const wrapper = mount(MochiDialogBubble, { props: { text: '你好' } });
    expect(wrapper.attributes('data-placement')).toBe('left');
    expect(wrapper.find('svg').exists()).toBe(true);
  });

  it('不开打字机时直接给出全文', () => {
    const wrapper = mount(MochiDialogBubble, { props: { text: '今天也辛苦了' } });
    expect(wrapper.text()).toContain('今天也辛苦了');
    expect(wrapper.emitted('done')).toHaveLength(1);
  });

  it('打字机逐字推进，结束后触发 done', async () => {
    vi.useFakeTimers();
    const wrapper = mount(MochiDialogBubble, {
      props: { text: '你好呀', typewriter: true, speed: 20 },
    });

    expect(hidden(wrapper).text()).toBe('');
    await vi.advanceTimersByTimeAsync(20);
    expect(hidden(wrapper).text()).toBe('你');
    await vi.advanceTimersByTimeAsync(40);
    expect(hidden(wrapper).text()).toBe('你好呀');
    expect(wrapper.emitted('done')).toHaveLength(1);
  });

  it('逐字文本对读屏隐藏，整段文字放在 live region 里', () => {
    const wrapper = mount(MochiDialogBubble, { props: { text: '咕噜咕噜', typewriter: true } });
    const live = wrapper.find('[aria-live="polite"]');
    expect(live.exists()).toBe(true);
    expect(live.text()).toBe('咕噜咕噜');
  });

  it('prefers-reduced-motion 下跳过动画，直接显示全文', async () => {
    const original = Object.getOwnPropertyDescriptor(globalThis, 'matchMedia');
    Object.defineProperty(globalThis, 'matchMedia', {
      configurable: true,
      writable: true,
      value: vi.fn().mockReturnValue({ matches: true }),
    });

    const wrapper = mount(MochiDialogBubble, {
      props: { text: '不动的', typewriter: true },
    });
    // 全文在 mounted 里写入，等一次渲染刷新再断言
    await nextTick();
    expect(hidden(wrapper).text()).toBe('不动的');

    if (original) Object.defineProperty(globalThis, 'matchMedia', original);
    else Reflect.deleteProperty(globalThis, 'matchMedia');
  });
});
