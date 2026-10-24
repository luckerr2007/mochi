# Mochi UI Skill

给 AI 编码代理看的知识包：教它按 Mochi 的设计语言搭 Vue 页面。
**这里只有约束，没有代码**——不改变你的工程结构，只规定"怎么写"。

## 场景路由

| 你要做什么 | 读哪里 |
| --- | --- |
| 在已有 Vue 项目里用 `mochi-island-ui` | 本文件的「接入」+ 令牌表 |
| 用 Mochi 的语言写自己的组件 | `docs/guide/custom-components.md`（规则 + 优惠券示例）|
| 需要某个组件的 props | `docs/components/*.md`，逐个对照，**不要凭印象编造** |

## 硬性规则（违反即视为 bug）

1. **不允许出现裸色值**。所有颜色、间距、圆角、阴影、时长必须写成 `var(--mochi-*)`。
   需要在两个令牌之间取值时用 `color-mix()`，不要写十六进制。
2. **不允许纯黑文字**。正文是 `--mochi-ink`（深棕 `#3d2f28`），次要文字是 `--mochi-ink-soft`。
3. **不允许冷蓝色焦点环**。焦点一律 `box-shadow: var(--mochi-focus-ring)`，禁止改回 `outline: auto`。
4. **边缘锐利、氛围柔和**：边框/文字/图标不做 blur；阴影大 blur、低透明度。
5. **间距只能是 4px 的整数倍**（`--mochi-space-*`），边框宽度、阴影偏移一律整数 px。
6. **动效只用令牌里的曲线与时长**，按下位移量必须等于 `--mochi-shadow-offset`。
7. **`prefers-reduced-motion` 必须降级**：去掉过渡与位移，但保留状态反馈（颜色、展开）。

## 接入

```ts
import 'mochi-island-ui/styles/tokens.css';        // 必须
import 'mochi-island-ui/style.css';                // 或交给 Resolver 自动注入
```

```ts
Components({ resolvers: [MochiResolver()] }); // mochi-island-ui/resolver
```

## 令牌（详见 `docs/guide/theming.md`）

色彩 `--mochi-primary` `--mochi-primary-deep` `--mochi-primary-soft` `--mochi-on-primary`
`--mochi-bg` `--mochi-bg-sunken` `--mochi-surface` `--mochi-surface-sunken`
`--mochi-ink` `--mochi-ink-soft` `--mochi-line` `--mochi-line-strong`
`--mochi-accent` `--mochi-accent-candy` `--mochi-danger`

几何 `--mochi-radius-xs|sm|md|lg|full` · `--mochi-space-unit|1|2|3|4|6|8` · `--mochi-border-hairline|width|width-strong`

立体 `--mochi-shadow-offset` `--mochi-shadow-press` `--mochi-shadow-press-color` `--mochi-shadow-soft` `--mochi-shadow-inset`

动效 `--mochi-spring` `--mochi-ease-out` `--mochi-duration-fast|base|slow` `--mochi-stagger`

字体 `--mochi-font-family|size-sm|size-base|size-lg|line-height|weight-normal|weight-bold`

## 组件索引

| 分类 | 组件 | 子路径 |
| --- | --- | --- |
| 基础 | Button / Tag / Divider / Badge / Avatar / AvatarGroup / Space / Link / Text / Image / Watermark | `mochi-island-ui/components/{button,tag,divider,badge,avatar,space,link,text,image,watermark}` |
| 表单 | Input / Textarea / Select / Switch / Checkbox / RadioGroup / Rate / Form·FormItem / InputNumber / Slider / Segmented / Upload / DatePicker / TimePicker / AutoComplete / Cascader / TreeSelect / Mentions / Transfer / ColorPicker / TagInput / CodeInput | `mochi-island-ui/components/{input,textarea,select,switch,checkbox,radio,rate,form,input-number,slider,segmented,upload,date-picker,time-picker,auto-complete,cascader,tree-select,mentions,transfer,color-picker}` |
| 反馈 | Alert / Banner / Spinner / Skeleton / Empty / Modal / Drawer / Tooltip / Toast(useToast) / Popover / Popconfirm / Result / CommandPalette / LoadMore | `mochi-island-ui/components/{alert,banner,spinner,skeleton,empty,modal,drawer,tooltip,toast,popover,popconfirm,result,command-palette,kbd,load-more}` |
| 数据展示 | Panel / List / DialogBubble / Progress / ProgressRing / Tabs / Collapse / Statistic / Descriptions / Timeline / Table / CountUp / Countdown / Calendar / Tree / QRCode | `mochi-island-ui/components/{panel,list,bubble,progress,tabs,collapse,statistic,descriptions,timeline,table,count-up,calendar,tree,qrcode}` |
| 导航 | Pagination / Steps / Breadcrumb / Dropdown / Menu / Carousel / Anchor / Affix | `mochi-island-ui/components/{pagination,steps,breadcrumb,dropdown,menu,carousel,anchor,affix}` |

尺寸只有一个来源：`--mochi-control-sm|md|lg`（32/40/48）。详见 `docs/guide/metrics.md`。
还欠哪些组件：见仓库根目录 `BACKLOG.md`。

## 换肤

```ts
import { applyTheme } from 'mochi-island-ui';
const dispose = applyTheme({ '--mochi-primary': '#4fa89b', '--mochi-primary-deep': '#35786f' });
```

改主色时必须同时检查 `--mochi-on-primary` 的对比度——项目里有测试锁着 4.5:1。
