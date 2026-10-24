import { defineConfig } from 'vitepress';

export default defineConfig({
  lang: 'zh-CN',
  title: 'Mochi',
  description: '卡通风格的 Vue 3 组件库：设计令牌全部是 CSS 自定义属性，可在运行时换肤。',
  cleanUrls: true,
  // 当前令牌集只有浅色一套，关掉暗色切换，避免出现"点了没反应"的开关
  appearance: false,

  // 文档站消费构建产物（mochi-island-ui/dist），走 package exports 正常解析；
  // 因此 docs:dev 会先 build 一次组件库
  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/installation' },
      { text: '组件', link: '/components/button' },
      { text: '令牌', link: '/guide/theming' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '安装与接入', link: '/guide/installation' },
            { text: '设计令牌与换肤', link: '/guide/theming' },
            { text: '尺寸与动效标准', link: '/guide/metrics' },
            { text: '组件覆盖对照', link: '/guide/inventory' },
            { text: '自定义组件指南', link: '/guide/custom-components' },
          ],
        },
      ],
      '/components/': [
        {
          text: '基础',
          items: [
            { text: 'MochiButton', link: '/components/button' },
            { text: 'MochiTag', link: '/components/tag' },
            { text: 'MochiDivider · Badge · Avatar', link: '/components/basics' },
            { text: 'Dropdown · Result · Space · Link · Text · CountUp', link: '/components/misc' },
            { text: 'AvatarGroup · TagInput · Ring · CodeInput · Countdown', link: '/components/extras' },
            { text: 'Banner · LoadMore · Kbd', link: '/components/extras-2' },
          ],
        },
        {
          text: '表单',
          items: [
            { text: 'MochiInput', link: '/components/input' },
            { text: 'MochiTextarea', link: '/components/textarea' },
            { text: 'MochiSelect', link: '/components/select' },
            { text: 'MochiSwitch', link: '/components/switch' },
            { text: 'MochiCheckbox', link: '/components/checkbox' },
            { text: 'MochiRadioGroup', link: '/components/radio' },
            { text: 'MochiRate', link: '/components/rate' },
            { text: 'Form · InputNumber · Slider · Segmented', link: '/components/forms-advanced' },
            { text: 'MochiUpload', link: '/components/table-upload#mochiupload' },
            { text: 'MochiDatePicker', link: '/components/menu-calendar#mochidatepicker' },
            { text: 'MochiTimePicker', link: '/components/carousel-time#mochitimepicker' },
            { text: 'Cascader · TreeSelect · AutoComplete', link: '/components/tree-search' },
            { text: 'MochiMentions', link: '/components/mentions' },
            { text: 'MochiTransfer', link: '/components/transfer' },
            { text: 'MochiColorPicker', link: '/components/color-picker' },
          ],
        },
        {
          text: '反馈',
          items: [
            { text: 'MochiAlert', link: '/components/feedback' },
            { text: 'Spinner · Skeleton · Empty', link: '/components/feedback' },
            { text: 'MochiModal', link: '/components/modal' },
            { text: 'Tooltip · Drawer', link: '/components/overlays' },
            { text: 'Toast · Popover · Popconfirm', link: '/components/toast-popover' },
            { text: 'MochiCommandPalette', link: '/components/command-palette' },
          ],
        },
        {
          text: '导航',
          items: [
            { text: 'Pagination · Steps', link: '/components/navigation-extra' },
            { text: 'Menu · Calendar · DatePicker', link: '/components/menu-calendar' },
            { text: 'Anchor · Affix', link: '/components/page-extras#mochianchor' },
            { text: 'Tabs · Collapse', link: '/components/navigation' },
          ],
        },
        {
          text: '数据展示',
          items: [
            { text: 'MochiPanel', link: '/components/panel' },
            { text: 'MochiList', link: '/components/list' },
            { text: 'MochiDialogBubble', link: '/components/dialog-bubble' },
            { text: 'MochiProgress', link: '/components/progress' },
            { text: 'MochiCarousel', link: '/components/carousel-time' },
            { text: 'Image · Watermark', link: '/components/page-extras' },
            { text: 'MochiTree', link: '/components/tree-search' },
            { text: 'Cascader · TreeSelect', link: '/components/tree-search#mochicascader' },
            { text: 'MochiTable', link: '/components/table-upload' },
            { text: 'Statistic · Descriptions · Timeline · Breadcrumb', link: '/components/data-display' },
            { text: 'MochiQRCode', link: '/components/qrcode' },
          ],
        },
      ],
    },

    outline: { label: '本页目录', level: [2, 3] },
    docFooter: { prev: '上一篇', next: '下一篇' },
    returnToTopLabel: '回到顶部',
    darkModeSwitchLabel: '主题',
    sidebarMenuLabel: '菜单',
    lastUpdated: { text: '最后更新' },
  },
});
