# Mochi

卡通风格的 Vue 3 组件库。设计语言工程化：所有视觉决策都落在 `--mochi-*` CSS 自定义属性上，
使用者无需改源码即可在运行时换肤。

```
packages/mochi-island-ui   组件库本体（Vite lib 模式，ESM + d.ts）
playground          本地调试站，别名直连 src，改令牌即时热更新
docs                VitePress 文档站，消费构建产物（先 build 再 dev）
```

## 脚本

| 命令 | 说明 |
| --- | --- |
| `pnpm dev` | 启动 playground（默认 5173，被占用则自动顺延） |
| `pnpm build` | 构建组件库到 `packages/mochi-island-ui/dist` |
| `pnpm test` | 运行 Vitest（令牌契约、对比度、组件行为、resolver） |
| `pnpm typecheck` | 全仓库类型检查 |
| `pnpm docs:dev` | 先 build 组件库，再起文档站 |
| `pnpm docs:build` | 构建文档站到 `docs/.vitepress/dist` |
| `pnpm pack:check` | `npm pack --dry-run`，确认发布内容只有 dist |

发布流程见 [RELEASE.md](./RELEASE.md)，`npm publish` 不自动化。

## 使用

```bash
pnpm add mochi-island-ui
```

```ts
// main.ts —— 主题必须显式引入（令牌是使用者拥有的资源，不由组件库自动注入）
import 'mochi-island-ui/styles/tokens.css';
```

组件有两种用法：

```ts
// A. 按需自动引入（推荐）
import Components from 'unplugin-vue-components/vite';
import { MochiResolver } from 'mochi-island-ui/resolver';

Components({ resolvers: [MochiResolver()] }); // 会自动注入 mochi-island-ui/style.css
```

```ts
// B. 手动引入
import 'mochi-island-ui/style.css';
import { MochiButton } from 'mochi-island-ui';
```

### MochiButton

| prop | 值 | 说明 |
| --- | --- | --- |
| `variant` | `primary` / `soft` / `ghost` | 只有前两者带 3D 台阶 |
| `size` | `sm` / `md` / `lg` | 内边距为 4px 网格整数倍 |
| `disabled` | `boolean` | 保留轮廓，去掉位移 |
| `type` | 原生 button type | 默认 `button` |

### MochiDialogBubble

| prop | 值 | 说明 |
| --- | --- | --- |
| `text` | `string` | 打字机效果的文字源；有默认插槽时插槽优先 |
| `placement` | `left` / `right` | 尾巴朝向，默认 `left` |
| `typewriter` | `boolean` | 逐字显示；`prefers-reduced-motion` 下自动跳过 |
| `speed` | `number` | 每字间隔毫秒，默认 30 |

尾巴是两段 SVG 路径（一段 fill 盖住气泡描边做接缝，一段只描外轮廓），
不是 CSS 三角形——这样才能做出不对称的手绘弧度。

### MochiPanel

| 部分 | 用法 |
| --- | --- |
| header | `title` prop 或 `#header` 插槽（插槽优先） |
| body | 默认插槽 |
| footer | `#footer` 插槽，无插槽时不渲染 |

`headingLevel` 控制标题层级（默认 3），避免在文档里跳级。
三层边框由「外描边 + 内嵌 4px 空气层 + 内描边」的 inset 阴影叠成。

### 表单件

| 组件 | 关键 props | 说明 |
| --- | --- | --- |
| `MochiInput` | `label` `hint` `invalid` `disabled` `readonly` `type` | `v-model` 绑字符串；label / hint 的 id 自动关联，`invalid` 同步 `aria-invalid` |
| `MochiSwitch` | `label` `disabled` | `v-model` 绑布尔；原生 checkbox + `role="switch"`，空格键可切换 |
| `MochiCheckbox` | `label` `disabled` | `v-model` 绑布尔；勾选标记是矢量路径 |
| `MochiTag` | `tone` `closable` `closeLabel` | `tone`: `neutral` / `accent` / `candy` / `danger`；`closable` 时抛 `close` |

表单件的四条统一规则：文字一律 `--mochi-ink`（13px 也达 4.5:1）、色相只由底色与描边承担、
聚焦环统一双层结构、`prefers-reduced-motion` 下移除过渡但保留状态反馈。

## 一键启停（macOS）

双击根目录的 **`Mochi.command`**：未运行则启动并打开浏览器，运行中则关闭。
也可以在终端里用参数：

```bash
./Mochi.command start|stop|restart|status|logs
MOCHI_PORT=6000 ./Mochi.command start   # 指定端口
```

- 服务以 `nohup` 脱离终端，关掉 Terminal 窗口不会中断；
- 5173 被其它项目占用时会自动换到下一个空闲端口，实际端口写在 `.run/port`；
- 判断"是否在运行"看监听进程的工作目录是否在本仓库内，不会误判别的项目；
- 日志在 `.run/playground.log`。

## 令牌

`packages/mochi-island-ui/src/styles/tokens.css` 是唯一主题来源，组件通过 `var(--mochi-*)` 取值。
运行时覆盖：

```ts
import { applyTheme } from 'mochi-island-ui'

const dispose = applyTheme({ '--mochi-primary': '#4fa89b' })
dispose() // 还原
```
