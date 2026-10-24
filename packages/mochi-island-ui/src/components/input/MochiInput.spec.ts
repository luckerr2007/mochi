import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import MochiInput from './MochiInput.vue';

describe('MochiInput', () => {
  it('label 与输入框通过 id 关联', () => {
    const wrapper = mount(MochiInput, { props: { label: '昵称' } });
    const label = wrapper.find('label');
    const input = wrapper.find('input');
    expect(label.attributes('for')).toBe(input.attributes('id'));
  });

  it('hint 会挂到 aria-describedby 上', () => {
    const wrapper = mount(MochiInput, { props: { hint: '最多 12 个字' } });
    const hint = wrapper.find('p');
    expect(wrapper.find('input').attributes('aria-describedby')).toBe(hint.attributes('id'));
  });

  it('输入时向外抛 update:modelValue', async () => {
    const wrapper = mount(MochiInput, { props: { modelValue: '' } });
    await wrapper.find('input').setValue('咕噜');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['咕噜']);
  });

  it('invalid 同时落到 aria-invalid 与 data 属性', () => {
    const wrapper = mount(MochiInput, { props: { invalid: true, hint: '格式不对' } });
    expect(wrapper.find('input').attributes('aria-invalid')).toBe('true');
    expect(wrapper.attributes('data-invalid')).toBe('true');
  });

  it('disabled 透传到原生输入框', () => {
    const wrapper = mount(MochiInput, { props: { disabled: true } });
    expect(wrapper.find('input').attributes('disabled')).toBeDefined();
  });
});
