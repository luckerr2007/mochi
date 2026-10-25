# 组件演示厅

全部组件按分类陈列在一页，滚动即览；点击各组件名跳转详细文档（Props / Slots / Events 表格）。
右上角可切换中英文档；令牌换肤能力见[主题指南](/guide/theming)。

<script setup lang="ts">
import { reactive } from 'vue'
import { useToast } from 'mochi-island-ui'

const { toast } = useToast()

const g = reactive({
  input: '', textarea: '', select: '', num: 6, slider: 64, seg: 'grid',
  time: '18:30', date: new Date(), cascader: [] as string[], treeSel: 'beach',
  auto: '', tags: ['草莓', '铃兰'], code: '', color: '#e8613c',
  transfer: ['apple'] as string[], menu: 'home', modal: false, drawer: false,
  tab: 'today', tree: '', rate: 4, page: 6, step: 1, switch: true, check: true,
  radio: 'a', progress: 72, banner: true,
})

const selectOptions = [
  { value: 'latte', label: '贝壳拿铁' },
  { value: 'cocoa', label: '热可可' },
  { value: 'lemon', label: '柠檬苏打' },
]
const addrOptions = [
  { key: 'town', label: '小镇', children: [{ key: 'beach', label: '沙滩' }, { key: 'shop', label: '商店街' }] },
  { key: 'museum', label: '博物馆' },
]
const treeData = [
  { key: 'island', label: '岛屿', children: [{ key: 'beach', label: '沙滩' }, { key: 'shop', label: '商店' }] },
  { key: 'museum', label: '博物馆' },
]
const transferData = [
  { key: 'apple', label: '苹果', disabled: false },
  { key: 'peach', label: '桃子', disabled: false },
  { key: 'cherry', label: '樱桃', disabled: true },
] as never[]
const menuItems = [
  { key: 'home', label: '首页' },
  { key: 'museum', label: '博物馆' },
  { key: 'shop', label: '商店', disabled: true },
] as never[]
const tableColumns = [
  { key: 'name', title: '藏品' },
  { key: 'price', title: '价格', sortable: true, align: 'right' as const },
]
const tableRows = [
  { id: 1, name: '藤编椅', price: 1200 },
  { id: 2, name: '贝壳灯', price: 860 },
  { id: 3, name: '化石模型', price: 3500 },
]
const steps = [{ key: 'pick', label: '挑选' }, { key: 'pay', label: '付款' }, { key: 'done', label: '完成' }] as never[]
const events = [
  { time: '09:00', title: '早市开张', description: '把萝卜摆上摊位' },
  { time: '15:00', title: '钓鱼大赛' },
] as never[]
const timelineItems = events
</script>

<div class="gallery-cat">

## 通用

<div class="demo demo-col">

### [MochiButton](/components/button)

<MochiButton>主要操作</MochiButton>
<MochiButton variant="soft">次级</MochiButton>
<MochiButton variant="ghost">幽灵</MochiButton>
<MochiButton size="sm">小号</MochiButton>

### [MochiTag](/components/tag)

<MochiTag>中性</MochiTag>
<MochiTag tone="accent">薄荷</MochiTag>
<MochiTag tone="candy">糖果</MochiTag>
<MochiTag tone="danger">警示</MochiTag>

### [MochiBadge](/components/basics)

<MochiBadge :value="3"><MochiButton variant="soft">邮件</MochiButton></MochiBadge>
<MochiBadge value="99+"><MochiButton variant="soft">动态</MochiButton></MochiBadge>

### [MochiDivider](/components/basics)

<MochiDivider label="分隔" />

### [MochiLink](/components/misc)

<MochiLink href="https://www.npmjs.com/package/mochi-island-ui" external>npm 包页</MochiLink>

### [MochiKbd](/components/extras-2)

按 <MochiKbd>⌘K</MochiKbd> 唤起命令面板

### [MochiSpace](/components/misc)

