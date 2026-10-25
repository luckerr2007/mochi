import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { Sparkles } from 'lucide-vue-next';
import MochiIcon from './MochiIcon.vue';

describe('MochiIcon', () => {
  it('渲染第三方图标，尺寸令牌与卡通风描边生效', () => {
    const wrapper = mount(MochiIcon, { props: { icon: Sparkles } });
    const svg = wrapper.find('svg');
    expect(svg.exists()).toBe(true);
    expect(svg.attributes('width')).toBe('20');
    expect(svg.attributes('height')).toBe('20');
    expect(svg.attributes('stroke-width')).toBe('2.2');
  });

  it('sm/lg 令牌与数字尺寸', () => {
    const small = mount(MochiIcon, { props: { icon: Sparkles, size: 'sm' } });
    expect(small.find('svg').attributes('width')).toBe('16');
    const custom = mount(MochiIcon, { props: { icon: Sparkles, size: 32 } });
    expect(custom.find('svg').attributes('width')).toBe('32');
  });

  it('默认装饰性 aria-hidden；给 label 时转为可读图标', () => {
    const decorative = mount(MochiIcon, { props: { icon: Sparkles } });
    expect(decorative.find('svg').attributes('aria-hidden')).toBe('true');

    const meaningful = mount(MochiIcon, { props: { icon: Sparkles, label: '闪光' } });
    const svg = meaningful.find('svg');
    expect(svg.attributes('role')).toBe('img');
    expect(svg.attributes('aria-label')).toBe('闪光');
    expect(svg.attributes('aria-hidden')).toBeUndefined();
  });

  it('描边宽度可调', () => {
    const thin = mount(MochiIcon, { props: { icon: Sparkles, strokeWidth: 1.5 } });
    expect(thin.find('svg').attributes('stroke-width')).toBe('1.5');
  });
});
