/**
 * 运行时主题工具。
 *
 * 令牌的权威声明在 styles/tokens.css，这里只负责把覆盖值写到元素的行内 style 上：
 * 行内声明的优先级高于 :root，因此覆盖立即生效，且不污染样式表。
 */

/** 任何 `--mochi-*` 自定义属性名。 */
export type MochiTokenName = `--mochi-${string}`

/** 一组令牌覆盖值，可只覆盖其中一部分。 */
export type MochiTheme = Partial<Record<MochiTokenName, string>>

/**
 * 应用主题覆盖。
 *
 * @param theme  要覆盖的令牌，例如 `{ '--mochi-primary': '#4fa89b' }`
 * @param target 作用目标，默认 `:root`；传容器元素即可做局部换肤
 * @returns 还原函数，调用后移除本次写入的覆盖值
 */
export function applyTheme(
  theme: MochiTheme,
  target: HTMLElement = document.documentElement,
): () => void {
  const previous = new Map<string, string>()

  for (const [name, value] of Object.entries(theme)) {
    if (value == null) continue
    previous.set(name, target.style.getPropertyValue(name))
    target.style.setProperty(name, value)
  }

  return () => {
    for (const [name, value] of previous) {
      if (value) target.style.setProperty(name, value)
      else target.style.removeProperty(name)
    }
  }
}
