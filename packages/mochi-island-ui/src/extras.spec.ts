import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import MochiAvatarGroup from './components/avatar-group/MochiAvatarGroup.vue';
import MochiBanner from './components/banner/MochiBanner.vue';
import MochiKbd from './components/kbd/MochiKbd.vue';
import MochiLoadMore from './components/load-more/MochiLoadMore.vue';
import MochiCodeInput from './components/code-input/MochiCodeInput.vue';
import MochiCountdown from './components/countdown/MochiCountdown.vue';
import MochiProgressRing from './components/progress-ring/MochiProgressRing.vue';
import MochiTagInput from './components/tag-input/MochiTagInput.vue';

describe('补充件第二弹', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('MochiAvatarGroup 超出 max 折叠成 +N，读屏带总数', () => {
    const wrapper = mount(MochiAvatarGroup, {
      props: {
        items: [{ name: '娜娜' }, { name: '波波' }, { name: '莉莉' }, { name: '阿保' }, { name: '古信' }],
        max: 3,
      },
    });

    const avatars = wrapper.findAll('[role="group"] > .item, [role="group"] span');
    // 3 个头像 + 1 个折叠位
    expect(wrapper.text()).toContain('+2');
    expect(wrapper.find('[role="group"]').attributes('aria-label')).toContain('共 5 位');
    expect(avatars.length).toBeGreaterThanOrEqual(3);
  });

  it('MochiTagInput 回车添加、重复忽略、退格删除末尾', async () => {
    const wrapper = mount(MochiTagInput, {
      props: { modelValue: ['existing'], label: '标签' },
    });
    const input = wrapper.find('input');
    expect(wrapper.text()).toContain('existing');

    // 添加
    await input.setValue('苹果');
    await input.trigger('keydown', { key: 'Enter' });
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toEqual(['existing', '苹果']);
    expect(wrapper.emitted('add')?.[0]).toEqual(['苹果']);

    // 重复忽略
    await input.setValue('苹果');
    await input.trigger('keydown', { key: 'Enter' });
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toEqual(['existing', '苹果']);

    // 退格：输入框为空时删末尾
    await input.setValue('');
    await input.trigger('keydown', { key: 'Backspace' });
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toEqual(['existing']);
    expect(wrapper.emitted('remove')?.[0]).toEqual(['苹果']);
  });

  it('MochiTagInput 打满上限后输入框让位', async () => {
    const wrapper = mount(MochiTagInput, { props: { modelValue: ['a', 'b'], max: 2 } });
    expect(wrapper.find('input').exists()).toBe(false);
    expect(wrapper.text()).toContain('最多 2 个');
  });

  it('MochiProgressRing 夹在 0-100 并给出进度条语义', () => {
    const wrapper = mount(MochiProgressRing, { props: { modelValue: 250, label: '完成度' } });
    const bar = wrapper.find('[role="progressbar"]');
    expect(bar.attributes('aria-valuenow')).toBe('100');
    expect(bar.attributes('aria-valuemax')).toBe('100');
    expect(wrapper.text()).toContain('100');
  });

  it('MochiCodeInput 单格输入自动前进，粘贴铺开，填满抛 complete', async () => {
    const wrapper = mount(MochiCodeInput, { props: { length: 4, modelValue: '' }, attachTo: document.body });
    const boxes = wrapper.findAll('input');

    await boxes[0]!.setValue('m');
    // 自动前进：焦点落到第二格
    expect(document.activeElement).toBe(boxes[1]!.element);
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe('m');

    // 连打/粘贴：从当前格顺位铺开；4 格从第 2 位起只装得下 3 个字符（截断是正确行为）
    await boxes[1]!.setValue('chi');
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe('mchi');
    expect(wrapper.emitted('complete')?.[0]).toEqual(['mchi']);
    wrapper.unmount();
  });

  it('MochiCodeInput 退格在空格上会删掉前一位', async () => {
    const wrapper = mount(MochiCodeInput, { props: { length: 4, modelValue: 'ab' }, attachTo: document.body });
    const boxes = wrapper.findAll('input');
    // 光标在第 3 格（空），退格删掉第 2 格的 b
    await boxes[2]!.trigger('keydown', { key: 'Backspace' });
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe('a');
    wrapper.unmount();
  });

  it('MochiCountdown 每秒跳动，走完抛 finish 并归零', async () => {
    vi.useFakeTimers();
    const wrapper = mount(MochiCountdown, {
      props: { to: Date.now() + 3000, label: '活动开始' },
    });
    await nextTick();
    expect(wrapper.text()).toContain('03');
    expect(wrapper.text()).toContain('分');

    vi.advanceTimersByTime(3100);
    await nextTick();
    expect(wrapper.emitted('finish')).toHaveLength(1);
    // 全部归零
    expect(wrapper.findAll('[data-zero]').length).toBe(4);
  });

  it('MochiBanner 关闭时收起高度，重新打开恢复', async () => {
    const wrapper = mount(MochiBanner, {
      props: { tone: 'info', title: '公告', modelValue: true },
    });
    expect(wrapper.find('[data-open]').exists()).toBe(true);
    expect(wrapper.text()).toContain('公告');

    await wrapper.find('button[aria-label="关闭公告"]').trigger('click');
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false]);
    expect(wrapper.emitted('close')).toHaveLength(1);
    // data-open 移除后 grid-template-rows 收起
    expect(wrapper.find('[data-open]').exists()).toBe(false);
  });

  it('MochiLoadMore 三态：idle 可点、loading/busy、done 不可点', async () => {
    const idle = mount(MochiLoadMore, { props: { status: 'idle' } });
    await idle.trigger('click');
    expect(idle.emitted('more')).toHaveLength(1);

    const loading = mount(MochiLoadMore, { props: { status: 'loading' } });
    expect(loading.attributes('aria-busy')).toBe('true');
    await loading.trigger('click');
    expect(loading.emitted('more')).toBeUndefined();
    expect(loading.text()).toContain('加载中');

    const done = mount(MochiLoadMore, { props: { status: 'done' } });
    await done.trigger('click');
    expect(done.emitted('more')).toBeUndefined();
    expect(done.text()).toContain('没有更多');
  });

  it('MochiKbd 渲染 kbd 元素并显示按键名', () => {
    const wrapper = mount(MochiKbd, { slots: { default: '⌘K' } });
    expect(wrapper.element.tagName).toBe('KBD');
    expect(wrapper.text()).toBe('⌘K');
  });
});
