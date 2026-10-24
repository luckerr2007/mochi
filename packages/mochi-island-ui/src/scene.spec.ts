import { mount } from '@vue/test-utils';
import { h, nextTick, ref } from 'vue';
import { describe, expect, it } from 'vitest';
import MochiColorPicker from './components/color-picker/MochiColorPicker.vue';
import MochiCommandPalette from './components/command-palette/MochiCommandPalette.vue';
import MochiList from './components/list/MochiList.vue';
import MochiMentions from './components/mentions/MochiMentions.vue';
import MochiPanel from './components/panel/MochiPanel.vue';
import MochiQRCode from './components/qrcode/MochiQRCode.vue';
import MochiSelect from './components/select/MochiSelect.vue';
import MochiTransfer from './components/transfer/MochiTransfer.vue';

// 本轮新增的场景组件（Transfer / ColorPicker / Mentions / QRCode / CommandPalette）
// 加上动效改造的组件（Panel / List / Select）
describe('场景组件的行为边界', () => {
  it('MochiTransfer 勾选后右移，回传按 data 顺序排列', async () => {
    const wrapper = mount(MochiTransfer, {
      props: {
        data: [
          { key: 'a', label: '苹果' },
          { key: 'b', label: '梨' },
          { key: 'c', label: '船梨', disabled: true },
        ],
        modelValue: ['b'],
      },
    });

    expect(wrapper.findAll('section')).toHaveLength(2);
    // 禁用项的复选框真的是禁用的
    const boxes = wrapper.findAll('input[type="checkbox"]');
    const disabledBox = boxes.find((box) => (box.element as HTMLInputElement).disabled)!;
    expect((disabledBox.element as HTMLInputElement).checked).toBe(false);

    // 勾选「苹果」，头部计数与全选框联动
    const apple = boxes.find((box) =>
      (box.element.parentElement?.textContent ?? '').includes('苹果'),
    )!;
    await apple.setValue(true);
    expect(wrapper.findAll('section')[0]!.text()).toContain('1 / 1');

    await wrapper.find('button[aria-label="移到右侧"]').trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['a', 'b']]);
    expect(wrapper.emitted('change')?.[0]).toEqual([['a', 'b']]);
  });

  it('MochiTransfer 禁用项不会被移动，搜索只影响可见性', async () => {
    const wrapper = mount(MochiTransfer, {
      props: {
        searchable: true,
        data: [
          { key: 'a', label: '苹果' },
          { key: 'b', label: '船梨' },
        ],
        modelValue: [],
      },
    });

    // 只勾选可见的「苹果」没问题；但移动时禁用项会被过滤掉
    const searches = wrapper.findAll('input[type="search"]');
    await searches[0]!.setValue('船');
    expect(wrapper.findAll('section')[0]!.text()).toContain('船梨');
    expect(wrapper.findAll('section')[0]!.text()).not.toContain('苹果');

    const boat = wrapper
      .findAll('input[type="checkbox"]')
      .find((box) => (box.element.parentElement?.textContent ?? '').includes('船梨'))!;
    await boat.setValue(true);
    await wrapper.find('button[aria-label="移到右侧"]').trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['b']]);
  });

  it('MochiColorPicker 打开面板，HEX 输入与预设色板都能回传', async () => {
    const wrapper = mount(MochiColorPicker, {
      props: { modelValue: '#f0875c', swatches: ['#112233', '#445566'] },
    });

    expect(wrapper.find('[role="dialog"]').exists()).toBe(false);
    await wrapper.find('button').trigger('click');
    const dialog = wrapper.find('[role="dialog"]');
    expect(dialog.exists()).toBe(true);

    // HEX 输入合法值即时生效
    const hex = dialog.find('input[type="text"]');
    await hex.setValue('#7fc8c0');
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['#7fc8c0']);

    // 预设色板点击
    const dots = dialog.findAll('[role="option"]');
    expect(dots).toHaveLength(2);
    await dots[1]!.trigger('click');
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['#445566']);
  });

  it('MochiMentions 输入 @ 唤起建议，选中后拼回正文', async () => {
    const wrapper = mount(MochiMentions, {
      props: { modelValue: '', options: ['娜娜', '波波', '莉莉'] },
    });

    const input = wrapper.find('input');
    expect(wrapper.find('[role="listbox"]').exists()).toBe(false);

    await input.setValue('找@');
    expect(wrapper.find('[role="listbox"]').exists()).toBe(true);
    expect(wrapper.findAll('[role="option"]')).toHaveLength(3);

    await input.setValue('找@娜');
    expect(wrapper.findAll('[role="option"]')).toHaveLength(1);

    await input.trigger('keydown', { key: 'Enter' });
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['找@娜娜 ']);
    expect(wrapper.emitted('select')?.[0]).toEqual(['娜娜']);
    expect(wrapper.find('[role="listbox"]').exists()).toBe(false);
  });

  it('MochiMentions 空格断开匹配，建议区收起', async () => {
    const wrapper = mount(MochiMentions, {
      props: { modelValue: '', options: ['娜娜'] },
    });

    const input = wrapper.find('input');
    await input.setValue('@娜 哈喽');
    expect(wrapper.find('[role="listbox"]').exists()).toBe(false);
  });

  it('MochiQRCode 渲染模块矩阵，内容变化重绘，超长给出占位', () => {
    const wrapper = mount(MochiQRCode, { props: { value: 'https://mochi.dev' } });
    const svg = wrapper.find('svg');
    expect(svg.exists()).toBe(true);
    expect(svg.attributes('viewBox')).toMatch(/^0 0 \d+ \d+$/);
    expect(svg.find('path').attributes('d')).not.toBe('');

    // 中文走 UTF-8，能正常出码
    const cn = mount(MochiQRCode, { props: { value: '码头小店欢迎你' } });
    expect(cn.find('svg').exists()).toBe(true);

    const empty = mount(MochiQRCode, { props: { value: '' } });
    expect(empty.find('svg').exists()).toBe(false);

    const overflow = mount(MochiQRCode, { props: { value: 'mochi'.repeat(600), level: 'H' } });
    expect(overflow.text()).toContain('内容过长');
  });

  it('MochiCommandPalette 打开渲染列表，方向键跳过禁用项，Enter 选中并关闭', async () => {
    const wrapper = mount(MochiCommandPalette, {
      props: {
        open: true,
        commands: [
          { key: 'save', label: '保存', hint: '⌘S' },
          { key: 'remove', label: '删除', disabled: true },
          { key: 'share', label: '分享', group: '岛屿' },
        ],
      },
      global: { stubs: { teleport: true } },
    });

    const dialog = wrapper.find('[role="dialog"]');
    expect(dialog.exists()).toBe(true);
    expect(wrapper.findAll('[role="option"]')).toHaveLength(3);
    // 分组标题渲染在「分享」之前
    expect(wrapper.text()).toContain('岛屿');

    await dialog.trigger('keydown', { key: 'ArrowDown' });
    // 高亮跳过禁用项，落在第三个
    const options = wrapper.findAll('[role="option"]');
    expect(options[2]!.attributes('aria-selected')).toBe('true');

    await dialog.trigger('keydown', { key: 'Enter' });
    expect(wrapper.emitted('select')?.[0]?.[0]).toMatchObject({ key: 'share' });
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false]);
  });

  it('MochiCommandPalette 搜索过滤，Cmd/Ctrl+K 唤起', async () => {
    const wrapper = mount(MochiCommandPalette, {
      props: {
        open: false,
        commands: [{ key: 'save', label: '保存' }, { key: 'share', label: '分享' }],
      },
      global: { stubs: { teleport: true } },
    });

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
    await nextTick();
    expect(wrapper.emitted('update:open')?.[0]).toEqual([true]);

    await wrapper.find('input').setValue('分');
    expect(wrapper.findAll('[role="option"]')).toHaveLength(1);
    expect(wrapper.text()).toContain('分享');
  });

  it('MochiPanel 开入场动画，不开就不带标记', () => {
    const plain = mount(MochiPanel, { props: { title: '常态' } });
    expect(plain.attributes('data-animate')).toBeUndefined();

    const animated = mount(MochiPanel, { props: { title: '入场', animate: true } });
    expect(animated.attributes('data-animate')).toBe('true');
  });

  it('MochiList animated 时用 TransitionGroup 渲染，增删不崩', async () => {
    const items = ref(['甲', '乙', '丙']);
    // 用函数式宿主而不是 template 字符串：vitest 环境没有运行时模板编译器
    const host = () =>
      h(MochiList, { animated: true, divided: true }, () =>
        items.value.map((item) => h('li', { key: item }, item)),
      );
    // 用函数式宿主而不是 template 字符串：vitest 环境没有运行时模板编译器；
    // 同时关掉 test-utils 对 transition-group 的默认 stub，否则拿不到真实 ul
    const wrapper = mount(host, { global: { stubs: { 'transition-group': false } } });
    expect(wrapper.find('ul').exists()).toBe(true);

    items.value = ['乙', '丙'];
    await nextTick();
    // 离场动画要跑完（120ms）节点才真正从 DOM 移除
    await new Promise((resolve) => setTimeout(resolve, 200));
    expect(wrapper.text()).not.toContain('甲');
    expect(wrapper.text()).toContain('乙');
  });

  it('MochiSelect 打开后有滑动高亮块，active 选项挂在 aria 语义上', async () => {
    const wrapper = mount(MochiSelect, {
      props: {
        modelValue: 'apple',
        options: [
          { label: '苹果', value: 'apple' },
          { label: '梨', value: 'pear' },
        ],
      },
    });

    await wrapper.find('[role="combobox"]').trigger('click');
    const list = wrapper.find('[role="listbox"]');
    expect(list.find('span').exists()).toBe(true);
    expect(wrapper.find('[data-active="true"]').text()).toBe('苹果');
  });
});
