# 大厂组件清单对照

按 2026 年各库文档的组件覆盖面整理。列是"有没有这个组件"，不是 API 细节。

- **AntD** = Ant Design 5（React）
- **EP** = Element Plus（Vue 3）
- **MUI** = Material UI 6（React）
- **Chakra** = Chakra UI v3
- **shadcn** = shadcn/ui（Radix 底座）
- **Naive** = Naive UI（Vue 3）
- **Mochi** = 本项目

## 通用（General）

| 组件 | AntD | EP | MUI | Chakra | shadcn | Naive | Mochi |
| --- | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| Button 按钮 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Icon 图标 | ✅ | ✅ | ✅ | — | ✅ | ✅ | ❌ 需要图标包 |
| Typography 排版 | ✅ | — | ✅ | — | — | — | ✅ MochiText |
| Divider 分割线 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Link 链接 | ✅ | ✅ | ✅ | — | — | ✅ | ✅ |
| Space / Stack 间距 | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ |
| Layout 布局 | ✅ | ✅ | — | — | — | ✅ | ❌ |
| Grid 栅格 | ✅ | ✅ | ✅ | ✅ | — | ✅ | ❌ |
| Affix 固钉 | ✅ | — | — | — | — | ✅ | ✅ |

## 数据录入（Data Entry）

| 组件 | AntD | EP | MUI | Chakra | shadcn | Naive | Mochi |
| --- | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| Input 输入框 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Textarea | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| InputNumber 数字输入 | ✅ | ✅ | — | ✅ | — | ✅ | ✅ |
| Select 选择器 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Cascader 级联 | ✅ | ✅ | — | — | — | ✅ | ❌ |
| TreeSelect | ✅ | ✅ | — | — | — | ✅ | ❌ |
| AutoComplete 自动完成 | ✅ | ✅ | ✅ | — | — | ✅ | ✅ |
| Checkbox | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Radio | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Switch 开关 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Slider 滑动输入 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Rate 评分 | ✅ | ✅ | ✅ | — | — | ✅ | ✅ |
| Form 表单 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Upload 上传 | ✅ | ✅ | — | — | — | ✅ | ❌ |
| Transfer 穿梭框 | ✅ | ✅ | — | — | — | ✅ | ✅ |
| DatePicker 日期 | ✅ | ✅ | ✅ | — | ✅ | ✅ | ✅ |
| TimePicker 时间 | ✅ | ✅ | ✅ | — | — | ✅ | ✅ |
| Calendar 日历 | ✅ | ✅ | ✅ | — | ✅ | ✅ | ✅ |
| ColorPicker 颜色 | ✅ | ✅ | — | — | — | ✅ | ✅ |
| Segmented 分段控制 | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ |
| Mentions 提及 | ✅ | — | — | — | — | ✅ | ✅ |

## 数据展示（Data Display）

| 组件 | AntD | EP | MUI | Chakra | shadcn | Naive | Mochi |
| --- | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| Table 表格 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Pagination 分页 | ✅ | ✅ | ✅ | — | ✅ | ✅ | ✅ |
| Tabs 标签页 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Collapse 折叠 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Timeline 时间轴 | ✅ | ✅ | ✅ | — | — | ✅ | ✅ |
| List 列表 | ✅ | — | ✅ | ✅ | — | ✅ | ✅ |
| Card 卡片 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ 由 Panel 覆盖 |
| Descriptions 描述列表 | ✅ | ✅ | — | — | — | ✅ | ✅ |
| Statistic 统计数值 | ✅ | ✅ | — | — | — | ✅ | ✅ |
| Avatar 头像 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Badge 徽标 | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ |
| Tag 标签 | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ |
| Tooltip 文字提示 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Popover 气泡卡片 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Empty 空状态 | ✅ | ✅ | — | — | — | ✅ | ✅ |
| Image 图片预览 | ✅ | ✅ | — | — | — | ✅ | ✅ |
| Carousel 走马灯 | ✅ | ✅ | — | ✅ | ✅ | ✅ | ✅ |
| QRCode 二维码 | ✅ | ✅ | — | — | — | ✅ | ✅ |
| Tree 树形控件 | ✅ | ✅ | ✅ | — | — | ✅ | ❌ |
| Calendar 日历卡片 | ✅ | ✅ | — | — | — | ✅ | ❌ |

## 反馈（Feedback）

| 组件 | AntD | EP | MUI | Chakra | shadcn | Naive | Mochi |
| --- | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| Alert 警告 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Modal 对话框 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Drawer 抽屉 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Message / Toast | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Notification 通知 | ✅ | ✅ | ✅ | ✅ | — | ✅ | ❌ |
| Popconfirm 气泡确认 | ✅ | ✅ | — | — | ✅ | ✅ | ✅ |
| Progress 进度条 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Skeleton 骨架屏 | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ |
| Spin 加载中 | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ |
| Result 结果页 | ✅ | ✅ | — | — | — | ✅ | ✅ |
| BackTop 回到顶部 | ✅ | ✅ | — | — | — | ✅ | ✅ |
| Watermark 水印 | ✅ | ✅ | — | — | — | ✅ | ✅ |

## 导航（Navigation）

| 组件 | AntD | EP | MUI | Chakra | shadcn | Naive | Mochi |
| --- | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| Breadcrumb 面包屑 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Dropdown 下拉菜单 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Menu 导航菜单 | ✅ | ✅ | ✅ | — | ✅ | ✅ | ✅ |
| Steps 步骤条 | ✅ | ✅ | ✅ | — | — | ✅ | ✅ |
| Segmented（也作导航） | ✅ | ✅ | ✅ | — | — | ✅ | ✅ |
| Anchor 锚点 | ✅ | ✅ | — | — | — | — | ✅ |
| CommandPalette | — | — | — | — | ✅ | — | ✅ |

## 结论

大厂的核心集大概 **60 个组件**，其中"每个库都有"的真·通用件约 **40 个**。
Mochi 现在覆盖 **74 个**（Panel 顶替 Card，DialogBubble 是自有的），六家共有的 P2 场景件
（Transfer / ColorPicker / Mentions / QRCode）与 shadcn 的 CommandPalette 已在 2026-10-24 补齐。

对照表里仍未打勾的都是「明确不做」：Icon 交给图标包、Grid/Layout 不包一层、
富文本编辑器超出本库的定位。

数字以本表为准，`BACKLOG.md` 里维护的是带优先级的待办。
