# 组件进度台账

> 唯一用途：知道自己还欠多少组件。新增前先在这里登记，写完把行移到「已完成」。
> 最后更新：2026-10-24 · **已实现 74 / 待写 0**（覆盖对照见 `docs/guide/inventory.md`）

## 已完成（74）

| 分类 | 组件 |
| --- | --- |
| 基础 | Button · Tag · Divider · Badge · Avatar · AvatarGroup · Space · Link · Text · Kbd · Image · Watermark |
| 表单 | Input · Textarea · Select · Switch · Checkbox · RadioGroup · Rate · Form / FormItem · InputNumber · Slider · Segmented · Upload · DatePicker · TimePicker · AutoComplete · Cascader · TreeSelect · Mentions · Transfer · ColorPicker · TagInput · CodeInput |
| 反馈 | Alert · Banner · Spinner · Skeleton · Empty · Modal · Drawer · Tooltip · Toast · Popover · Popconfirm · Result · CommandPalette · LoadMore |
| 数据展示 | Panel · List · DialogBubble · Progress · ProgressRing · Tabs · Collapse · Statistic · Descriptions · Timeline · Table · CountUp · Countdown · Calendar · Tree · QRCode |
| 导航 | Pagination · Steps · Breadcrumb · Dropdown · Menu · Carousel · Anchor · Affix |
| 工具 | BackTop · Resolver · applyTheme |

## 待写（0）

P0 / P1 / P2 已全部清空（2026-10-24：Transfer、ColorPicker、Mentions、QRCode、CommandPalette 交付）。
大厂对照表里剩下的都是「明确不做」的（见下）。

### 明确不做

`Icon`（应依赖图标包，不该自己画）· `Grid / Layout`（CSS Grid 已经够用，包一层只会挡路）·
`Cursor / Background / CodeBlock`（那是网站装饰，不是组件）·
`Notification`（Toast 已覆盖，不养两套通知）· 富文本编辑器（重活且与卡通语言相性差）

## 动效欠账（已清空，2026-10-24）

| 位置 | 原状 | 现状 |
| --- | --- | --- |
| Panel | 无入场 | `animate` prop：淡入上浮 + `--_i` 错峰，reduced-motion 降级 |
| Select | 选项高亮是各自换底色 | 共享滑动高亮块（JS 量 offsetTop/offsetHeight，transform+height 弹簧，同 Tabs 指示块；首帧定位不播过渡） |
| List | 只有首次错峰 | `animated` prop：TransitionGroup 增删位移，离场绝对定位补位不跳 |
| Table | 行 hover 瞬时/太快 | 行 hover 用 base 时长滑入；行入场错峰上浮（前 8 行，`--_i` 终于接上了） |
| Toast | 入场无错峰 | `cardEnter` 按堆叠序号 `--_i` 错峰（上限 3 步），`backwards` 保证延迟期隐藏 |

## 规则

1. 尺寸落在 `--mochi-control-sm|md|lg`（32/40/48），见 `docs/guide/metrics.md`。
2. 动效只用 `--mochi-spring` / `--mochi-spring-soft` / `--mochi-ease-out` / `--mochi-ease-in`
   与 `--mochi-duration-*`，并写 `prefers-reduced-motion` 降级。
3. 能交给平台就别自己写：Select 曾用原生 `<select>`、Collapse 用 `<details>`、Slider 用
   透明 `range` 覆盖——三次都省掉了大量自研逻辑。ColorPicker 的色相条沿用 range，
   QRCode 的 UTF-8 编码用 `TextEncoder`；但 QR 矩阵生成交给 qrcode-generator——
   「看起来不对」可以修，「扫不出来」不能修，这种地方用经过验证的实现。
4. 多根组件（含注释根）别在模板最外层放注释：@vue/test-utils 会拿第一个根节点当 wrapper，
   注释在前会让 html()/attributes() 全部失灵（Panel 踩过）。
