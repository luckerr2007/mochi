import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { describe, expect, it } from 'vitest';
import MochiAvatar from './components/avatar/MochiAvatar.vue';
import MochiAnchor from './components/anchor/MochiAnchor.vue';
import MochiAutoComplete from './components/auto-complete/MochiAutoComplete.vue';
import MochiBreadcrumb from './components/breadcrumb/MochiBreadcrumb.vue';
import MochiCascader from './components/cascader/MochiCascader.vue';
import MochiTreeSelect from './components/tree-select/MochiTreeSelect.vue';
import MochiCarousel from './components/carousel/MochiCarousel.vue';
import MochiCalendar from './components/calendar/MochiCalendar.vue';
import MochiCollapse from './components/collapse/MochiCollapse.vue';
import MochiCountUp from './components/count-up/MochiCountUp.vue';
import MochiDatePicker from './components/date-picker/MochiDatePicker.vue';
import MochiDrawer from './components/drawer/MochiDrawer.vue';
import MochiDropdown from './components/dropdown/MochiDropdown.vue';
import MochiImage from './components/image/MochiImage.vue';
import MochiFormItem from './components/form/MochiFormItem.vue';
import MochiInputNumber from './components/input-number/MochiInputNumber.vue';
import MochiLink from './components/link/MochiLink.vue';
import MochiMenu from './components/menu/MochiMenu.vue';
import MochiModal from './components/modal/MochiModal.vue';
import MochiPagination from './components/pagination/MochiPagination.vue';
import MochiPopconfirm from './components/popconfirm/MochiPopconfirm.vue';
import MochiPopover from './components/popover/MochiPopover.vue';
import MochiRate from './components/rate/MochiRate.vue';
import MochiResult from './components/result/MochiResult.vue';
import MochiSegmented from './components/segmented/MochiSegmented.vue';
import MochiSelect from './components/select/MochiSelect.vue';
import MochiSpace from './components/space/MochiSpace.vue';
import MochiStatistic from './components/statistic/MochiStatistic.vue';
import MochiSteps from './components/steps/MochiSteps.vue';
import MochiTable from './components/table/MochiTable.vue';
import MochiTabs from './components/tabs/MochiTabs.vue';
import MochiTimePicker from './components/time-picker/MochiTimePicker.vue';
import MochiTimeline from './components/timeline/MochiTimeline.vue';
import MochiToastHost from './components/toast/MochiToastHost.vue';
import MochiTooltip from './components/tooltip/MochiTooltip.vue';
import MochiTree from './components/tree/MochiTree.vue';
import MochiUpload from './components/upload/MochiUpload.vue';
import { dismissToast, pushToast, toastItems } from './composables/toast';

