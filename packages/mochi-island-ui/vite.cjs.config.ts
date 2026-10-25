import base from './vite.config';

/**
 * CJS 通道：复用主配置二次构建，输出 [name].cjs 与 ESM 并存。
 * ESM 文件名/路径保持不变（back-compat），CJS 仅通过 exports 的 require 条件暴露。
 */
export default {
  ...base,
  build: {
    ...base.build,
    // ESM 产物已由主构建清空目录产出，这里只追加 CJS
    emptyOutDir: false,
    lib: {
      ...base.build!.lib!,
      formats: ['cjs'] as const,
    },
    rollupOptions: {
      ...base.build!.rollupOptions,
      output: {
        preserveModules: true,
        entryFileNames: '[name].cjs',
        assetFileNames: 'style.cjs.css',
      },
    },
  },
};
