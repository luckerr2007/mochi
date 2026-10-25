import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MochiSwitch from './MochiSwitch.vue'

describe('MochiSwitch', () => {
  it('是 role=switch 的 checkbox，键盘空格可切换', async () => {
    const wrapper = mount(MochiSwitch, { props: { modelValue: false } })
    const input = wrapper.find('input')
    expect(input.attributes('type')).toBe('checkbox')
    expect(input.attributes('role')).toBe('switch')

    await input.setValue(true)
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
  })

  it('label 作为整体可点击区域', () => {
    const wrapper = mount(MochiSwitch, { props: { label: '接收通知' } })
    expect(wrapper.element.tagName).toBe('LABEL')
    expect(wrapper.text()).toContain('接收通知')
  })

  it('disabled 时原生输入框不可用', () => {
    const wrapper = mount(MochiSwitch, { props: { disabled: true } })
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
    expect(wrapper.attributes('data-disabled')).toBe('true')
  })
})
