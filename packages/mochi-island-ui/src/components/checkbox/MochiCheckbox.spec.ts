import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MochiCheckbox from './MochiCheckbox.vue'

describe('MochiCheckbox', () => {
  it('切换时抛出布尔值', async () => {
    const wrapper = mount(MochiCheckbox, { props: { modelValue: false } })
    await wrapper.find('input').setValue(true)
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
  })

  it('勾选标记是装饰性的矢量，不进无障碍树', () => {
    const wrapper = mount(MochiCheckbox, { props: { label: '同意条款' } })
    expect(wrapper.find('svg').attributes('aria-hidden')).toBe('true')
  })

  it('disabled 时不可交互', () => {
    const wrapper = mount(MochiCheckbox, { props: { disabled: true } })
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })
})
