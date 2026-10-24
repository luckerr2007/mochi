import { computed, ref } from 'vue';

/**
 * 组件库内置文案的中英词典。
 *
 * 组件内所有"库自己说出来的话"（默认占位、aria 标签、空状态文案、单位）
 * 都从这里取值；使用者传入的 props 永远优先。切语言只需要：
 *
 *   import { setLocale } from 'mochi-island-ui';
 *   setLocale('en-US');
 *
 * 默认 zh-CN，与 1.0 行为完全兼容。
 */

export type MochiLocaleName = 'zh-CN' | 'en-US';

const zhCN = {
  // 通用动作
  close: '关闭',
  remove: '移除',
  confirm: '确定',
  cancel: '取消',
  menu: '菜单',
  notifications: '通知',
  selectPlaceholder: '请选择',

  // 表单
  inputNumberDec: '减少',
  inputNumberInc: '增加',
  autoCompletePlaceholder: '输入以筛选',
  autoCompleteList: '建议',
  mentionsList: '提及对象',
  mentionsPlaceholder: (prefix: string) => `输入 ${prefix} 唤起提及`,
  datePickerPlaceholder: '选择日期',
  timePickerPlaceholder: '选择时间',
  hourColumn: '小时',
  minuteColumn: '分钟',
  cascaderLevel: (level: number) => `第 ${level} 级`,
  treeLabel: '树',
  treeSelectList: '选项树',
  rateLabel: '评分',
  rateStar: (star: number) => `${star} 星`,
  sliderLabel: '滑块',
  tagInputPlaceholder: '输入后回车添加',
  tagInputLabel: '添加标签',
  tagInputFull: (max: number) => `最多 ${max} 个`,

  // 反馈
  emptyDescription: '这里什么都没有',
  tableEmpty: '暂无数据',
  spinnerLabel: '加载中',
  toastClose: '关闭通知',
  bannerClose: '关闭公告',
  imageZoom: (alt: string) => `放大查看：${alt}`,
  imageClose: '关闭预览',
  qrFallback: '内容过长，无法生成二维码',
  qrLabel: (value: string) => `二维码：${value}`,
  loadMoreIdle: '加载更多',
  loadMoreLoading: '加载中…',
  loadMoreDone: '没有更多了',
  progressLabel: '进度',

  // Transfer
  transferUnselected: '未选',
  transferSelected: '已选',
  transferEmpty: '无数据',
  transferSearch: (title?: string) => `搜索${title ?? ''}`,
  transferSelectAll: (title?: string) => `全选${title ?? ''}`,
  transferToRight: '移到右侧',
  transferToLeft: '移到左侧',

  // CommandPalette
  palettePlaceholder: '搜索命令…',
  paletteEmpty: '没有匹配的命令',

  // Mentions / AutoComplete 空态
  mentionsEmpty: '没有可提及的对象',
  autoCompleteEmpty: '没有匹配的项',

  // 导航与数据展示
  paginationPrev: '上一页',
  paginationNext: '下一页',
  breadcrumbLabel: '面包屑',
  anchorLabel: '页内导航',
  backTopLabel: '回到顶部',
  carouselPrev: '上一张',
  carouselNext: '下一张',
  carouselSlide: (index: number) => `第 ${index} 张`,
  avatarGroupLabel: '成员',
  calendarLabel: '日历',
  prevMonth: '上个月',
  nextMonth: '下个月',
  weekdays: ['一', '二', '三', '四', '五', '六', '日'] as string[],
  dateLabel: (y: number, m: number, d: number) => `${y} 年 ${m} 月 ${d} 日`,

  // Countdown
  countdownLabel: '倒计时',
  countdownRemain: (remain: string) => `剩余 ${remain}`,
  dayUnit: '天',
  hourUnit: '时',
  minuteUnit: '分',
  secondUnit: '秒',

  // CodeInput
  codeGroup: (length: number) => `${length} 位兑换码`,
  codeCell: (index: number) => `第 ${index} 位`,

  // ColorPicker
  hueSlider: '色相',
  swatchesLabel: '预设颜色',
  svPanel: (color: string) => `取色面板，当前 ${color}`,

  // Upload
  uploadHint: '点击或拖入文件上传',
};

