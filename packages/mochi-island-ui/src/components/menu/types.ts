export interface MochiMenuItem {
  key: string
  label: string
  disabled?: boolean
  /** 一级子菜单 */
  children?: MochiMenuItem[]
}
