# AI_USAGE — Mochi 组件速查（供 AI 工具与新人索引）

> 由 `docs/components/*.md` 的标题与首段描述提取（`node scripts/gen-ai-usage.mjs` 再生成）。
> **生成 UI 前先查此表：优先使用 Mochi 现成组件，而不是手写 HTML/CSS。**
> 组件总数：82；另有 setLocale/getLocale/useMessages、applyTheme、MochiResolver 等具名导出。
> 按需引入：unplugin-vue-components + MochiResolver（见 docs/guide/installation）。
> 图标规范：**不使用 emoji 做图标**；用 MochiIcon 适配 lucide-vue-next（见 docs/components/icon）。

| 组件 | 一句话 | 文档 |
| --- | --- | --- |
| MochiAffix | ```vue | [/components/page-extras](/components/page-extras) |
| MochiAlert | `role="status"`（polite），不会像 `role="alert"` 那样打断读屏正在读的内容。 | [/components/feedback](/components/feedback) |
| MochiAnchor | 滚动监听是**被动的**（`passive: true`），每帧只做一次 `getBoundingClientRect` 循环。 | [/components/page-extras](/components/page-extras) |
| MochiAutoComplete | 事件 `select(value)`。**自由输入是合法的**——它不是 Select，输什么就保留什么， | [/components/tree-search](/components/tree-search) |
| MochiAvatar | 上面第三个用了不存在的图片，`@error` 后自动退回首字——这一类兜底不写就会露出破图。 | [/components/basics](/components/basics) |
| MochiAvatarGroup | 头像组。叠放展示成员，悬停时头像被"拎起来"看一眼；超出的折叠成 +N。 | [/components/extras](/components/extras) |
| MochiBackTop | （暂无文档页）按需引入路径 mochi-island-ui/components/back-top | [/components/back-top](/components/back-top) |
| MochiBadge | 角标用 `box-shadow: 0 0 0 2px surface` 做出与底色的"挖孔"边界，不依赖背景色。 | [/components/basics](/components/basics) |
| MochiBanner | 页面级公告横幅。与 Alert 同一套语气语言，但形态是整行条幅；关闭时高度收起而不是瞬间消失。 | [/components/extras-2](/components/extras-2) |
| MochiBreadcrumb | 分隔符由 CSS `::before` 生成，不占 DOM，也不会被读屏念成"斜杠"。 | [/components/data-display](/components/data-display) |
| MochiButton | 胶囊按钮。主按钮带 3D 台阶，按下时整体下沉——位移量正好等于台阶高度。 | [/components/button](/components/button) |
| MochiCalendar | - 换月时整块网格按方向滑入 8px 并淡入——往后翻从右边来，往前翻从左边来 | [/components/menu-calendar](/components/menu-calendar) |
| MochiCarousel | :style="{ | [/components/carousel-time](/components/carousel-time) |
| MochiCascader | 触发框显示 `小镇 / 沙滩` 这样的路径串。点有下级的项追加一列，点叶子收起并回传完整路径。 | [/components/tree-search](/components/tree-search) |
| MochiCheckbox | 复选框。勾选标记是矢量路径，边缘保持锐利，不做任何模糊。 | [/components/checkbox](/components/checkbox) |
| MochiCodeInput | 兑换码输入。N 个单格，输一位自动前进，粘贴从当前位置铺开，填满抛 `complete`。 | [/components/extras](/components/extras) |
| MochiCollapse | 完成日常委托、捐建公共设施、保持环境整洁都会累积评价。 | [/components/navigation](/components/navigation) |
| MochiColorPicker | 颜色选择器。触发器显示色块与 HEX 值，弹层内是饱和度×明度面板 + 色相条 + HEX 输入 + 预设色板。 | [/components/color-picker](/components/color-picker) |
| MochiCommandPalette | 命令面板。`⌘K` / `Ctrl+K` 唤起的全局快捷入口：搜索过滤、方向键选择、回车执行。 | [/components/command-palette](/components/command-palette) |
| MochiCountdown | 倒计时。格子像游戏的活力值，每一位数字变化时弹一下，走完全部归零并抛 `finish`。 | [/components/extras](/components/extras) |
| MochiCountUp | 内部就是 `useCountUp` 组合式函数（rAF + easeOutCubic + `Intl.NumberFormat`）， | [/components/misc](/components/misc) |
| MochiDatePicker | 底下就是 `MochiCalendar`，外面套 `FieldShell`（同款凹陷槽）+ `Popover`（无边框模式）。 | [/components/menu-calendar](/components/menu-calendar) |
| MochiDescriptions | 语义是 `<dl>/<dt>/<dd>`，不是一排 div。 | [/components/data-display](/components/data-display) |
| MochiDialogBubble | 对话气泡。尾巴是两段 SVG 路径而不是 CSS 三角形——这样才能做出不对称的手绘弧度。 | [/components/dialog-bubble](/components/dialog-bubble) |
| MochiDivider | 带 `role="separator"` 与 `aria-orientation`。 | [/components/basics](/components/basics) |
| MochiDrawer | import { ref } from 'vue'; | [/components/overlays](/components/overlays) |
| MochiDropdown | 事件 `select(key)`。菜单项 `role="menuitem"`，`↑` `↓` 在可用项间移动焦点， | [/components/misc](/components/misc) |
| MochiEmpty | 还有一个 `#action` 插槽放按钮。空状态的插图只用了虚线圆盘，不引入图片资源。 | [/components/feedback](/components/feedback) |
| MochiForm | import { ref } from 'vue'; | [/components/forms-advanced](/components/forms-advanced) |
| MochiFormItem | （暂无文档页）按需引入路径 mochi-island-ui/components/form | [/components/form](/components/form) |
| MochiGrid | 12 列（可调）等宽栅格，`gap` 单位 px，子项用 MochiGridItem 控制 `span`；`sm`/`md`/`lg` 是从 640/768/1024px 起生效的覆盖档位，不传沿用更小档。 | [/components/layout-grid](/components/layout-grid) |
| MochiGridItem | （暂无文档页）按需引入路径 mochi-island-ui/components/grid | [/components/grid](/components/grid) |
| MochiIcon | 第三方图标适配器：接 [lucide-vue-next](https://lucide.dev) 等任意"一个图标一个组件"的图标库，统一尺寸令牌与卡通风描边。**本项目规范：不使用 emoji 做图标。** | [/components/icon](/components/icon) |
| MochiImage | src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='150'%3E%3Crect width='240' height='150' fill='%23f6e7d2'/%3E%3Ccircle cx='120' cy='70' r='36' fill='%23e8833a'/%3E%3Ctext x='120' y='132' text-anchor='middle' font-size='14' fill='%236b5d4f'%3E中心广场%3C/text%3E%3C/svg%3E" | [/components/page-extras](/components/page-extras) |
| MochiInput | 单行输入框。视觉上是一块内凹的槽，聚焦时槽内仍保持凹陷，焦点环画在槽外。 | [/components/input](/components/input) |
| MochiInputNumber | `↑` / `↓` 也能增减；输入框是 `inputmode="decimal"`，手机上直接起数字键盘。 | [/components/forms-advanced](/components/forms-advanced) |
| MochiKbd | 键位徽章。展示快捷键或按键提示，与 CommandPalette 里的键位同一套视觉。 | [/components/extras-2](/components/extras-2) |
| MochiLayout | 页面骨架：默认纵向（Header/Content/Footer），`hasSider` 切横排容纳侧栏。骨架本身不带视觉，边框与底色在各区自己身上。 | [/components/layout-grid](/components/layout-grid) |
| MochiLayoutContent | （暂无文档页）按需引入路径 mochi-island-ui/components/layout | [/components/layout](/components/layout) |
| MochiLayoutFooter | （暂无文档页）按需引入路径 mochi-island-ui/components/layout | [/components/layout](/components/layout) |
| MochiLayoutHeader | （暂无文档页）按需引入路径 mochi-island-ui/components/layout | [/components/layout](/components/layout) |
| MochiLayoutSider | （暂无文档页）按需引入路径 mochi-island-ui/components/layout | [/components/layout](/components/layout) |
| MochiLink | **动效**：下划线用 `background-size` 从 0 拉满（不触发重排），外链箭头同时向右上轻移 1px。 | [/components/misc](/components/misc) |
| MochiList | 列表。提供行距、分隔线与**错峰入场**——`--mochi-stagger` 这个令牌就是为它准备的。 | [/components/list](/components/list) |
| MochiLoadMore | 加载更多。三种状态一个组件：可点击 → 加载中（线团旋转）→ 没有更多（虚线灰签）。 | [/components/extras-2](/components/extras-2) |
| MochiMentions | 提及输入框。输入触发字符（默认 `@`）唤起候选列表，选中后拼回正文。 | [/components/mentions](/components/mentions) |
| MochiMenu | 当前菜单：<code>{{ activeMenu }}</code> · 当前日期：<code>{{ date ? date.toLocaleDateString('zh-CN') : '未选' }}</code> | [/components/menu-calendar](/components/menu-calendar) |
| MochiModal | 对话框。遮罩淡入、面板弹起，焦点锁在内部。 | [/components/modal](/components/modal) |
| MochiPagination | `v-model` 绑定当前页。页码折叠规则：总数超过 `siblings × 2 + 5` 时才出现省略号， | [/components/navigation-extra](/components/navigation-extra) |
| MochiPanel | 带 header / body / footer 三段 anatomy 的面板。三层边框：外描边 → 4px 空气层 → 内描边。 | [/components/panel](/components/panel) |
| MochiPopconfirm | 事件：`confirm` / `cancel`。确认后自动收起。 | [/components/toast-popover](/components/toast-popover) |
| MochiPopover | 点击外部或按 Esc 关闭。 | [/components/toast-popover](/components/toast-popover) |
| MochiProgress | 进度条。数值变化时条子平滑推进，越界值会被夹在 0–100%。 | [/components/progress](/components/progress) |
| MochiProgressRing | 环形进度。数值变化时沿圆弧平滑推进，圆心显示百分比。 | [/components/extras](/components/extras) |
| MochiQRCode | 二维码。SVG 渲染、内容变化时弹簧重绘，中文自动按 UTF-8 编码。 | [/components/qrcode](/components/qrcode) |
| MochiRadioGroup | 单选组。原生 radio + `fieldset`/`legend`，方向键在一组内切换是浏览器自带能力。 | [/components/radio](/components/radio) |
| MochiRate | 评分。五个原生 radio 藏起来，可见的是星星。 | [/components/rate](/components/rate) |
| MochiResult | 插槽：默认（额外内容）、`actions`。 | [/components/misc](/components/misc) |
| MochiSegmented | 选中块是两个按钮之间**滑过去**的（和 Tabs 同一套测位逻辑），不是各自换底色。 | [/components/forms-advanced](/components/forms-advanced) |
| MochiSelect | 选择器。自绘弹层，视觉与其余组件一致。 | [/components/select](/components/select) |
| MochiSkeleton | 骨架整体 `aria-hidden`——读屏用户不需要听"正在加载的灰色方块"。 | [/components/feedback](/components/feedback) |
| MochiSlider | 底层是**透明铺在最上层的原生 `range`**：拖拽、方向键、读屏、触摸全部免费， | [/components/forms-advanced](/components/forms-advanced) |
| MochiSpace | ```vue | [/components/misc](/components/misc) |
| MochiSpinner | 外层 `role="status"`，旋转环本身 `aria-hidden`。`prefers-reduced-motion` 下把转速放慢到 3s， | [/components/feedback](/components/feedback) |
| MochiStatistic | 数字从 0 滚到目标值，`easeOutCubic` 收尾，用 `Intl.NumberFormat` 加千分位。 | [/components/data-display](/components/data-display) |
| MochiSteps | import { ref } from 'vue'; | [/components/navigation-extra](/components/navigation-extra) |
| MochiSwitch | 开关。原生 checkbox 承载语义与键盘行为（空格键切换），视觉交给轨道和滑块。 | [/components/switch](/components/switch) |
| MochiTable | 插槽：`cell-{key}` 自定义单元格（收到 `row` / `value` / `index`），`empty` 自定义空态。 | [/components/table-upload](/components/table-upload) |
| MochiTabs | import { ref } from 'vue'; | [/components/navigation](/components/navigation) |
| MochiTag | 标签 / 胶囊徽章。色相只由底色和描边承担，文字一律使用 `--mochi-ink`。 | [/components/tag](/components/tag) |
| MochiTagInput | 标签输入。Enter 或分隔符添加，退格删除末尾，到上限后输入框让位给提示文案。 | [/components/extras](/components/extras) |
| MochiText | ```vue | [/components/misc](/components/misc) |
| MochiTextarea | 多行输入。外壳与 `MochiInput` 共用同一个内部组件，所以两者的凹陷槽、label、hint 永远一致。 | [/components/textarea](/components/textarea) |
| MochiTimeline | 色点按索引错峰 60ms 弹入（`--mochi-stagger`），轴线是静态的——动的东西只该有一个焦点。 | [/components/data-display](/components/data-display) |
| MochiTimePicker | 两列 24/60 个选项，打开时用 `scrollIntoView({ block: 'center' })` 把已选项滑到列中间—— | [/components/carousel-time](/components/carousel-time) |
| MochiToastHost | ```ts | [/components/toast-popover](/components/toast-popover) |
| MochiTooltip | 鼠标移入、键盘聚焦都会显示；离开或失焦立即消失。气泡带 `role="tooltip"`。 | [/components/overlays](/components/overlays) |
| MochiTransfer | 穿梭框。双栏勾选 + 中间按钮搬运，用于「从一批候选里挑出一组」的场景。 | [/components/transfer](/components/transfer) |
| MochiTree | 递归渲染靠 `MochiTreeRow` 引用自身完成，缩进 = 深度 × 16px。 | [/components/tree-search](/components/tree-search) |
| MochiTreeSelect | 就是 Tree 套了壳：FieldShell 的凹陷槽 + Popover + Tree 本体，展开动画直接继承。 | [/components/tree-search](/components/tree-search) |
| MochiUpload | 事件：`change(files: File[])`。**它只负责选择和列表，不上传**——上传请求的鉴权、并发、 | [/components/table-upload](/components/table-upload) |
| MochiWatermark | 这块内容的水印是 canvas 生成的：文字先画到离屏 canvas，旋转后转成 dataURL， | [/components/page-extras](/components/page-extras) |
