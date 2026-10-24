# 安装与接入

## 安装

```bash
pnpm add mochi-island-ui
```

组件库把 Vue 声明为 peer dependency（`^3.5.0`），不会重复打包 Vue。

## 引入主题

令牌样式表**不会**被自动注入——主题是使用者显式拥有的资源：

```ts
// main.ts
import 'mochi-island-ui/styles/tokens.css';
```

这一步是必须的。组件里所有颜色、间距、阴影都写作 `var(--mochi-*)`，没有令牌就只剩骨架。

## 组件引入

### 按需自动引入（推荐）

```ts
// vite.config.ts
import Components from 'unplugin-vue-components/vite';
import { MochiResolver } from 'mochi-island-ui/resolver';

export default defineConfig({
  plugins: [Components({ resolvers: [MochiResolver()] })],
});
```

`MochiResolver` 会把 `<MochiButton>` 解析到 `mochi-island-ui/components/button`，并注入
`mochi-island-ui/style.css`。若项目已全局引入样式，传 `{ importStyle: false }` 关掉注入。

### 手动引入

```ts
import 'mochi-island-ui/style.css';
import { MochiButton, MochiPanel } from 'mochi-island-ui';
```

也可以只拿单个组件：

```ts
import { MochiButton } from 'mochi-island-ui/components/button';
```

## 样式分层

| 文件 | 内容 | 何时引入 |
| --- | --- | --- |
| `mochi-island-ui/styles/tokens.css` | 所有 `--mochi-*` 变量 | 必须，且只引一次 |
| `mochi-island-ui/style.css` | 组件样式（CSS Modules 产物） | 手动引入时；用 Resolver 时自动注入 |

CSS Modules 的类名映射在 JS 里，所以样式必须整包引入——这是按需引入只对 JS 生效的原因。
对 12KB 的样式表来说，这个取舍换来的是零配置的类名隔离。

## 浏览器要求

构建目标是 ES2022，样式用到 `color-mix()`（Chrome 111+ / Safari 16.2+）。

## 内置文案国际化（1.1 起）

组件的内置文案（占位符、aria 标签、空态、单位）默认跟随中文，可一键切换英文：

```ts
import { setLocale } from 'mochi-island-ui';

setLocale('en-US'); // 切回中文：setLocale('zh-CN')
```

已挂载的组件会响应式跟随；你显式传入的 props（`placeholder`、`emptyText`、`closeLabel`…）永远优先于词典。
