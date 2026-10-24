import { existsSync, readdirSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

const src = fileURLToPath(new URL('./src', import.meta.url));
const componentsDir = fileURLToPath(new URL('./src/components', import.meta.url));

/**
 * 每个组件目录的 index.ts 都是独立入口。
 * 不这样做的话，只有"纯转发"的 barrel 会被 tree-shaking 内联掉，
 * `mochi-island-ui/components/<name>` 这条按需引入路径就会指向不存在的文件。
 */
const componentEntries = Object.fromEntries(
  readdirSync(componentsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .filter((entry) => existsSync(`${componentsDir}/${entry.name}/index.ts`))
    .map((entry) => [`components/${entry.name}/index`, `${componentsDir}/${entry.name}/index.ts`]),
);

export default defineConfig({
  plugins: [
    vue(),
    dts({
      include: ['src/**/*.ts', 'src/**/*.vue'],
      exclude: ['src/**/*.spec.ts'],
      outDirs: 'dist',
      tsconfigPath: './tsconfig.json',
    }),
  ],
  // 组件库不引入任何 PostCSS 插件，显式给空配置，避免构建时向上搜索外部 postcss 配置
  css: {
    postcss: {},
  },
  build: {
    target: 'es2022',
    // CSS Modules 的类名映射在 JS 里，样式必须合并成单一文件随包发布，
    // 否则使用者按需引入组件时拿不到任何样式
    cssCodeSplit: false,
    lib: {
      entry: {
        index: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
        resolver: fileURLToPath(new URL('./src/resolver.ts', import.meta.url)),
        ...componentEntries,
      },
      formats: ['es'],
    },
    rollupOptions: {
      // vue 是 peer；qrcode-generator 是真依赖（MochiQRCode 用），
      // 标 external 让消费者从 dependencies 解析同一份，而不是把 pnpm 路径打进 dist
      external: ['vue', 'qrcode-generator'],
      output: {
        preserveModules: true,
        preserveModulesRoot: src,
        entryFileNames: '[name].js',
        assetFileNames: 'style.css',
      },
    },
  },
});
