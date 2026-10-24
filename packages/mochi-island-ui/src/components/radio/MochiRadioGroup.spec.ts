import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import MochiRadioGroup from './MochiRadioGroup.vue';

const options = [
  { label: '苹果', value: 'apple' },
  { label: '橘子', value: 'orange' },
  { label: '梨', value: 'pear', disabled: true },
];

describe('MochiRadioGroup', () => {
  it('legend 渲染为 fieldset 的标题', () => {
    const wrapper = mount(MochiRadioGroup, { props: { options, legend: '喜欢哪种水果' } });
    expect(wrapper.find('fieldset').exists()).toBe(true);
    expect(wrapper.find('legend').text()).toBe('喜欢哪种水果');
  });

  it('同组 radio 共享 name，方向键才能切换', () => {
    const wrapper = mount(MochiRadioGroup, { props: { options } });
    const names = wrapper.findAll('input').map((input) => input.attributes('name'));
    expect(new Set(names).size).toBe(1);
    expect(names[0]).toBeTruthy();
  });

  it('选中项与 v-model 同步', async () => {
    const wrapper = mount(MochiRadioGroup, { props: { options, modelValue: 'apple' } });
    const inputs = wrapper.findAll('input');
    expect((inputs[0]!.element as HTMLInputElement).checked).toBe(true);

    await inputs[1]!.setValue();
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['orange']);
  });

  it('单项 disabled 只禁用该项，整体 disabled 禁用整组', () => {
    const partial = mount(MochiRadioGroup, { props: { options } });
    expect(partial.findAll('input')[2]!.attributes('disabled')).toBeDefined();

    const whole = mount(MochiRadioGroup, { props: { options, disabled: true } });
    expect(whole.find('fieldset').attributes('disabled')).toBeDefined();
  });
});
