/**
 * HEX ↔ HSV 转换。ColorPicker 的取色面板以 HSV 为状态
 * （色相、饱和度、明度各占一根轴，比 RGB 直观），只在输出时落回 HEX。
 */

export interface MochiHsv {
  /** 0-360 */
  h: number
  /** 0-100 */
  s: number
  /** 0-100 */
  v: number
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function hsvToHex({ h, s, v }: MochiHsv): string {
  const sat = s / 100
  const val = v / 100
  const f = (n: number) => {
    const k = (n + h / 60) % 6
    const channel = val - val * sat * Math.max(0, Math.min(k, 4 - k, 1))
    return Math.round(channel * 255)
      .toString(16)
      .padStart(2, '0')
  }
  return `#${f(5)}${f(3)}${f(1)}`
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const match = /^#?([0-9a-f]{6})$/i.exec(hex.trim())
  if (!match) return null
  const int = parseInt(match[1]!, 16)
  return { r: (int >> 16) & 0xff, g: (int >> 8) & 0xff, b: int & 0xff }
}

/** 规范成 `#rrggbb` 小写；不合法返回 null */
export function normalizeHex(hex: string): string | null {
  const match = /^#?([0-9a-f]{6})$/i.exec(hex.trim())
  return match ? `#${match[1]!.toLowerCase()}` : null
}

export function hexToHsv(hex: string): MochiHsv | null {
  const rgb = hexToRgb(hex)
  if (!rgb) return null
  const r = rgb.r / 255
  const g = rgb.g / 255
  const b = rgb.b / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min

  let h = 0
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h *= 60
    if (h < 0) h += 360
  }

  return {
    h: Math.round(h),
    s: Math.round(max === 0 ? 0 : (d / max) * 100),
    v: Math.round(max * 100),
  }
}
