import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import MochiProgress from './MochiProgress.vue';

const bar = (wrapper: ReturnType<typeof mount>) => wrapper.find('[role="progressbar"] > div');

describe('MochiProgress', () => {
  it('把 value 换算成条宽百分比', () => {
    const wrapper = mount(MochiProgress, { props: { value: 30 } });
    expect(bar(wrapper).attributes('style')).toContain('width: 30%');
  });

  it('自定义 max 时按比例换算', () => {
    const wrapper = mount(MochiProgress, { props: { value: 3, max: 12 } });
    expect(bar(wrapper).attributes('style')).toContain('width: 25%');
  });

  it('越界值被夹在 0-100%', () => {
    expect(bar(mount(MochiProgress, { props: { value: 180 } })).attributes('style')).toContain(
      'width: 100%',
    );
    expect(bar(mount(MochiProgress, { props: { value: -20 } })).attributes('style')).toContain(
      'width: 0%',
    );
  });

  it('带 role 与完整的 aria 数值', () => {
    const wrapper = mount(MochiProgress, { props: { value: 40, max: 80, label: '经验值' } });
    const track = wrapper.find('[role="progressbar"]');
    expect(track.attributes('aria-valuenow')).toBe('40');
    expect(track.attributes('aria-valuemax')).toBe('80');
    expect(track.attributes('aria-valuemin')).toBe('0');
    expect(track.attributes('aria-label')).toBe('经验值');
  });

  it('tone 落到 data 属性，showValue 时才渲染数值行', () => {
    const wrapper = mount(MochiProgress, { props: { value: 40, tone: 'candy', showValue: true } });
    expect(bar(wrapper).attributes('data-tone')).toBe('candy');
    expect(wrapper.text()).toContain('40%');
    expect(mount(MochiProgress).find('.head, [class*="head"]').exists()).toBe(false);
  });
});
