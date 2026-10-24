export interface MochiCommand {
  key: string;
  label: string;
  /** 右侧提示，一般是快捷键（如 ⌘S） */
  hint?: string;
  /** 分组名；相邻同名项共用一个组标题 */
  group?: string;
  disabled?: boolean;
}
