import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import MochiPanel from './MochiPanel.vue';

describe('MochiPanel', () => {
  it('title 渲染为 h3，并带出 header 结构', () => {
    const wrapper = mount(MochiPanel, { props: { title: '背包' } });
    expect(wrapper.find('header').exists()).toBe(true);
    expect(wrapper.find('h3').text()).toBe('背包');
  });

  it('headingLevel 可调，避免标题跳级', () => {
    const wrapper = mount(MochiPanel, { props: { title: '设置', headingLevel: 2 } });
    expect(wrapper.find('h2').exists()).toBe(true);
  });

  it('没有 title 也没有 header 插槽时不渲染 header', () => {
    const wrapper = mount(MochiPanel, { slots: { default: '正文' } });
    expect(wrapper.find('header').exists()).toBe(false);
    expect(wrapper.text()).toBe('正文');
  });

  it('header 插槽优先于 title', () => {
    const wrapper = mount(MochiPanel, {
      props: { title: '会被替换' },
      slots: { header: '自定义头部' },
    });
    expect(wrapper.find('header').text()).toBe('自定义头部');
    expect(wrapper.text()).not.toContain('会被替换');
  });

  it('footer 只在实际传入插槽时渲染', () => {
    const withFooter = mount(MochiPanel, { slots: { default: '正文', footer: '页脚' } });
    expect(withFooter.find('footer').exists()).toBe(true);
    expect(withFooter.find('footer').text()).toBe('页脚');

    const withoutFooter = mount(MochiPanel, { slots: { default: '正文' } });
    expect(withoutFooter.find('footer').exists()).toBe(false);
  });
});