<MochiSpace size="md" wrap>
  <MochiTag>一</MochiTag>
  <MochiTag>二</MochiTag>
  <MochiTag>三</MochiTag>
</MochiSpace>

### [MochiText](/components/misc)

<MochiText type="title">标题文字</MochiText>

</div>

</div>

<div class="gallery-cat">

## 表单

<div class="demo demo-col">

### [MochiInput](/components/input)

<MochiInput v-model="g.input" label="昵称" placeholder="给自己起个名字" hint="最多 12 个字" style="max-width: 320px" />

### [MochiSelect](/components/input)

<MochiSelect v-model="g.select" :options="selectOptions" label="下午茶" placeholder="请选择" style="max-width: 320px" />

### [MochiSwitch](/components/switch)

<MochiSwitch v-model="g.switch" label="接收通知" />

### [MochiCheckbox](/components/checkbox)

<MochiCheckbox v-model="g.check" label="我已阅读岛规" />

### [MochiInputNumber](/components/forms-advanced)

<MochiInputNumber v-model="g.num" :min="1" :max="10" label="岛上人口" />

### [MochiSlider](/components/forms-advanced)

<MochiSlider v-model="g.slider" label="音量" show-value style="max-width: 320px" />

### [MochiSegmented](/components/forms-advanced)

<MochiSegmented v-model="g.seg" :options="[{ value: 'grid', label: '网格' }, { value: 'list', label: '列表' }, { value: 'map', label: '地图' }]" label="视图" />

### [MochiDatePicker](/components/forms-advanced) · [MochiTimePicker](/components/menu-calendar)

<MochiDatePicker v-model="g.date" label="入住日期" style="max-width: 320px" />
<MochiTimePicker v-model="g.time" label="晚餐时间" style="max-width: 320px" />

### [MochiCascader](/components/tree-search)

<MochiCascader v-model="g.cascader" :options="addrOptions" label="地址" style="max-width: 320px" />

### [MochiTreeSelect](/components/tree-search)

<MochiTreeSelect v-model="g.treeSel" :data="treeData" label="地点" style="max-width: 320px" />

### [MochiAutoComplete](/components/tree-search)

<MochiAutoComplete v-model="g.auto" :options="[{ value: '沙滩', label: '沙滩' }, { value: '商店街', label: '商店街' }]" label="搜索地点" style="max-width: 320px" />

### [MochiColorPicker](/components/forms-advanced)

<MochiColorPicker v-model="g.color" label="品牌色" style="max-width: 320px" />

### [MochiTagInput](/components/extras)

<MochiTagInput v-model="g.tags" label="兴趣标签" :max="5" style="max-width: 420px" />

### [MochiCodeInput](/components/extras)

<MochiCodeInput v-model="g.code" :length="6" label="兑换码" />

</div>

</div>

<div class="gallery-cat">

## 数据展示

<div class="demo demo-col">

### [MochiTable](/components/table-upload)（渐进分片 + 排序 v-memo，超 30 行自动启用）

<MochiTable :columns="tableColumns" :rows="tableRows" striped style="max-width: 520px" />

### [MochiTree](/components/tree-search)

<MochiTree v-model:selected="g.tree" :data="treeData" style="max-width: 260px; border: var(--mochi-border-hairline) solid var(--mochi-line); border-radius: var(--mochi-radius-md)" />

### [MochiTabs](/components/qrcode)

<MochiTabs v-model="g.tab" :items="[{ key: 'today', label: '今天' }, { key: 'bag', label: '背包' }]">
  <template #today>今天的广场有烟火大会。</template>
  <template #bag>背包里有贝壳和胡萝卜。</template>
</MochiTabs>

### [MochiStatistic](/components/data-display) · [MochiCountUp](/components/misc)

<MochiStatistic title="铃钱余额" :value="128450" suffix="铃" />
<MochiCountUp :value="8642" suffix="里程" />

### [MochiTimeline](/components/data-display)