export type MochiMessages = typeof zhCN;

const enUS: MochiMessages = {
  close: 'Close',
  remove: 'Remove',
  confirm: 'Confirm',
  cancel: 'Cancel',
  menu: 'Menu',
  notifications: 'Notifications',
  selectPlaceholder: 'Select…',

  inputNumberDec: 'Decrease',
  inputNumberInc: 'Increase',
  autoCompletePlaceholder: 'Type to filter',
  autoCompleteList: 'Suggestions',
  mentionsList: 'Mention targets',
  mentionsPlaceholder: (prefix: string) => `Type ${prefix} to mention`,
  datePickerPlaceholder: 'Pick a date',
  timePickerPlaceholder: 'Pick a time',
  hourColumn: 'Hour',
  minuteColumn: 'Minute',
  cascaderLevel: (level: number) => `Level ${level}`,
  treeLabel: 'Tree',
  treeSelectList: 'Options',
  rateLabel: 'Rating',
  rateStar: (star: number) => `${star} star${star > 1 ? 's' : ''}`,
  sliderLabel: 'Slider',
  tagInputPlaceholder: 'Type and press Enter',
  tagInputLabel: 'Add tag',
  tagInputFull: (max: number) => `Max ${max}`,

  emptyDescription: 'Nothing here yet',
  tableEmpty: 'No data',
  spinnerLabel: 'Loading',
  toastClose: 'Dismiss notification',
  bannerClose: 'Close announcement',
  imageZoom: (alt: string) => `Zoom in: ${alt}`,
  imageClose: 'Close preview',
  qrFallback: 'Content too long for a QR code',
  qrLabel: (value: string) => `QR code: ${value}`,
  loadMoreIdle: 'Load more',
  loadMoreLoading: 'Loading…',
  loadMoreDone: 'No more items',
  progressLabel: 'Progress',

  transferUnselected: 'Available',
  transferSelected: 'Chosen',
  transferEmpty: 'No items',
  transferSearch: (title?: string) => `Search ${title ?? ''}`,
  transferSelectAll: (title?: string) => `Select all ${title ?? ''}`,
  transferToRight: 'Move to chosen',
  transferToLeft: 'Move to available',

  palettePlaceholder: 'Search commands…',
  paletteEmpty: 'No matching commands',

  mentionsEmpty: 'No one to mention',
  autoCompleteEmpty: 'No matches',

  paginationPrev: 'Previous page',
  paginationNext: 'Next page',
  breadcrumbLabel: 'Breadcrumb',
  anchorLabel: 'On this page',
  backTopLabel: 'Back to top',
  carouselPrev: 'Previous slide',
  carouselNext: 'Next slide',
  carouselSlide: (index: number) => `Slide ${index}`,
  avatarGroupLabel: 'Members',
  calendarLabel: 'Calendar',
  prevMonth: 'Previous month',
  nextMonth: 'Next month',
  weekdays: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'] as string[],
  dateLabel: (y: number, m: number, d: number) => `${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][m - 1]} ${d}, ${y}`,

  countdownLabel: 'Countdown',
  countdownRemain: (remain: string) => `${remain} remaining`,
  dayUnit: 'd',
  hourUnit: 'h',
  minuteUnit: 'm',
  secondUnit: 's',

  codeGroup: (length: number) => `${length}-character code`,
  codeCell: (index: number) => `Character ${index}`,

  hueSlider: 'Hue',
  swatchesLabel: 'Preset colors',
  svPanel: (color: string) => `Color panel, current ${color}`,

  uploadHint: 'Click or drop files to upload',
};

const locale = ref<MochiLocaleName>('zh-CN');

const dictionaries: Record<MochiLocaleName, MochiMessages> = {
  'zh-CN': zhCN,
  'en-US': enUS,
};

/** 切换组件库内置文案的语言（默认 zh-CN）。 */
export function setLocale(next: MochiLocaleName) {
  locale.value = next;
}

/** 当前语言名。 */
export function getLocale(): MochiLocaleName {
  return locale.value;
}

/** 响应式词典：切语言后所有组件的内置文案随之更新。 */
export function useMessages() {
  return computed<MochiMessages>(() => dictionaries[locale.value]);
}
