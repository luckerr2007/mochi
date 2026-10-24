import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
// 直接引源码，避免改 resolver 之前必须先 build 一次
import { MochiResolver } from '../packages/mochi-island-ui/src/resolver.ts';

export default defineConfig({
  plugins: [
    vue(),
    Components({
      // importStyle 关掉：dev 下组件就是从 src 编译的，样式由 SFC 自带
      resolvers: [MochiResolver({ importStyle: false })],
      dirs: [],
      dts: 'src/components.d.ts',
    }),
  ],
  resolve: {
    // 直连源码而非构建产物：改 tokens.css 立即热更新，这是验证运行时换肤的前提
    alias: {
      'mochi-island-ui': fileURLToPath(new URL('../packages/mochi-island-ui/src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    // 手动 pnpm dev 时端口被占用就自动顺延；
    // Mochi.command 启动时会显式传 --strictPort，保证脚本知道确切端口
    strictPort: false,
  },
});
