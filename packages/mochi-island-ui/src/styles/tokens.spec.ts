import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { applyTheme } from '../tokens';

// 直接读源文件：Vitest 默认不处理 CSS，走模块导入会拿到空字符串
const css = readFileSync(resolve(process.cwd(), 'src/styles/tokens.css'), 'utf8');
const rootBlock = css.slice(css.indexOf(':root {') + ':root {'.length, css.lastIndexOf('}'));

const declared = new Map<string, string>();
for (const match of rootBlock.matchAll(/(--mochi-[a-z0-9-]+)\s*:\s*([^;]+);/g)) {
  declared.set(match[1]!, match[2]!.trim());
}

describe('tokens.css 契约', () => {
  it('暴露了全部必需令牌', () => {
    const required = [
      '--mochi-primary',
      '--mochi-bg',
      '--mochi-ink',
      '--mochi-radius-sm',
      '--mochi-radius-md',
      '--mochi-radius-lg',
      '--mochi-space-unit',
      '--mochi-shadow-press',
      '--mochi-spring',
      '--mochi-duration-fast',
      '--mochi-duration-base',
      '--mochi-duration-slow',
      '--mochi-stagger',
    ];
    expect(required.filter((name) => !declared.has(name))).toEqual([]);
  });

  it('所有 var(--mochi-*) 引用都能解析到已声明的令牌', () => {
    const refs = [...css.matchAll(/var\(\s*(--mochi-[a-z0-9-]+)/g)].map((m) => m[1]!);
    expect(refs.filter((name) => !declared.has(name))).toEqual([]);
  });

  it('间距网格以 4px 为单位，且所有 px 值都是整数', () => {
    expect(declared.get('--mochi-space-unit')).toBe('4px');
    const fractional = [...declared]
      .filter(([, value]) => /^-?\d*\.\d+px$/.test(value))
      .map(([name]) => name);
    expect(fractional).toEqual([]);
  });

  it('没有声明散落在 :root 之外', () => {
    const outside = css.replace(rootBlock, '').match(/--mochi-[a-z0-9-]+\s*:/g) ?? [];
    expect(outside).toEqual([]);
  });
});

describe('对比度（WCAG AA 正文 4.5:1）', () => {
  function luminance(hex: string): number {
    const [r, g, b] = [1, 3, 5].map((i) => {
      const channel = parseInt(hex.slice(i, i + 2), 16) / 255;
      return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    }) as [number, number, number];
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  function contrast(a: string, b: string): number {
    const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
    return (light + 0.05) / (dark + 0.05);
  }

  const pairs: Array<[string, string]> = [
    ['--mochi-ink', '--mochi-bg'],
    ['--mochi-ink', '--mochi-surface'],
    ['--mochi-ink-soft', '--mochi-surface'],
    ['--mochi-on-primary', '--mochi-primary'],
    ['--mochi-on-primary', '--mochi-primary-soft'],
  ];

  it.each(pairs)('%s 在 %s 上不低于 4.5:1', (fg, bg) => {
    expect(declared.has(fg) && declared.has(bg)).toBe(true);
    expect(contrast(declared.get(fg)!, declared.get(bg)!)).toBeGreaterThanOrEqual(4.5);
  });
});

describe('applyTheme', () => {
  it('写入覆盖值并能完整还原', () => {
    const host = document.createElement('div');
    host.style.setProperty('--mochi-primary', '#f0875c');

    const dispose = applyTheme({ '--mochi-primary': '#4fa89b', '--mochi-radius-md': '24px' }, host);
    expect(host.style.getPropertyValue('--mochi-primary')).toBe('#4fa89b');
    expect(host.style.getPropertyValue('--mochi-radius-md')).toBe('24px');

    dispose();
    expect(host.style.getPropertyValue('--mochi-primary')).toBe('#f0875c');
    expect(host.style.getPropertyValue('--mochi-radius-md')).toBe('');
  });
});
