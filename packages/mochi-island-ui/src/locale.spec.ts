import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'
import MochiLoadMore from './components/load-more/MochiLoadMore.vue'
import MochiModal from './components/modal/MochiModal.vue'
import MochiSelect from './components/select/MochiSelect.vue'
import MochiTable from './components/table/MochiTable.vue'
import { getLocale, setLocale } from './locale'

describe('组件库内置文案国际化', () => {
  afterEach(() => {
    setLocale('zh-CN')
  })

  it('默认 zh-CN，内置文案为中文', () => {
    expect(getLocale()).toBe('zh-CN')
    const table = mount(MochiTable, { props: { columns: [], rows: [] } })
    expect(table.text()).toContain('暂无数据')
  })

  it('setLocale 切 en-US 后默认文案与 aria 跟随（已挂载组件响应式更新）', async () => {
    const select = mount(MochiSelect, { props: { options: [] } })
    const table = mount(MochiTable, { props: { columns: [], rows: [] } })
    const more = mount(MochiLoadMore)

    expect(select.text()).toContain('请选择')
    setLocale('en-US')
    await nextTick()

    expect(select.text()).toContain('Select…')
    expect(table.text()).toContain('No data')
    expect(more.text()).toContain('Load more')
  })

  it('使用者显式传入的文案永远优先于词典', () => {
    setLocale('en-US')
    const table = mount(MochiTable, { props: { columns: [], rows: [], emptyText: '自定义空态' } })
    expect(table.text()).toContain('自定义空态')
  })

  it('Modal 关闭钮的 aria-label 跟随语言', async () => {
    setLocale('en-US')
    const modal = mount(MochiModal, {
      props: { open: true, title: 'Hi' },
      global: { stubs: { teleport: true } },
    })
    const buttons = modal.findAll('button')
    const labels = buttons.map((b) => b.attributes('aria-label'))
    expect(labels).toContain('Close')
  })
})
