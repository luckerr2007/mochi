/**
 * CSS 虚拟化（content-visibility，见 styles/virtual.module.css）的启用策略。
 *
 * 大厂库的虚拟表格（Element Plus TableV2、antd rc-virtual-list 等）用 JS 窗口化，
 * DOM 会被裁剪；MoChi 走 CSS 路线：DOM 全保留、屏外行跳过渲染。小数据量下
 * 两者无差别，超过阈值后收益才显现。
 *
 * 开关支持三态：
 *   true  强制开启（屏外行跳过布局/绘制）
 *   false 强制关闭
 *   'auto'（默认）按硬件自适应——低端设备自动开启，高端设备跳过。
 *   依据：M 系列芯片 + 简单文本单元格实测 cv 首渲染反而劣化约三成（每行
 *   containment 记账），而低端 CPU/GPU 上跳过屏外行的布局绘制是净收益；
 *   高端硬件的判定用 deviceMemory + hardwareConcurrency 保守估计。
 */
export const VIRTUAL_ROW_THRESHOLD = 30;

export type MochiVirtualSetting = boolean | 'auto';

/** 低端设备保守探测：内存 ≤4GB 或核数 ≤4 视为低端；字段缺失时不当低端（避免误开） */
export function isLowEndDevice(): boolean {
  const nav = navigator as Navigator & { deviceMemory?: number };
  if (nav.deviceMemory !== undefined && nav.deviceMemory <= 4) return true;
  return nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency <= 4;
}

/** 行数超过阈值且策略允许时启用 */
export function shouldVirtualize(count: number, setting: MochiVirtualSetting): boolean {
  if (count <= VIRTUAL_ROW_THRESHOLD) return false;
  if (setting === true) return true;
  if (setting === 'auto') return isLowEndDevice();
  return false;
}