<MochiTimeline :items="timelineItems" style="max-width: 360px" />

### [MochiImage](/components/data-display)

<MochiImage src="https://mochi.liveroom.dpdns.org/logo.svg" alt="Mochi" caption="站点 logo" width="120px" height="72px" />

### [MochiQRCode](/components/qrcode)

<MochiQRCode value="https://mochi.liveroom.dpdns.org/" :size="96" />

### [MochiProgress](/components/rate) · [MochiProgressRing](/components/extras)

<MochiProgress :value="g.progress" label="今日进度" show-value style="max-width: 320px" />
<MochiProgressRing v-model="g.progress" :size="72" label="活力" />

### [MochiRate](/components/rate)

<MochiRate v-model="g.rate" />

### [MochiPagination](/components/rate)

<MochiPagination v-model:page="g.page" :total="120" />

### [MochiSteps](/components/rate)

<MochiSteps :current="g.step" :items="steps" />

### [MochiBreadcrumb](/components/navigation)

<MochiBreadcrumb :items="[{ label: '首页', href: '/' }, { label: '组件', href: '/components/button' }, { label: '演示厅' }]" />

### [MochiDescriptions](/components/data-display)

<MochiDescriptions :columns="2" :items="[{ label: '岛名', value: 'Mochi 岛' }, { label: '创建于', value: '2026-10' }]" style="max-width: 360px" />

</div>

</div>

<div class="gallery-cat">

## 反馈

<div class="demo demo-col">

### [MochiAlert](/components/feedback)

<MochiAlert tone="info" title="今日公告">广场今晚有烟火大会，记得带毯子。</MochiAlert>

### [MochiBanner](/components/extras-2)

<MochiBanner v-model:open="g.banner" tone="info" title="站点已更新">v2.1.0 到货。</MochiBanner>

### [MochiSpinner](/components/feedback) · [MochiSkeleton](/components/feedback) · [MochiEmpty](/components/feedback)

<MochiSpinner />
<MochiEmpty description="这里空空如也" style="max-width: 260px" />

### [MochiResult](/components/misc)

<MochiResult tone="success" title="捐赠成功" description="博物馆收到了你捐的化石。" style="max-width: 360px" />

</div>

</div>

<div class="gallery-cat">

## 容器与布局

<div class="demo demo-col">

### [MochiPanel](/components/panel)

<MochiPanel title="面板" style="max-width: 420px">
  header / body / footer 三段 anatomy。
  <template #footer>
    <MochiTag tone="candy">糖果色</MochiTag>
  </template>
</MochiPanel>

### [MochiCollapse](/components/panel)

<MochiCollapse title="岛屿等级怎么提升？" open>
  多种果树、邀请岛民、清完杂草。
</MochiCollapse>

### [MochiLayout](/components/layout-grid) · [MochiGrid](/components/layout-grid)

<MochiGrid :cols="12" :gap="12" style="max-width: 420px">
  <MochiGridItem :span="12" :sm="6" :md="4"><div style="padding: var(--mochi-space-3); border: var(--mochi-border-hairline) solid var(--mochi-line); border-radius: var(--mochi-radius-md); text-align: center; color: var(--mochi-ink-soft)">格一</div></MochiGridItem>
  <MochiGridItem :span="12" :sm="6" :md="4"><div style="padding: var(--mochi-space-3); border: var(--mochi-border-hairline) solid var(--mochi-line); border-radius: var(--mochi-radius-md); text-align: center; color: var(--mochi-ink-soft)">格二</div></MochiGridItem>
  <MochiGridItem :span="12" :md="4"><div style="padding: var(--mochi-space-3); border: var(--mochi-border-hairline) solid var(--mochi-line); border-radius: var(--mochi-radius-md); text-align: center; color: var(--mochi-ink-soft)">格三</div></MochiGridItem>
</MochiGrid>

### [MochiWatermark](/components/data-display)

