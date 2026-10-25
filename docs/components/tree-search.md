# 树、级联、树下拉与自动补全

## MochiTree

<div class="demo" style="width: 300px">
  <MochiTree v-model:selected="picked" :data="nodes" style="border: var(--mochi-border-hairline) solid var(--mochi-line); border-radius: var(--mochi-radius-md)" />
</div>

<p style="color: var(--mochi-ink-soft); font-size: 13px">选中：<code>{{ picked || '（未选）' }}</code></p>

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `data` | `{ key, label, disabled?, children? }[]` | — | 必填，支持任意深度 |
| `defaultExpandAll` | `boolean` | `false` | 初始全部展开 |
| `v-model:selected` | `string` | `''` | 选中节点的 key |
| `label` | `string` | `'树'` | 无障碍名称 |

树形控件：可展开/收起的层级列表，支持选中与禁用节点，缩进 = 深度 × 16px（递归渲染由 `MochiTreeRow` 引用自身完成）。

### 动效

- 展开/收起还是 `grid-template-rows: 0fr ↔ 1fr` 补间——和 Menu 的分组同一套
- 折线箭头旋转 90°，叶子节点的箭头位隐藏但**占位**，标签永远对齐
- 选中行铺主色浅底

### 语义

真实 `role="tree" / treeitem / group`，每个条目带 `aria-level` 和 `aria-expanded`。
方向键导航（↑↓ 移动、→ 展开、← 收起）留给 TreeSelect 一起做——到时候要写焦点漫游，
单独给 Tree 加一半再给 TreeSelect 加另一半是重复劳动。

## MochiCascader

<div class="demo" style="width: 100%; max-width: 320px">
  <MochiCascader v-model="addr" :options="addrOptions" label="地址" hint="逐级下钻，选到叶子为止" />
</div>

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `options` | `{ key, label, disabled?, children? }[]` | — | 与 Tree 同构 |
| `v-model` | `string[]` | `[]` | **从根到叶的 key 路径** |
| `label` / `hint` / `placeholder` / `disabled` / `invalid` | — | — | 与其他表单件一致 |

级联选择器：适合「省 / 市 / 区」这类逐级下钻的数据——点有下级的项追加一列，点叶子收起并回传完整路径，触发框显示 `小镇 / 沙滩` 这样的路径串。

**动效**：新列从右侧 6px 滑入。列以 level 为 key，只有新增的那列会挂载，
所以动画永远只播一次，不会整排重播。

## MochiTreeSelect

<div class="demo" style="width: 100%; max-width: 320px">
  <MochiTreeSelect v-model="spot" :data="spotOptions" label="地点" hint="展开树选一个节点" />
</div>

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `data` | `{ key, label, disabled?, children? }[]` | — | 与 Tree 同构 |
| `v-model` | `string` | `''` | 选中节点的 key |
| `defaultExpandAll` | `boolean` | `true` | 面板打开时是否全展开 |

树形选择器：从层级数据里选一个节点。Tree 套了 FieldShell 凹陷槽 + Popover 的壳，展开动画与 Tree 一致。
单选语义；要选多个请用 Transfer（待写）。

## MochiAutoComplete

<div class="demo" style="width: 100%; max-width: 320px">
  <MochiAutoComplete v-model="place" :options="places" label="地点" hint="输入以筛选，↑↓ 选择，回车确认" />
</div>

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `options` | `string[]` | — | 候选池 |
| `v-model` | `string` | `''` | 输入值（选中后即所选项） |
| `limit` | `number` | `8` | 最多展示几条 |
| `label` / `hint` / `placeholder` / `disabled` / `invalid` | — | — | 与其他表单件一致 |

自动补全输入框：键入即过滤候选，`↑` `↓` 选择、回车确认。**自由输入是合法的**——它不是 Select，输什么就保留什么，
候选项只是辅助；需要"必须从列表选"的语义请用 Select。事件 `select(value)`。

### 交互

`combobox` + `listbox` 语义；`↑` `↓` 移动高亮、`回车` 选中、`Esc` 关闭（Popover 已处理）。
高亮既跟键盘也跟鼠标（`mousemove` 时同步），两者不会打架。

### 动效

建议项按索引错峰 24ms 上浮（同 Dropdown）；高亮块用背景色过渡跟随。

<script setup>
import { ref } from 'vue';

const picked = ref('');
const nodes = [
  {
    key: 'island',
    label: '岛屿',
    children: [
      { key: 'beach', label: '沙滩' },
      { key: 'shop', label: '商店', disabled: true },
      {
        key: 'square',
        label: '广场',
        children: [{ key: 'fountain', label: '喷泉' }],
      },
    ],
  },
  { key: 'museum', label: '博物馆' },
];

const place = ref('');

const addr = ref([]);
const addrOptions = [
  {
    key: 'town',
    label: '小镇',
    children: [
      { key: 'shop-street', label: '商店街' },
      { key: 'beach', label: '沙滩' },
    ],
  },
  { key: 'museum', label: '博物馆' },
];
const spot = ref('');
const spotOptions = [
  { key: 'island', label: '岛屿', children: [{ key: 'beach', label: '沙滩' }] },
  { key: 'museum', label: '博物馆' },
];
const places = ['博物馆', '中心广场', '商店街', '沙滩', '码头', '机场', '露营地'];
</script>
