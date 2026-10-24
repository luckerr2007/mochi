import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import MochiButton from './MochiButton.vue';

describe('MochiButton', () => {
  it('默认是 primary / md / type=button，并渲染插槽', () => {
    const wrapper = mount(MochiButton, { slots: { default: '确定' } });
    expect(wrapper.text()).toBe('确定');
    expect(wrapper.attributes('data-variant')).toBe('primary');
    expect(wrapper.attributes('data-size')).toBe('md');
    expect(wrapper.attributes('type')).toBe('button');
  });

  it('disabled 透传到原生 button，且不再外抛点击', async () => {
    const onClick = vi.fn();
    const wrapper = mount(MochiButton, {
      props: { disabled: true },
      slots: { default: '不可用' },
      attrs: { onClick },
    });

    expect(wrapper.attributes('disabled')).toBeDefined();
    await wrapper.trigger('click');
    expect(onClick).not.toHaveBeenCalled();
  });

  it('variant / size 落到 data 属性上，供样式选择', () => {
    const wrapper = mount(MochiButton, { props: { variant: 'ghost', size: 'lg' } });
    expect(wrapper.attributes('data-variant')).toBe('ghost');
    expect(wrapper.attributes('data-size')).toBe('lg');
  });
});
