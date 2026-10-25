import type { ComputedRef, InjectionKey } from 'vue'

/**
 * MochiFormItem → 内部控件（经 FieldShell）的上下文通道。
 * 大厂表单的标配行为：错误态自动下传（输入框跟着红）、label 自动关联
 * （<label for> 指到真正的控件 id），使用者零接线。
 */
export interface MochiFormItemContext {
  /** 错误/提示文案的 id，控件做 aria-describedby 用 */
  messageId: ComputedRef<string>
  /** 当前是否处于错误态 */
  invalid: ComputedRef<boolean>
  /** FieldShell 注册自己的 fieldId，FormItem 的 label 用它做 for */
  setFieldId: (id: string) => void
}

export const MOCHI_FORM_ITEM: InjectionKey<MochiFormItemContext> = Symbol('mochi-form-item')
