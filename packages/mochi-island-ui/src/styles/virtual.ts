/**
 * CSS 虚拟化（content-visibility，见 styles/virtual.module.css）的启用阈值。
 *
 * 大厂库的虚拟表格（Element Plus TableV2、antd rc-virtual-list 等）用 JS 窗口化，
 * DOM 会被裁剪；MoChi 走 CSS 路线：DOM 全保留、屏外行跳过渲染。小数据量下
 * 两者无差别，超过阈值后 CSS 虚拟化的收益才显现，因此默认按行数自动启用。
 */
export const VIRTUAL_ROW_THRESHOLD = 30;

/** 行数超过阈值且未被 virtual={false} 显式关闭时启用 */
export function shouldVirtualize(count: number, enabled: boolean): boolean {
  return enabled && count > VIRTUAL_ROW_THRESHOLD;
}
