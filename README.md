<div align="center">

# Mochi Island UI

**会呼吸的卡通风 Vue 3 组件库 —— 设计令牌即 API**

[![npm](https://img.shields.io/npm/v/mochi-island-ui?color=e8613c&label=npm)](https://www.npmjs.com/package/mochi-island-ui)
[![license](https://img.shields.io/npm/l/mochi-island-ui?color=e8613c)](./LICENSE)
[![CI](https://github.com/luckerr2007/mochi/actions/workflows/ci.yml/badge.svg)](https://github.com/luckerr2007/mochi/actions/workflows/ci.yml)
[![tests](https://img.shields.io/badge/tests-150%20passed-brightgreen)](./packages/mochi-island-ui)

[文档站](https://mochi.liveroom.dpdns.org/) · [English Docs](https://mochi.liveroom.dpdns.org/en/) · [博客模板示例](https://mochi.liveroom.dpdns.org/blog/)

</div>

---

**English readers:** Mochi Island UI is a cartoon-soft Vue 3 component library where the design tokens are the API — every color, spacing, radius and motion parameter is a `--mochi-*` CSS custom property, so runtime theming needs no rebuild. 82 components, 150 tests, ESM + CJS, built-in zh-CN/en-US strings, full keyboard and `prefers-reduced-motion` support.

## 为什么是 Mochi

- **令牌即 API**：所有视觉决策落在 `--mochi-*` CSS 自定义属性上，`applyTheme()` 一行换肤，无需重新构建
- **82 个组件**，对照 AntD / Element Plus / MUI / Naive 的覆盖矩阵零缺口（[对照表](https://mochi.liveroom.dpdns.org/guide/inventory)）
- **性能为内生能力**：万行表格渐进分片渲染（首屏最高提速约 24 倍）、排序 v-memo 缓存（约 2.5 倍）、硬件自适应的 CSS 虚拟化（`virtual: 'auto'` 低端设备自动开启）
- **无障碍与克制动效**：ARIA 全覆盖、键盘导航、`prefers-reduced-motion` 优雅降级
- **工程完整**：Vitest 150 测试、ESLint / Prettier / Stylelint / Commitlint / Husky、Playwright 视觉回归基线、GitHub Actions CI
- **AI 友好**：根目录 [`AI_USAGE.md`](./AI_USAGE.md) 是全量组件速查索引，生成 UI 前先查表

## 快速上手

```bash
pnpm add mochi-island-ui
```

```ts
// main.ts —— 令牌是使用者拥有的资源，必须显式引入（不由组件库自动注入）
import 'mochi-island-ui/styles/tokens.css'
```

按需自动引入（推荐）：

```ts
import Components from 'unplugin-vue-components/vite'
import { MochiResolver } from 'mochi-island-ui/resolver'

Components({ resolvers: [MochiResolver()] }) // 样式自动注入
```

或全量手动引入：

```ts
import 'mochi-island-ui/style.css'
import { MochiButton, MochiTable } from 'mochi-island-ui'
```

运行时换肤：

```ts
import { applyTheme, setLocale } from 'mochi-island-ui'

const dispose = applyTheme({ '--mochi-primary': '#4fa89b' })
dispose() // 还原

setLocale('en-US') // 内置文案中英切换，props 永远优先
```

## 仓库结构

```
packages/mochi-island-ui   组件库本体（Vite lib 模式，ESM + CJS + d.ts，82 组件）
playground/                本地调试站，别名直连 src，改令牌即时热更新
docs/                      VitePress 文档站（中英双语），消费构建产物
visual/                    Playwright 视觉回归基线（14 节截图）
```

## 常用脚本

| 命令 | 说明 |
| --- | --- |
| `pnpm dev` | 启动 playground（端口被占自动顺延） |
| `pnpm build` | 构建组件库（ESM + CJS 双格式） |
| `pnpm test` | Vitest（令牌契约、对比度、组件行为、resolver） |
| `pnpm lint` | ESLint + Stylelint |
| `pnpm test:visual` | 视觉回归（改视觉后加 `-- --update-snapshots` 重建基线） |
| `pnpm docs:dev` / `docs:build` | 文档站开发 / 构建 |

发布流程见 [RELEASE.md](./RELEASE.md)。

## 约定

- **不使用 emoji 做图标**：图标一律走 [lucide-vue-next](https://lucide.dev) + `MochiIcon` 适配层（业务开发者按需引入）
- 边框、阴影偏移、间距全部整数像素（4px 网格），杜绝半像素模糊
- 组件文案走词典（`props.x ?? m.xxx`），使用者传值永远优先
- 新增组件同步：`resolver.ts`（唯一注册事实源）+ `global.d.ts` + `AI_USAGE.md`（`node scripts/gen-ai-usage.mjs` 再生成）

## License

[MIT](./LICENSE)
