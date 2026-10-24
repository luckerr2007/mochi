import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  // 组件测试需要编译 SFC
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    include: ['src/**/*.spec.ts'],
    // jsdom 很吃内存：限制并发，否则十几个文件同时起 worker 会把进程拖崩
    pool: 'forks',
    maxWorkers: 2,
  },
});
