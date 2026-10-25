import { expect, test } from '@playwright/test'

/**
 * 遍历 playground 分节截图，对照 visual/<platform>/ 下的本地基线。
 * 故意改动视觉（令牌/样式/组件）后：`pnpm test:visual -- --update-snapshots` 重建基线并随代码一起提交。
 */
const SECTIONS = [
  '按钮',
  '标签与徽标',
  '表单',
  '表单进阶',
  '数据展示',
  '反馈',
  '容器',
  '导航',
  '表单增强',
  '快捷与随行',
  '补充件',
  '新到件',
  '对话',
  '令牌',
  // 万行压测节是性能演示（渐进补齐/调度不定时），不做视觉基线
]

test('各分节视觉不漂移', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('domcontentloaded')
  await page.evaluate(() => document.fonts.ready)

  for (const label of SECTIONS) {
    await page.getByRole('button', { name: label, exact: true }).click()
    // 等节内容挂稳（v-if 节首帧 + 指示块 ResizeObserver 复测）
    await page.waitForTimeout(350)
    await expect(page).toHaveScreenshot(`section-${label}.png`, {
      fullPage: false,
    })
  }
})
