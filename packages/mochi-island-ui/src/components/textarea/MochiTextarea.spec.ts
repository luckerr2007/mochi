import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MochiTextarea from './MochiTextarea.vue'

describe('MochiTextarea', () => {
  it('label 与多行输入框通过 id 关联', () => {
    const wrapper = mount(MochiTextarea, { props: { label: '备注' } })
    expect(wrapper.find('label').attributes('for')).toBe(wrapper.find('textarea').attributes('id'))
  })

  it('rows 透传，默认 3', () => {
    expect(mount(MochiTextarea).find('textarea').attributes('rows')).toBe('3')
    expect(
      mount(MochiTextarea, { props: { rows: 6 } })
        .find('textarea')
        .attributes('rows'),
    ).toBe('6')
  })

  it('输入时向外抛 update:modelValue', async () => {
    const wrapper = mount(MochiTextarea, { props: { modelValue: '' } })
    await wrapper.find('textarea').setValue('今天下雨')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['今天下雨'])
  })

  it('invalid 同步 aria-invalid', () => {
    const wrapper = mount(MochiTextarea, { props: { invalid: true } })
    expect(wrapper.find('textarea').attributes('aria-invalid')).toBe('true')
  })

  it('与 MochiInput 共用外壳：hint 仍绑定 aria-describedby', () => {
    const wrapper = mount(MochiTextarea, { props: { hint: '最多 200 字' } })
    expect(wrapper.find('textarea').attributes('aria-describedby')).toBe(
      wrapper.find('p').attributes('id'),
    )
  })
})