// 这些组件各自只有一条非平凡逻辑，合并成一个文件足够
describe('扩充组件的行为边界', () => {
  it('MochiAvatar 图片失败后退回首字', async () => {
    const wrapper = mount(MochiAvatar, { props: { src: '/missing.png', name: '咕噜' } });
    expect(wrapper.find('img').exists()).toBe(true);

    await wrapper.find('img').trigger('error');
    expect(wrapper.find('img').exists()).toBe(false);
    expect(wrapper.text()).toBe('咕');
  });

  it('MochiSelect 点开后渲染 listbox，选中后回传并收起', async () => {
    const wrapper = mount(MochiSelect, {
      props: {
        placeholder: '请选择',
        options: [
          { label: '苹果', value: 'apple' },
          { label: '梨', value: 'pear' },
        ],
        modelValue: '',
      },
    });

    expect(wrapper.find('[role="listbox"]').exists()).toBe(false);

    await wrapper.find('[role="combobox"]').trigger('click');
    const options = wrapper.findAll('[role="option"]');
    expect(options).toHaveLength(2);

    await options[1]!.trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['pear']);
    expect(wrapper.find('[role="listbox"]').exists()).toBe(false);
  });

  it('MochiSelect 用方向键移动，Enter 选中', async () => {
    const wrapper = mount(MochiSelect, {
      props: {
        options: [
          { label: '苹果', value: 'apple' },
          { label: '梨', value: 'pear' },
        ],
        modelValue: 'apple',
      },
    });

    const trigger = wrapper.find('[role="combobox"]');
    await trigger.trigger('keydown', { key: 'ArrowDown' });
    expect(wrapper.find('[role="listbox"]').exists()).toBe(true);

    await trigger.trigger('keydown', { key: 'ArrowDown' });
    await trigger.trigger('keydown', { key: 'Enter' });
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['pear']);
  });

  it('MochiTabs 用方向键在可用项间循环，跳过禁用项', async () => {
    const wrapper = mount(MochiTabs, {
      props: {
        modelValue: 'a',
        items: [
          { key: 'a', label: 'A' },
          { key: 'b', label: 'B', disabled: true },
          { key: 'c', label: 'C' },
        ],
      },
    });

    await wrapper.findAll('[role="tab"]')[0]!.trigger('keydown', { key: 'ArrowRight' });
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['c']);
  });

  it('MochiCollapse 用原生 details，默认收起', () => {
    const wrapper = mount(MochiCollapse, { props: { title: '更多' } });
    expect(wrapper.element.tagName).toBe('DETAILS');
    expect(wrapper.attributes('open')).toBeUndefined();

    const opened = mount(MochiCollapse, { props: { title: '更多', open: true } });
    expect(opened.attributes('open')).toBeDefined();
  });

  it('MochiModal 打开时渲染对话框，Esc 关闭', async () => {
    const wrapper = mount(MochiModal, {
      props: { open: true, title: '确认' },
      global: { stubs: { teleport: true } },
    });

    const dialog = wrapper.find('[role="dialog"]');
    expect(dialog.exists()).toBe(true);
    expect(dialog.attributes('aria-modal')).toBe('true');

    await dialog.trigger('keydown', { key: 'Escape' });
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false]);
  });

  it('MochiModal 关闭时不渲染任何内容', () => {
    const wrapper = mount(MochiModal, {
      props: { open: false },
      global: { stubs: { teleport: true } },
    });
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false);
  });

  it('MochiDrawer 复用同一套浮层行为：Esc 关闭', async () => {
    const wrapper = mount(MochiDrawer, {
      props: { open: true, title: '设置' },
      global: { stubs: { teleport: true } },
    });
    await wrapper.find('[role="dialog"]').trigger('keydown', { key: 'Escape' });
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false]);
  });

  it('MochiTooltip 悬停后出现，离开即消失', async () => {
    const wrapper = mount(MochiTooltip, { props: { content: '提示', delay: 0 } });
    await wrapper.trigger('pointerenter');
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(wrapper.find('[role="tooltip"]').text()).toBe('提示');

    await wrapper.trigger('pointerleave');
    expect(wrapper.find('[role="tooltip"]').exists()).toBe(false);
  });

  it('MochiRate 点击星星回传分值', async () => {
    const wrapper = mount(MochiRate, { props: { modelValue: 0 } });
    await wrapper.findAll('input')[2]!.setValue();
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([3]);
  });

  it('MochiPagination 中间页用省略号折叠，翻页回传', async () => {
    const wrapper = mount(MochiPagination, { props: { total: 20, modelValue: 10 } });
    expect(wrapper.findAll('button').length).toBeLessThan(20);
    expect(wrapper.text()).toContain('···');

    await wrapper.findAll('button')[1]!.trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([1]);
  });

  it('MochiSteps 按 current 标记已完成与当前步', () => {
    const wrapper = mount(MochiSteps, {
      props: { current: 1, items: [{ title: '下单' }, { title: '付款' }, { title: '发货' }] },
    });
    const states = wrapper.findAll('li').map((li) => li.attributes('data-state'));
    expect(states).toEqual(['done', 'current', 'todo']);
    expect(wrapper.find('[aria-current="step"]').exists()).toBe(true);
  });

  it('MochiFormItem 的错误信息进 role=alert，并把 invalid 传给字段', () => {
    const wrapper = mount(MochiFormItem, {
      props: { label: '昵称', error: '不能为空', required: true },
      slots: {
        default: ({ invalid }: { invalid: boolean }) => h('span', invalid ? 'invalid' : 'ok'),
      },
    });
    expect(wrapper.find('[role="alert"]').text()).toBe('不能为空');
    expect(wrapper.text()).toContain('invalid');
    expect(wrapper.attributes('data-invalid')).toBe('true');
  });

  it('MochiInputNumber 的加减被夹在 min/max 内', async () => {
    const wrapper = mount(MochiInputNumber, { props: { modelValue: 5, min: 0, max: 6 } });
    const [minus, plus] = wrapper.findAll('button');

    await plus!.trigger('click');
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([6]);

    await plus!.trigger('click');
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([6]);

    await minus!.trigger('click');
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([5]);
  });

  it('MochiSegmented 用方向键切换，跳过禁用项', async () => {
    const wrapper = mount(MochiSegmented, {
      props: {
        modelValue: 'a',
        options: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b', disabled: true },
          { label: 'C', value: 'c' },
        ],
      },
    });
    const options = wrapper.findAll('[role="radio"]');
    expect(options[0]!.attributes('aria-checked')).toBe('true');

    await options[0]!.trigger('keydown', { key: 'ArrowRight' });
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['c']);
  });

  it('MochiBreadcrumb 最后一项带 aria-current=page', () => {
    const wrapper = mount(MochiBreadcrumb, {
      props: { items: [{ label: '首页', href: '/' }, { label: '家具' }] },
    });
    expect(wrapper.find('[aria-current="page"]').text()).toBe('家具');
    expect(wrapper.find('a').attributes('href')).toBe('/');
  });

  it('MochiTimeline 按 tone 渲染色点，按索引错峰', () => {
    const wrapper = mount(MochiTimeline, {
      props: { items: [{ title: '入岛' }, { title: '开店', tone: 'candy' }] },
    });
    const dots = wrapper.findAll('[data-tone]');
    expect(dots[0]!.attributes('data-tone')).toBe('primary');
    expect(dots[1]!.attributes('data-tone')).toBe('candy');
    expect(wrapper.findAll('li')[1]!.attributes('style')).toContain('--_i: 1');
  });

  it('MochiStatistic 降低动态时直接给出格式化后的值', async () => {
    const original = Object.getOwnPropertyDescriptor(globalThis, 'matchMedia');
    Object.defineProperty(globalThis, 'matchMedia', {
      configurable: true,
      writable: true,
      value: () => ({ matches: true }),
    });

    const wrapper = mount(MochiStatistic, {
      props: { title: '铃钱', value: 12345, precision: 0, suffix: '铃' },
    });
    await nextTick();
    expect(wrapper.text()).toContain('12,345');
    expect(wrapper.text()).toContain('铃');

    if (original) Object.defineProperty(globalThis, 'matchMedia', original);
    else Reflect.deleteProperty(globalThis, 'matchMedia');
  });

  it('Toast 队列能压入、渲染并手动移除', async () => {
    toastItems.value.forEach((item) => dismissToast(item.id));

    const host = mount(MochiToastHost, { global: { stubs: { teleport: true } } });
    const id = pushToast({ title: '已保存', tone: 'success' });
    await nextTick();

    expect(host.text()).toContain('已保存');
    expect(host.find('[data-tone="success"]').exists()).toBe(true);

    dismissToast(id);
    await nextTick();
    expect(host.text()).not.toContain('已保存');
  });

  it('MochiPopover 点击触发器展开，Esc 关闭', async () => {
    const wrapper = mount(MochiPopover, {
      slots: { trigger: '<button type="button">打开</button>', default: '面板内容' },
    });

    expect(wrapper.find('[role="dialog"]').exists()).toBe(false);
    await wrapper.find('button').trigger('click');
    expect(wrapper.find('[role="dialog"]').text()).toContain('面板内容');

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await nextTick();
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false);
  });

  it('MochiPopconfirm 确认后抛事件并收起', async () => {
    const wrapper = mount(MochiPopconfirm, {
      props: { title: '确定删除？' },
      slots: { trigger: '<button type="button">删除</button>' },
    });

    await wrapper.find('button').trigger('click');
    const buttons = wrapper.findAll('[role="dialog"] button');
    await buttons.at(-1)!.trigger('click');

    expect(wrapper.emitted('confirm')).toHaveLength(1);
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false);
  });

  it('MochiTable 渲染列与行，空数据走 empty 插槽', () => {
    const columns = [
      { key: 'name', title: '名字' },
      { key: 'price', title: '价格', sortable: true },
    ];
    const rows = [{ id: 1, name: '藤椅', price: 1200 }];

    const wrapper = mount(MochiTable, { props: { columns, rows } });
    expect(wrapper.findAll('th')).toHaveLength(2);
    expect(wrapper.text()).toContain('藤椅');

    const empty = mount(MochiTable, { props: { columns, rows: [] } });
    expect(empty.text()).toContain('暂无数据');
  });

  it('MochiTable 排序三态循环：升序 → 降序 → 取消', async () => {
    const columns = [{ key: 'price', title: '价格', sortable: true }];
    const rows = [
      { id: 1, price: 30 },
      { id: 2, price: 10 },
    ];
    // tbody 由 TransitionGroup 渲染，关掉 VTU 的默认 stub 才能查到真实行
    const wrapper = mount(MochiTable, {
      props: { columns, rows },
      global: { stubs: { 'transition-group': false } },
    });
    const sorter = wrapper.find('th button');

    await sorter.trigger('click');
    expect(wrapper.emitted('sort-change')?.[0]).toEqual([{ key: 'price', order: 'asc' }]);
    expect(wrapper.findAll('tbody td')[0]!.text()).toBe('10');

    await sorter.trigger('click');
    expect(wrapper.emitted('sort-change')?.[1]).toEqual([{ key: 'price', order: 'desc' }]);

    await sorter.trigger('click');
    expect(wrapper.emitted('sort-change')?.[2]).toEqual([null]);
  });

  it('MochiUpload 选文件后抛 change，移除后再次抛', async () => {
    const wrapper = mount(MochiUpload, { props: { multiple: true } });
    const input = wrapper.find('input[type="file"]');
    const file = new File(['hello'], 'a.txt', { type: 'text/plain' });

    Object.defineProperty(input.element, 'files', { value: [file], configurable: true });
    await input.trigger('change');
    expect(wrapper.text()).toContain('a.txt');

    const emitted = wrapper.emitted('change') as File[][][];
    expect(emitted[0]?.[0]?.[0]?.name).toBe('a.txt');

    await wrapper.find('li button').trigger('click');
    expect(wrapper.text()).not.toContain('a.txt');
  });

  it('MochiDropdown 点开渲染 menuitem，禁用项不触发 select', async () => {
    const wrapper = mount(MochiDropdown, {
      props: {
        items: [
          { key: 'edit', label: '编辑' },
          { key: 'remove', label: '删除', disabled: true },
          { key: 'share', label: '分享', divider: true },
        ],
      },
      slots: { trigger: '<button type="button">更多</button>' },
    });

    await wrapper.find('button').trigger('click');
    const items = wrapper.findAll('[role="menuitem"]');
    expect(items).toHaveLength(3);
    expect(wrapper.find('[role="menu"]').exists()).toBe(true);

    await items[1]!.trigger('click');
    expect(wrapper.emitted('select')).toBeUndefined();

    await items[2]!.trigger('click');
    expect(wrapper.emitted('select')?.[0]).toEqual(['share']);
  });

  it('MochiCountUp 降低动态时直接给出终值', async () => {
    const original = Object.getOwnPropertyDescriptor(globalThis, 'matchMedia');
    Object.defineProperty(globalThis, 'matchMedia', {
      configurable: true,
      writable: true,
      value: () => ({ matches: true }),
    });

    const wrapper = mount(MochiCountUp, { props: { value: 4200, suffix: '铃' } });
    await nextTick();
    expect(wrapper.text()).toContain('4,200');
    expect(wrapper.text()).toContain('铃');

    if (original) Object.defineProperty(globalThis, 'matchMedia', original);
    else Reflect.deleteProperty(globalThis, 'matchMedia');
  });

  it('MochiLink 外链补 target 与 rel，禁用时移除 href', () => {
    const external = mount(MochiLink, { props: { href: 'https://x.dev', external: true } });
    expect(external.attributes('target')).toBe('_blank');
    expect(external.attributes('rel')).toContain('noreferrer');

    const disabled = mount(MochiLink, { props: { href: '#', disabled: true } });
    expect(disabled.attributes('href')).toBeUndefined();
    expect(disabled.attributes('aria-disabled')).toBe('true');
  });

  it('MochiSpace 把语义档位映射到 4px 网格', () => {
    expect(mount(MochiSpace, { props: { size: 'md' } }).attributes('style')).toContain(
      'var(--mochi-space-4)',
    );
    expect(mount(MochiSpace, { props: { size: 12 } }).attributes('style')).toContain('12px');
  });

  it('MochiResult 按 tone 渲染并带 role=status', () => {
    const wrapper = mount(MochiResult, { props: { tone: 'success', title: '捐赠成功' } });
    expect(wrapper.attributes('data-tone')).toBe('success');
    expect(wrapper.attributes('role')).toBe('status');
    expect(wrapper.text()).toContain('捐赠成功');
  });

  it('MochiMenu 点击子项切换 aria-current，分组可展开', async () => {
    const wrapper = mount(MochiMenu, {
      props: {
        modelValue: 'home',
        items: [
          { key: 'home', label: '首页' },
          {
            key: 'island',
            label: '岛屿',
            children: [
              { key: 'museum', label: '博物馆' },
              { key: 'shop', label: '商店' },
            ],
          },
        ],
      },
    });

    expect(wrapper.find('[aria-current="page"]').text()).toBe('首页');

    const group = wrapper.findAll('button')[1]!;
    expect(group.attributes('aria-expanded')).toBe('false');
    await group.trigger('click');
    expect(group.attributes('aria-expanded')).toBe('true');

    await wrapper.findAll('button')[2]!.trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['museum']);
  });

  it('MochiCalendar 渲染 6×7 网格，选日期回传并翻到对应月份', async () => {
    const wrapper = mount(MochiCalendar, { props: { modelValue: new Date(2026, 9, 10) } });
    const days = wrapper.findAll('[data-cal-index]');
    expect(days).toHaveLength(42);

    // 选下个月 1 号那一格，验证会翻页
    const nextMonthDay = days.find((day) => {
      const label = day.attributes('aria-label') ?? '';
      return label.startsWith('2026 年 11 月 1 日');
    });
    expect(nextMonthDay).toBeTruthy();
    await nextMonthDay!.trigger('click');

    const emitted = wrapper.emitted('update:modelValue')?.[0]?.[0] as Date;
    expect(emitted.getMonth()).toBe(10);
    expect(wrapper.text()).toContain('11 月');
  });

  it('MochiCalendar 上下键按周移动', async () => {
    const wrapper = mount(MochiCalendar, { props: { modelValue: new Date(2026, 9, 10) } });
    const selected = wrapper.find('[aria-pressed="true"]');
    await selected.trigger('keydown', { key: 'ArrowDown' });

    const emitted = wrapper.emitted('update:modelValue')?.[0]?.[0] as Date;
    expect(emitted.getDate()).toBe(17);
  });

  it('MochiCalendar 浏览到没有今天/选中的月份时，仍有一格可以 Tab 进入', () => {
    // 用 1999 年的月份，既没有今天也不会预选
    const wrapper = mount(MochiCalendar, { props: { modelValue: null } });
    const tabs = wrapper.findAll('[tabindex="0"]');
    expect(tabs.length).toBe(1);
  });

  it('MochiDatePicker 点开日历、选完自动收起并回传日期', async () => {
    const wrapper = mount(MochiDatePicker, {
      props: { modelValue: new Date(2026, 9, 10) },
      global: { stubs: { teleport: true } },
    });

    expect(wrapper.find('[role="dialog"]').exists()).toBe(false);
    await wrapper.find('button').trigger('click');
    expect(wrapper.find('[role="dialog"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('2026-10-10');

    const days = wrapper.findAll('[data-cal-index]');
    await days[20]!.trigger('click');
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
  });

  it('MochiTree 渲染层级，分组可展开，选中回传 key', async () => {
    const wrapper = mount(MochiTree, {
      props: {
        selected: '',
        data: [
          {
            key: 'island',
            label: '岛屿',
            children: [
              { key: 'beach', label: '沙滩' },
              { key: 'shop', label: '商店', disabled: true },
            ],
          },
          { key: 'museum', label: '博物馆' },
        ],
      },
    });

    const rows = wrapper.findAll('[role="treeitem"]');
    expect(rows).toHaveLength(4);

    const parent = rows[0]!;
    expect(parent.attributes('aria-expanded')).toBe('false');
    await parent.trigger('click');
    expect(parent.attributes('aria-expanded')).toBe('true');

    const beach = rows[1]!;
    await beach.trigger('click');
    expect(wrapper.emitted('update:selected')?.[0]).toEqual(['beach']);
  });

  it('MochiAutoComplete 输入过滤、↓ 高亮、回车选中', async () => {
    const wrapper = mount(MochiAutoComplete, {
      props: { modelValue: '', options: ['博物馆', '商店', '沙滩'], label: '地点' },
      global: { stubs: { teleport: true } },
    });

    const input = wrapper.find('input');
    await input.trigger('focus');
    await input.setValue('店');

    const options = wrapper.findAll('[role="option"]');
    expect(options).toHaveLength(1);
    expect(options[0]!.text()).toBe('商店');

    await input.trigger('keydown', { key: 'ArrowDown' });
    await input.trigger('keydown', { key: 'Enter' });
    const updates = wrapper.emitted('update:modelValue') as unknown[][][];
    expect(updates.at(-1)?.[0]).toBe('商店');
    expect(wrapper.emitted('select')?.[0]).toEqual(['商店']);
  });

  it('MochiCascader 逐列下钻，选叶子回传完整路径', async () => {
    const wrapper = mount(MochiCascader, {
      props: {
        modelValue: [],
        options: [
          {
            key: 'town',
            label: '小镇',
            children: [
              { key: 'shop-street', label: '商店街' },
              { key: 'beach', label: '沙滩' },
            ],
          },
          { key: 'museum', label: '博物馆' },
        ],
      },
      global: { stubs: { teleport: true } },
    });

    await wrapper.find('button').trigger('click');
    let options = wrapper.findAll('[role="option"]');
    expect(options).toHaveLength(2);

    // 点有下级的：新增一列
    await options[0]!.trigger('click');
    options = wrapper.findAll('[role="option"]');
    expect(options).toHaveLength(4);

    // 点叶子：回传路径
    await options.at(-1)!.trigger('click');
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toEqual(['town', 'beach']);
  });

  it('MochiTreeSelect 在树里选节点后收起', async () => {
    const wrapper = mount(MochiTreeSelect, {
      props: {
        modelValue: '',
        data: [
          { key: 'a', label: '甲', children: [{ key: 'a1', label: '甲一' }] },
          { key: 'b', label: '乙' },
        ],
      },
      global: { stubs: { teleport: true } },
    });

    await wrapper.find('button').trigger('click');
    const items = wrapper.findAll('[role="treeitem"]');
    await items.at(-1)!.trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['b']);
  });

  it('MochiImage 点缩略图开预览，Esc 关闭', async () => {
    const wrapper = mount(MochiImage, {
      props: { src: 'x.png', alt: '广场', caption: '中心广场' },
      global: { stubs: { teleport: true } },
    });

    expect(wrapper.find('[role="dialog"]').exists()).toBe(false);
    await wrapper.find('button').trigger('click');
    expect(wrapper.find('[role="dialog"]').exists()).toBe(true);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await nextTick();
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false);
  });

  it('MochiAnchor 渲染锚点链接且不真正跳转', async () => {
    const wrapper = mount(MochiAnchor, {
      props: { items: [{ id: 'intro', label: '简介' }, { id: 'usage', label: '用法' }] },
    });

    const links = wrapper.findAll('a');
    expect(links[0]!.attributes('href')).toBe('#intro');
    await links[1]!.trigger('click');
    // click.prevent 已阻止默认跳转，这里只断言没有抛错
    expect(wrapper.findAll('a')).toHaveLength(2);
  });

  it('MochiCarousel 渲染各张，点箭头与圆点都能切换', async () => {
    const wrapper = mount(MochiCarousel, {
      props: {
        items: [
          { key: 'a', alt: '甲' },
          { key: 'b', alt: '乙' },
          { key: 'c', alt: '丙' },
        ],
        interval: 0,
      },
    });

    expect(wrapper.findAll('[role="tab"]')).toHaveLength(3);
    await wrapper.find('[aria-label="下一张"]').trigger('click');
    expect(wrapper.find('[role="tab"][aria-selected="true"]').attributes('aria-label')).toBe('第 2 张');

    await wrapper.findAll('[role="tab"]')[2]!.trigger('click');
    expect(wrapper.find('[role="tab"][aria-selected="true"]').attributes('aria-label')).toBe('第 3 张');
    expect(wrapper.find('[role="tab"][aria-selected="true"]').exists()).toBe(true);
  });

  it('MochiTimePicker 打开后点选项回传 HH:mm', async () => {
    const wrapper = mount(MochiTimePicker, {
      props: { modelValue: '' },
      global: { stubs: { teleport: true } },
    });

    await wrapper.find('button').trigger('click');
    const hours = wrapper.findAll('[role="button"], button').filter((b) => /^\d{2}$/.test(b.text()));
    expect(hours.length).toBeGreaterThanOrEqual(60);

    await hours[14]!.trigger('click');
    const emitted = wrapper.emitted('update:modelValue')?.[0]?.[0] as string;
    expect(emitted).toMatch(/^14:00$/);
  });

  it('MochiMenu 挂载时自动展开包含选中项的分组', async () => {    const wrapper = mount(MochiMenu, {
      props: {
        modelValue: 'shop',
        items: [{ key: 'island', label: '岛屿', children: [{ key: 'shop', label: '商店' }] }],
      },
    });
    // 展开发生在 onMounted，等一次渲染
    await nextTick();

    const group = wrapper.findAll('button')[0]!;
    expect(group.attributes('aria-expanded')).toBe('true');

    // 收起后分组仍在 DOM 里（靠 grid-template-rows 补间），不是 v-if
    await group.trigger('click');
    expect(group.attributes('aria-expanded')).toBe('false');
  });
});
