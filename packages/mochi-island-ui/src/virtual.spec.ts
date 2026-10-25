import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import MochiSelect from './components/select/MochiSelect.vue';
import MochiTable from './components/table/MochiTable.vue';
import MochiTree from './components/tree/MochiTree.vue';
import { VIRTUAL_ROW_THRESHOLD, isLowEndDevice, shouldVirtualize } from './styles/virtual';

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

/** navigator 打桩：jsdom 的 hardwareConcurrency 值不确定，auto 模式测试要钉死硬件画像（undefined = 字段缺失） */
function stubHardware(cores: number | undefined, memory?: number | undefined) {
  Object.defineProperty(navigator, 'hardwareConcurrency', {
    value: cores,
    configurable: true,
  });
  Object.defineProperty(navigator, 'deviceMemory', { value: memory, configurable: true });
}

afterEach(() => {
  stubHardware(undefined, undefined);
  vi.restoreAllMocks();
});

describe('硬件自适应（virtual: auto）', () => {
  it('低端探测：核数 ≤4 或内存 ≤4GB 视为低端，字段缺失不当低端', () => {
    stubHardware(2, 8);
    expect(isLowEndDevice()).toBe(true);
    stubHardware(8, 4);
    expect(isLowEndDevice()).toBe(true);
    stubHardware(8, 8);
    expect(isLowEndDevice()).toBe(false);
    stubHardware(undefined, undefined);
    expect(isLowEndDevice()).toBe(false);
  });

  it('三态策略：true 强制开、false 强制关、auto 跟随硬件', () => {
    expect(VIRTUAL_ROW_THRESHOLD).toBe(30);
    stubHardware(8, 8);
    expect(shouldVirtualize(1000, true)).toBe(true);
    expect(shouldVirtualize(1000, false)).toBe(false);
    expect(shouldVirtualize(1000, 'auto')).toBe(false);
    expect(shouldVirtualize(30, 'auto')).toBe(false);

    stubHardware(4, 8);
    expect(shouldVirtualize(1000, 'auto')).toBe(true);
    expect(shouldVirtualize(30, 'auto')).toBe(false);
  });

  it('Table 默认 auto：低端设备行带 data-virtual，高端设备不带', () => {
    stubHardware(4, 4);
    const lowEnd = mount(MochiTable, { props: { columns, rows: rows(50) } });
    expect(lowEnd.findAll('tr[data-virtual]')).toHaveLength(50);

    stubHardware(10, 16);
    const highEnd = mount(MochiTable, { props: { columns, rows: rows(50) } });
    expect(highEnd.find('tr[data-virtual]').exists()).toBe(false);
  });

  it('Select：auto 低端开启弹层选项标记；Tree：virtual=true 显式开启', async () => {
    stubHardware(4, 4);
    const select = mount(MochiSelect, { props: { options: options(100) } });
    await select.find('button[role="combobox"]').trigger('click');
    expect(select.findAll('li[data-virtual]')).toHaveLength(100);

    stubHardware(10, 16);
    const tree = mount(MochiTree, { props: { data: treeNodes(40), virtual: true } });
    expect(tree.findAll('button[data-virtual]')).toHaveLength(40);
  });
});

describe('渐进分片渲染（progressive，默认开启）', () => {
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

  it('卸载后分片停止（不泄漏定时器/不继续改状态）', async () => {
    const wrapper = mount(MochiTable, { props: { columns, rows: rows(500) } });
    expect(rowcount(wrapper)).toBe(200);
    wrapper.unmount();
    await new Promise((resolve) => setTimeout(resolve, 120));
  });
});
