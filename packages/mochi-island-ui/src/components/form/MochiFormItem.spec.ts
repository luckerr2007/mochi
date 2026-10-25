import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import MochiFormItem from './MochiFormItem.vue';
import MochiInput from '../input/MochiInput.vue';

describe('MochiFormItem ↔ 控件联动（provide/inject）', () => {
  it('错误态自动下传：FieldShell 的输入槽跟着 data-invalid', async () => {
    const wrapper = mount(MochiFormItem, {
      props: { label: '昵称', error: '' },
      slots: { default: '<MochiInput model-value="小饼" />' },
      global: { components: { MochiInput } },
    });
    // 无错误：外壳不带 invalid，label 是 label 且暂时无 for（FieldShell 已注册 id 后补）
    expect(wrapper.find('[data-invalid]').exists()).toBe(false);
    expect(wrapper.find('label').exists()).toBe(true);

    await wrapper.setProps({ error: '昵称不能为空' });
    // 错误下传：Input 的 FieldShell 槽变 invalid（红框由 CSS data-invalid 驱动）
    const well = wrapper.find('[data-invalid]');
    expect(well.exists()).toBe(true);
    expect(wrapper.find('[role="alert"]').text()).toBe('昵称不能为空');

    await wrapper.setProps({ error: '' });
    expect(wrapper.find('[data-invalid]').exists()).toBe(false);
  });

  it('label 自动关联控件：for 指向 FieldShell 注册的 fieldId', async () => {
    const wrapper = mount(MochiFormItem, {
      props: { label: '昵称' },
      slots: { default: '<MochiInput model-value="小饼" />' },
      global: { components: { MochiInput } },
    });
    await wrapper.vm.$nextTick();
    const forId = wrapper.find('label').attributes('for');
    const inputId = wrapper.find('input').attributes('id');
    expect(forId).toBeTruthy();
    expect(forId).toBe(inputId);
  });

  it('不在 FormItem 里时行为不变：invalid 只看自身 props', () => {
    const plain = mount(MochiInput, { props: { modelValue: 'a', invalid: true } });
    expect(plain.find('[data-invalid]').exists()).toBe(true);
  });
});
