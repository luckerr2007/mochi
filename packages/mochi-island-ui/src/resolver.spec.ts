import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { ComponentInfo } from 'unplugin-vue-components/types';
import { describe, expect, it } from 'vitest';
import * as library from './index';
import { MochiResolver, mochiComponentDirs, type MochiResolverOptions } from './resolver';

function resolveComponent(name: string, options?: MochiResolverOptions) {
  return MochiResolver(options).resolve(name) as ComponentInfo | undefined;
}

describe('MochiResolver', () => {
  it('把 MochiButton 指向 button 子路径并附带样式', () => {
    expect(resolveComponent('MochiButton')).toEqual({
      name: 'MochiButton',
      from: 'mochi-island-ui/components/button',
      sideEffects: ['mochi-island-ui/style.css'],
    });
  });

  it('importStyle: false 时不注入样式', () => {
    expect(resolveComponent('MochiButton', { importStyle: false })).toEqual({
      name: 'MochiButton',
      from: 'mochi-island-ui/components/button',
    });
  });

  it('不接管未登记的组件名', () => {
    expect(resolveComponent('ElButton')).toBeUndefined();
    expect(resolveComponent('MochiNotExist')).toBeUndefined();
  });

  it('注册表里的每个组件都能从对应子路径导出', () => {
    for (const [name, dir] of Object.entries(mochiComponentDirs)) {
      // 子路径必须真有 barrel，否则按需引入会指向不存在的文件
      const barrelPath = resolve(process.cwd(), `src/components/${dir}/index.ts`);
      expect(existsSync(barrelPath), `components/${dir}/index.ts 不存在`).toBe(true);
      expect(readFileSync(barrelPath, 'utf8'), `components/${dir} 未导出 ${name}`).toContain(
        `as ${name}`,
      );

      // 同时必须能从包根拿到同一个组件
      expect(library[name as keyof typeof library], `包根未导出 ${name}`).toBeTruthy();
    }
  });
});
