# mochi-island-ui

卡通风格的 Vue 3 组件库。设计令牌全部是 CSS 自定义属性，**不改源码就能运行时换肤**。

- 暖米白画布 + 深棕文字（非纯黑）、大圆角、柔和低对比阴影
- 4px 间距网格，多层描边，按下位移 + 实色台阶
- 弹簧曲线、错峰入场，动效参数全部暴露为令牌
- 尊重 `prefers-reduced-motion`，焦点环双层可见

## 安装

```bash
pnpm add mochi-island-ui
```

## 接入

```ts
// main.ts —— 主题必须显式引入
import 'mochi-island-ui/styles/tokens.css';
```

```ts
// vite.config.ts —— 按需自动引入（推荐）
import Components from 'unplugin-vue-components/vite';
import { MochiResolver } from 'mochi-island-ui/resolver';

export default defineConfig({
  plugins: [Components({ resolvers: [MochiResolver()] })],
});
```

手动引入：

```ts
import 'mochi-island-ui/style.css';
import { MochiButton } from 'mochi-island-ui';
```

## 运行时换肤

```ts
import { applyTheme } from 'mochi-island-ui';

const dispose = applyTheme({ '--mochi-primary': '#4fa89b' });
dispose(); // 还原
```

## 组件

`MochiButton`、`MochiDialogBubble`、`MochiPanel`、`MochiInput`、`MochiTextarea`、
`MochiSwitch`、`MochiCheckbox`、`MochiRadioGroup`、`MochiTag`、`MochiProgress`、`MochiList`。

## 许可

MIT
