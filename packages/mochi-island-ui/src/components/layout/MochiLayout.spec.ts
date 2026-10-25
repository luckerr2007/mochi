import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MochiLayout from './MochiLayout.vue'
import MochiLayoutContent from './MochiLayoutContent.vue'
import MochiLayoutFooter from './MochiLayoutFooter.vue'
import MochiLayoutHeader from './MochiLayoutHeader.vue'
import MochiLayoutSider from './MochiLayoutSider.vue'

describe('MochiLayout 家族', () => {
  it('默认纵向骨架，hasSider 切横排', () => {
    const column = mount(MochiLayout, { slots: { default: '<div>骨架</div>' } })
    expect(column.find('main, header, footer, aside').exists()).toBe(false)

    const row = mount(MochiLayout, {
      props: { hasSider: true },
      slots: { default: '<aside class="fake-sider" />' },
    })
    expect(row.find('.fake-sider').exists()).toBe(true)
  })

  it('Header 默认 sticky，可关闭', () => {
    const sticky = mount(MochiLayoutHeader, { slots: { default: '标题' } })
    expect(sticky.find('header').exists()).toBe(true)

    const plain = mount(MochiLayoutHeader, {
      props: { sticky: false },
      slots: { default: '标题' },
    })
    expect(plain.find('header').exists()).toBe(true)
  })

  it('Sider 折叠：aria-expanded 跟随，按钮切换 v-model', async () => {
    const wrapper = mount(MochiLayoutSider, {
      props: {
        collapsible: true,
        collapsed: false,
        'onUpdate:collapsed': (v: boolean) => wrapper.setProps({ collapsed: v }),
      },
      slots: { default: '菜单' },
    })
    const toggle = wrapper.find('button')
    expect(toggle.attributes('aria-expanded')).toBe('true')
    expect(wrapper.find('aside').attributes('data-collapsed')).toBeUndefined()

    await toggle.trigger('click')
    expect(wrapper.props('collapsed')).toBe(true)
    expect(wrapper.find('aside').attributes('data-collapsed')).toBe('true')
    expect(toggle.attributes('aria-expanded')).toBe('false')
  })

  it('Content 是 main、Footer 是 footer', () => {
    expect(
      mount(MochiLayoutContent, { slots: { default: '正文' } })
        .find('main')
        .text(),
    ).toBe('正文')
    expect(
      mount(MochiLayoutFooter, { slots: { default: '版权' } })
        .find('footer')
        .text(),
    ).toBe('版权')
  })
})
