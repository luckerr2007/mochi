import { defineConfig } from '@playwright/test'

/**
 * 视觉回归：对 playground 各分节截图对比本地基线。
 *
 * 确定性手段：reduce 动效（全部组件都适配 prefers-reduced-motion，入场/错峰动画
 * 直接归零）+ 固定视口 + 等字体就绪。基线按平台区分（-darwin/-linux 后缀），
 * 换机器/CI 首跑用 --update-snapshots 重建。
 */
export default defineConfig({
  testDir: './visual',
  timeout: 60_000,
  retries: 0,
  use: {
    viewport: { width: 1280, height: 900 },
    reducedMotion: 'reduce',
    colorScheme: 'light',
    baseURL: 'http://localhost:4173',
  },
  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.01,
    },
  },
  webServer: {
    command: 'pnpm --filter playground exec vite --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: true,
    timeout: 120_000,
  },
})