<MochiWatermark content="MOCHI" :opacity="0.1" style="display: block; border-radius: var(--mochi-radius-md); max-width: 420px">
  <div style="padding: var(--mochi-space-4)">水印底下的内容</div>
</MochiWatermark>

</div>

</div>

<div class="gallery-cat">

## 交互与弹出（点一点）

<div class="demo demo-col">

### [MochiModal](/components/modal) · [MochiDrawer](/components/navigation-extra)

<MochiButton size="sm" @click="g.modal = true">打开对话框</MochiButton>
<MochiButton size="sm" variant="soft" @click="g.drawer = true">打开抽屉</MochiButton>

<MochiModal v-model:open="g.modal" title="确认出售">
  <p style="margin: 0">化石模型售价 3500 铃钱，确定吗？</p>
  <template #footer>
    <MochiButton size="sm" variant="ghost" @click="g.modal = false">再想想</MochiButton>
    <MochiButton size="sm" @click="g.modal = false">出售</MochiButton>
  </template>
</MochiModal>

<MochiDrawer v-model:open="g.drawer" title="岛民档案" placement="right" width="360px">
  <p style="margin: 0">抽屉内容。</p>
</MochiDrawer>

### [MochiToast](/components/toast-popover)

<MochiButton size="sm" variant="soft" @click="toast({ title: '已收藏', description: '贝壳灯加入愿望单', tone: 'success' })">弹一条 Toast</MochiButton>

### [MochiTransfer](/components/forms-advanced)

<MochiTransfer v-model="g.transfer" :data="transferData" :titles="['水果摊', '购物篮']" style="max-width: 480px" />

### [MochiMenu](/components/menu-calendar)

<MochiMenu v-model="g.menu" :items="menuItems" style="max-width: 220px; border: var(--mochi-border-hairline) solid var(--mochi-line); border-radius: var(--mochi-radius-md)" />

</div>

</div>

<div class="gallery-cat">

## 签名组件

<div class="demo demo-col">

### [MochiDialogBubble](/components/dialog-bubble)

<MochiDialogBubble placement="left" text="今天的胡萝卜收成不错，要不要一起去广场看看？" style="max-width: 420px" />

</div>

</div>

## 更多组件

以下组件依赖滚动位置或复杂交互，演示见各自的详细页：
[Anchor 锚点](/components/command-palette)、[Affix 固钉](/components/command-palette)、[BackTop 回顶](/components/navigation)、
[CommandPalette 命令面板](/components/command-palette)、[Popover 气泡](/components/toast-popover)、
[Popconfirm 确认](/components/toast-popover)、[Upload 上传](/components/table-upload)、
[Mentions 提及](/components/mentions)、[Carousel 轮播](/components/carousel-time)、[Calendar 日历](/components/menu-calendar)、
[LoadMore 加载更多](/components/extras-2)、[Countdown 倒计时](/components/extras)、
[AvatarGroup 头像组](/components/extras)、[ToastHost 承载器](/components/toast-popover)。

完整清单与一句话介绍见仓库根目录 [AI_USAGE.md](https://github.com/luckerr2007/mochi/blob/main/AI_USAGE.md)。

<style>
/* 演示厅分组层次：分类带主色底线，组件条目拉开间距（作用域仅本页类名） */
.gallery-cat {
  margin-top: var(--mochi-space-6);
}

.gallery-cat > h2 {
  padding-bottom: var(--mochi-space-2);
  border-bottom: 2px solid var(--mochi-primary-soft, #e8613c33);
}

.demo-col h3 {
  margin: var(--mochi-space-5, 20px) 0 var(--mochi-space-2, 8px);
  font-size: 15px;
  font-weight: var(--mochi-font-weight-bold, 700);
}

.demo-col h3 a {
  color: var(--mochi-ink, inherit);
  text-decoration: none;
}

.demo-col h3 a:hover {
  color: var(--mochi-primary, #e8613c);
}
</style>
