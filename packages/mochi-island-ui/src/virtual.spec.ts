import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import MochiSelect from './components/select/MochiSelect.vue';
import MochiTable from './components/table/MochiTable.vue';
import MochiTree from './components/tree/MochiTree.vue';
import { VIRTUAL_ROW_THRESHOLD, shouldVirtualize } from './styles/virtual';

const columns = [
  { key: 'id', title: 'ID' },
  { key: 'name', title: '名称' },
];

const rows = (count: number) =>
  Array.from({ length: count }, (_, index) => ({ id: index, name: `行 ${index}` }));

const options = (count: number) =>
  Array.from({ length: count }, (_, index) => ({ value: String(index), label: `选项 ${index}` }));

const treeNodes = (count: number) =>
  Array.from({ length: count }, (_, index) => ({ key: String(index), label: `节点 ${index}` }));

/** 行数断言用 tr[style]（行带 --_i 错峰变量）：jsdom 里 TransitionGroup 的行不一定挂在 tbody 下 */
const rowcount = (wrapper: ReturnType<typeof mount>) => wrapper.findAll('tr[style]').length;

/** 等分片补齐（jsdom 无 requestIdleCallback，走 setTimeout(16) 退路） */
async function untilRowcount(wrapper: ReturnType<typeof mount>, want: number, deadlineMs = 5000) {
  const start = Date.now();
  while (rowcount(wrapper) < want) {
    if (Date.now() - start > deadlineMs) throw new Error(`分片未补齐：${rowcount(wrapper)}/${want}`);
    await new Promise((resolve) => setTimeout(resolve, 32));
  }
}

describe('CSS 虚拟化（content-visibility，opt-in）', () => {
  it('阈值助手：超过阈值且显式开启才启用', () => {
    expect(VIRTUAL_ROW_THRESHOLD).toBe(30);
    expect(shouldVirtualize(VIRTUAL_ROW_THRESHOLD, false)).toBe(false);
    expect(shouldVirtualize(VIRTUAL_ROW_THRESHOLD, true)).toBe(false);
    expect(shouldVirtualize(VIRTUAL_ROW_THRESHOLD + 1, true)).toBe(true);
    expect(shouldVirtualize(10_000, false)).toBe(false);
  });

  it('Table：默认关闭，virtual 开启后超阈值行带 data-virtual', () => {
    const off = mount(MochiTable, { props: { columns, rows: rows(50) } });
    expect(off.find('tr[data-virtual]').exists()).toBe(false);

    const on = mount(MochiTable, { props: { columns, rows: rows(50), virtual: true } });
    expect(on.findAll('tr[data-virtual]')).toHaveLength(50);
  });

  it('Select：默认关闭，virtual 开启后弹层选项带 data-virtual', async () => {
    const off = mount(MochiSelect, { props: { options: options(100) } });
    await off.find('button[role="combobox"]').trigger('click');
    expect(off.find('li[data-virtual]').exists()).toBe(false);

    const on = mount(MochiSelect, { props: { options: options(100), virtual: true } });
    await on.find('button[role="combobox"]').trigger('click');
    expect(on.findAll('li[data-virtual]')).toHaveLength(100);
  });

  it('Tree：默认关闭，virtual 开启后行带 data-virtual（子节点计入总量）', () => {
    const off = mount(MochiTree, { props: { data: treeNodes(40) } });
    expect(off.find('button[data-virtual]').exists()).toBe(false);

    const on = mount(MochiTree, { props: { data: treeNodes(40), virtual: true } });
    expect(on.findAll('button[data-virtual]')).toHaveLength(40);
  });
});

describe('渐进分片渲染（progressive，默认开启）', () => {
  it('超过首块的表先渲染 200 行，idle 期补齐到全量', async () => {
    const wrapper = mount(MochiTable, { props: { columns, rows: rows(500) } });
    expect(rowcount(wrapper)).toBe(200);
    await untilRowcount(wrapper, 500);
    expect(rowcount(wrapper)).toBe(500);
  }, 10_000);

  it('progressive=false 一次渲染全部', () => {
    const wrapper = mount(MochiTable, {
      props: { columns, rows: rows(500), progressive: false },
    });
    expect(rowcount(wrapper)).toBe(500);
  });

  it('阈值内不分片（200 行以内直接全量）', () => {
    const wrapper = mount(MochiTable, { props: { columns, rows: rows(50) } });
    expect(rowcount(wrapper)).toBe(50);
  });
});
