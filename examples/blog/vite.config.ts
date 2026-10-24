import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  // 部署在 mochi.liveroom.dpdns.org/blog/ 子路径下
  base: '/blog/',
  plugins: [vue()],
  resolve: {
    // 开发时直连库源码；构建产物自包含
    alias: {
      'mochi-island-ui': fileURLToPath(new URL('../../packages/mochi-island-ui/src', import.meta.url)),
    },
  },
  css: { postcss: {} },
});
