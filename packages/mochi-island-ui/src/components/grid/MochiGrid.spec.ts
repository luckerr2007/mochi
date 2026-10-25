import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MochiGrid from './MochiGrid.vue'
import MochiGridItem from './MochiGridItem.vue'

describe('MochiGrid / MochiGridItem', () => {
  it('容器输出列数与间距变量', () => {
    const wrapper = mount(MochiGrid, {
      props: { cols: 6, gap: 16 },
      slots: { default: '<div>格</div>' },
    })
    const style = wrapper.find('div').attributes('style') ?? ''
    expect(style).toContain('--grid-cols: 6')
    expect(style).toContain('--grid-gap: 16px')
  })

  it('子项默认整行，span 与断点档位落到变量和 data 属性', () => {
    const full = mount(MochiGridItem, { slots: { default: '内容' } })
    const fullStyle = full.find('div').attributes('style') ?? ''
    expect(fullStyle).toContain('--span: 12')
    expect(full.find('div').attributes('data-sm')).toBeUndefined()

    const responsive = mount(MochiGridItem, {
      props: { span: 12, sm: 6, md: 4, lg: 3 },
      slots: { default: '内容' },
    })
    const attrs = responsive.find('div').attributes()
    expect(attrs['data-sm']).toBe('6')
    expect(attrs['data-md']).toBe('4')
    expect(attrs['data-lg']).toBe('3')
  })
})
