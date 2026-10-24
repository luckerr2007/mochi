import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import MochiTag from './MochiTag.vue';

describe('MochiTag', () => {
  it('默认 neutral，tone 落到 data 属性', () => {
    expect(mount(MochiTag).attributes('data-tone')).toBe('neutral');
    expect(mount(MochiTag, { props: { tone: 'candy' } }).attributes('data-tone')).toBe('candy');
  });

  it('不传 closable 时不渲染关闭按钮', () => {
    expect(mount(MochiTag).find('button').exists()).toBe(false);
  });

  it('closable 时关闭按钮有可访问名称，点击抛 close', async () => {
    const wrapper = mount(MochiTag, { props: { closable: true, closeLabel: '移除标签' } });
    const button = wrapper.find('button');
    expect(button.attributes('aria-label')).toBe('移除标签');
    await button.trigger('click');
    expect(wrapper.emitted('close')).toHaveLength(1);
  });
});
