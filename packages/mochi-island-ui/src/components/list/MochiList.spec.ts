import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import MochiList from './MochiList.vue';

const items = ['胡萝卜', '草莓', '铃兰'];

describe('MochiList', () => {
  it('默认渲染 ul，ordered 时渲染 ol', () => {
    expect(mount(MochiList).element.tagName).toBe('UL');
    expect(mount(MochiList, { props: { ordered: true } }).element.tagName).toBe('OL');
  });

  it('divided 默认开启，可用 false 关掉', () => {
    expect(mount(MochiList).attributes('data-divided')).toBe('true');
    expect(mount(MochiList, { props: { divided: false } }).attributes('data-divided')).toBeUndefined();
  });

  it('stagger 是 opt-in 的', () => {
    expect(mount(MochiList).attributes('data-stagger')).toBeUndefined();
    expect(mount(MochiList, { props: { stagger: true } }).attributes('data-stagger')).toBe('true');
  });

  it('保留列表语义，插槽内容按序渲染', () => {
    const wrapper = mount(MochiList, {
      slots: { default: items.map((item) => `<li>${item}</li>`).join('') },
    });
    expect(wrapper.findAll('li')).toHaveLength(3);
    expect(wrapper.find('ul').exists()).toBe(true);
  });
});
