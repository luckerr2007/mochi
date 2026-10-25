import type { ComponentResolverObject } from 'unplugin-vue-components/types';

/**
 * 组件名 → 子路径目录。
 * 新增组件时在这里登记一行；`resolver.spec.ts` 会校验每个条目都真有对应导出。
 */
export const mochiComponentDirs = {
  MochiAffix: 'affix',
  MochiAlert: 'alert',
  MochiAutoComplete: 'auto-complete',
  MochiAnchor: 'anchor',
  MochiAvatar: 'avatar',
  MochiAvatarGroup: 'avatar-group',
  MochiBackTop: 'back-top',
  MochiBadge: 'badge',
  MochiBanner: 'banner',
  MochiBreadcrumb: 'breadcrumb',
  MochiButton: 'button',
  MochiCascader: 'cascader',
  MochiCalendar: 'calendar',
  MochiCarousel: 'carousel',
  MochiCheckbox: 'checkbox',
  MochiCodeInput: 'code-input',
  MochiCollapse: 'collapse',
  MochiColorPicker: 'color-picker',
  MochiCommandPalette: 'command-palette',
  MochiCountdown: 'countdown',
  MochiDatePicker: 'date-picker',
  MochiDialogBubble: 'bubble',
  MochiCountUp: 'count-up',
  MochiDivider: 'divider',
  MochiDrawer: 'drawer',
  MochiDropdown: 'dropdown',
  MochiEmpty: 'empty',
  MochiForm: 'form',
  MochiFormItem: 'form',
  MochiImage: 'image',
  MochiIcon: 'icon',
  MochiInput: 'input',
  MochiInputNumber: 'input-number',
  MochiKbd: 'kbd',
  MochiLink: 'link',
  MochiList: 'list',
  MochiLoadMore: 'load-more',
  MochiMenu: 'menu',
  MochiModal: 'modal',
  MochiPagination: 'pagination',
  MochiPanel: 'panel',
  MochiPopconfirm: 'popconfirm',
  MochiPopover: 'popover',
  MochiProgress: 'progress',
  MochiProgressRing: 'progress-ring',
  MochiQRCode: 'qrcode',
  MochiRadioGroup: 'radio',
  MochiRate: 'rate',
  MochiResult: 'result',
  MochiSegmented: 'segmented',
  MochiSelect: 'select',
  MochiSkeleton: 'skeleton',
  MochiSlider: 'slider',
  MochiSpace: 'space',
  MochiSpinner: 'spinner',
  MochiStatistic: 'statistic',
  MochiSteps: 'steps',
  MochiSwitch: 'switch',
  MochiTable: 'table',
  MochiTabs: 'tabs',
  MochiText: 'text',
  MochiTimePicker: 'time-picker',
  MochiTag: 'tag',
  MochiTagInput: 'tag-input',
  MochiTextarea: 'textarea',
  MochiTimeline: 'timeline',
  MochiToastHost: 'toast',
  MochiTooltip: 'tooltip',
  MochiTransfer: 'transfer',
  MochiTree: 'tree',
  MochiTreeSelect: 'tree-select',
  MochiUpload: 'upload',
  MochiWatermark: 'watermark',
  MochiDescriptions: 'descriptions',
  MochiMentions: 'mentions',
} as const;

export type MochiComponentName = keyof typeof mochiComponentDirs;

export interface MochiResolverOptions {
  /**
   * 是否自动引入组件样式。
   * 默认 true，会注入 `mochi-island-ui/style.css`；若项目自行全局引入样式可设为 false。
   */
  importStyle?: boolean;
}

/**
 * `unplugin-vue-components` 解析器。
 *
 * ```ts
 * Components({ resolvers: [MochiResolver()] })
 * ```
 */
export function MochiResolver(options: MochiResolverOptions = {}): ComponentResolverObject {
  const { importStyle = true } = options;

  return {
    type: 'component',
    resolve: (name: string) => {
      const dir = mochiComponentDirs[name as MochiComponentName];
      if (!dir) return;

      return {
        name,
        from: `mochi-island-ui/components/${dir}`,
        sideEffects: importStyle ? ['mochi-island-ui/style.css'] : undefined,
      };
    },
  };
}
