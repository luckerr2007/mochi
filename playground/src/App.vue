<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { applyTheme, useToast, type MochiTheme } from 'mochi-island-ui';

const sections = [
  { id: 'button', label: '按钮', title: 'Button', desc: '胶囊形状，按下时整体下沉，位移量等于台阶高度。' },
  { id: 'tags', label: '标签与徽标', title: 'Tag · Badge · Avatar', desc: '色相由底色承担，文字始终是深棕。' },
  { id: 'form', label: '表单', title: 'Form controls', desc: '输入、选择、开关共用一套凹陷槽与焦点环。' },
  { id: 'form2', label: '表单进阶', title: 'Form · Number · Slider · Segmented', desc: '带错误位的表单、数字步进、滑块与分段控制。' },
  { id: 'data2', label: '数据展示', title: 'Statistic · Descriptions · Timeline', desc: '数字滚动、描述列表与时间轴。' },
  { id: 'feedback', label: '反馈', title: 'Alert · Spinner · Skeleton · Empty', desc: '状态提示与占位，语气克制。' },
  { id: 'surface', label: '容器', title: 'Panel · List · Collapse', desc: '面板三段 anatomy、错峰入场、原生折叠。' },
  { id: 'nav', label: '导航', title: 'Pagination · Steps · Rate', desc: '翻页、步骤与评分，共用同一套台阶物理。' },
  { id: 'more-form', label: '表单增强', title: 'Transfer · ColorPicker · Mentions', desc: '穿梭框、取色器与提及输入。' },
  { id: 'more-tool', label: '快捷与随行', title: 'CommandPalette · Anchor · Affix', desc: '⌘K 命令面板，滚动时的随行件。' },
  { id: 'more-misc', label: '补充件', title: 'Tabs · Result · QRCode · Space · Link', desc: '标签页内容切换、结果页、二维码与排版。' },
  { id: 'extra2', label: '新到件', title: 'AvatarGroup · TagInput · Ring · Code · Countdown', desc: '头像组、标签输入、环形进度、兑换码与倒计时。' },
  { id: 'dialog', label: '对话', title: 'DialogBubble', desc: '手绘尾巴，可选打字机。' },
  { id: 'virtual', label: '万行压测', title: 'CSS 虚拟化', desc: 'content-visibility：DOM 全保留，屏外行不渲染。' },
  { id: 'tokens', label: '令牌', title: 'Design tokens', desc: '全部 --mochi-* 变量，换肤只改这里。' },
] as const;

const active = ref<string>('button');
const current = computed(() => sections.find((s) => s.id === active.value) ?? sections[0]);

function go(id: string) {
  active.value = id;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---------- 状态 ---------- */
const mintTheme: MochiTheme = {
  '--mochi-primary': '#4fa89b',
  '--mochi-primary-deep': '#35786f',
  '--mochi-primary-soft': '#d9f2ee',
  '--mochi-on-primary': '#0f332e',
  '--mochi-shadow-press-color': '#b7d8d2',
};

const values = ref<Record<string, string>>({});
const minted = ref(false);
let dispose: (() => void) | null = null;

const nickname = ref('小动物');
const email = ref('not-an-email');
const note = ref('今天的广场特别热闹，晚上有烟火大会。');
const fruit = ref('apple');
const fruitOptions = [
  { label: '苹果', value: 'apple' },
  { label: '橘子', value: 'orange' },
  { label: '梨', value: 'pear' },
];
const menu = ref('');
const menuOptions = [
  { label: '苹果茶', value: 'apple-tea' },
  { label: '贝壳拿铁', value: 'shell-latte' },
  { label: '樱花汽水', value: 'sakura-soda', disabled: true },
];
const notify = ref(true);
const agree = ref(false);
const tags = ref(['草莓', '胡萝卜', '铃兰']);
const chores = ['给花浇水', '寄一封信给邻居', '把贝壳捐给博物馆'];
const tab = ref('home');
const tabItems = [
  { key: 'home', label: '今天' },
  { key: 'bag', label: '背包' },
];
const xp = ref(72);
const replay = ref(0);
const modalOpen = ref(false);
const page = ref(6);
const step = ref(1);
const score = ref(3);
const drawerOpen = ref(false);
const steps = [
  { title: '下单', description: '选好家具' },
  { title: '付款', description: '铃钱结算' },
  { title: '发货', description: '等待航班' },
];

// 表单进阶 / 数据展示
const person = ref('');
const pop = ref(6);
const volume = ref(64);
const view = ref('grid');
const views = [
  { label: '网格', value: 'grid' },
  { label: '列表', value: 'list' },
  { label: '地图', value: 'map', disabled: true },
];
const profile = [
  { label: '岛名', value: '薄荷岛' },
  { label: '岛主', value: '咕噜' },
  { label: '评级', value: '五星' },
  { label: '人口', value: '8 人' },
];
const events = [
  { title: '登岛', time: '第 1 天' },
  { title: '开出第一间店', time: '第 12 天', tone: 'accent' as const },
  { title: '博物馆落成', time: '第 88 天', tone: 'candy' as const },
];

const { toast } = useToast();

// 表格与上传
const columns = [
  { key: 'name', title: '家具' },
  { key: 'price', title: '价格', sortable: true, align: 'right' as const },
  { key: 'status', title: '状态' },
];
const furniture = [
  { id: 1, name: '藤编椅', price: 1200, status: '在售' },
  { id: 2, name: '贝壳灯', price: 860, status: '在售' },
  { id: 3, name: '化石模型', price: 3500, status: '已售出' },
];
// 万行压测：渐进分片（默认开）与 CSS 虚拟化（opt-in）A/B，v-if 首次进入才渲染并计时
const stressVirtual = ref(false);
const stressProgressive = ref(true);
const stressMs = ref<number | null>(null);
const stressSelect = ref('');
const stressColumns = [
  { key: 'id', title: 'ID', sortable: true, align: 'right' as const },
  { key: 'name', title: '藏品' },
  { key: 'owner', title: '负责人' },
  { key: 'stars', title: '收藏', sortable: true, align: 'right' as const },
];
const stressRows = Array.from({ length: 10_000 }, (_, i) => ({
  id: i + 1,
  name: `藏品 ${String(i + 1).padStart(5, '0')}`,
  owner: ['阿饼', '绵绵', '荷叶', '豆豆'][i % 4],
  stars: (i * 37) % 999,
}));
const stressOptions = Array.from({ length: 1_000 }, (_, i) => ({
  value: String(i),
  label: `选项 ${String(i).padStart(4, '0')}`,
}));
const stressTree = Array.from({ length: 60 }, (_, i) => ({
  key: `series-${i}`,
  label: `系列 ${i}`,
  children: Array.from({ length: 40 }, (_, j) => ({ key: `series-${i}-${j}`, label: `条目 ${i}-${j}` })),
}));

watch(active, async (id) => {
  if (id !== 'virtual' || stressMs.value !== null) return;
  const start = performance.now();
  await nextTick();
  requestAnimationFrame(() => {
    stressMs.value = Math.round(performance.now() - start);
  });
});

const pickedMenu = ref('');
const menuItems = [
  { key: 'edit', label: '编辑' },
  { key: 'duplicate', label: '复制一份' },
  { key: 'remove', label: '删除', divider: true },
  { key: 'archive', label: '归档', disabled: true },
];

// 菜单与日历
const activeMenu = ref('museum');
const navItems = [
  { key: 'home', label: '首页' },
  {
    key: 'island',
    label: '岛屿',
    children: [
      { key: 'museum', label: '博物馆' },
      { key: 'shop', label: '商店' },
      { key: 'airport', label: '机场', disabled: true },
    ],
  },
  { key: 'resident', label: '岛民名册' },
];
const date = ref(new Date());
const birthday = ref<Date | null>(null);

// 轮播与时间
const slides = [
  { key: 'a', alt: '薄荷岛', bg: 'color-mix(in srgb, var(--mochi-primary) 22%, var(--mochi-surface))' },
  { key: 'b', alt: '博物馆', bg: 'color-mix(in srgb, var(--mochi-accent) 22%, var(--mochi-surface))' },
  { key: 'c', alt: '小径', bg: 'color-mix(in srgb, var(--mochi-accent-candy) 22%, var(--mochi-surface))' },
];
const dinner = ref('18:30');

// 树与自动补全
const treeNodes = [
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
const treePicked = ref('');
const places = ['博物馆', '中心广场', '商店街', '沙滩', '码头', '机场', '露营地'];
const place = ref('');
const addr = ref<string[]>([]);
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
const photo = ref('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22240%22 height=%22150%22%3E%3Crect width=%22240%22 height=%22150%22 fill=%22%23f6e7d2%22/%3E%3Ccircle cx=%22120%22 cy=%2270%22 r=%2236%22 fill=%22%23e8833a%22/%3E%3C/svg%3E');

// ---------- 补齐的 12 个组件 ----------
const moreTab = ref('home');
const moreTabs = [
  { key: 'home', label: '今天' },
  { key: 'bag', label: '背包' },
  { key: 'shop', label: '商店' },
];

const shelf = ref(['rattan-chair']);
const shelfData = [
  { key: 'shell-lamp', label: '贝壳灯' },
  { key: 'rattan-chair', label: '藤编椅' },
  { key: 'fossil', label: '化石模型' },
  { key: 'lucky-cat', label: '招财猫', disabled: true },
];

const pickedColor = ref('#f0875c');
const mentionText = ref('');
const villagers = ['娜娜', '波波', '莉莉', '阿保', '古信'];

const paletteOpen = ref(false);
const paletteCommands = [
  { key: 'save', label: '保存岛屿', hint: '⌘S' },
  { key: 'photo', label: '拍照模式' },
  { key: 'shop', label: '商店', group: '前往' },
  { key: 'museum', label: '博物馆', group: '前往' },
  { key: 'airport', label: '机场（维护中）', group: '前往', disabled: true },
];
const lastCommand = ref('');
const qrText = ref('https://mochi.dev');
const resultDone = ref(true);

// ---------- 新到件 ----------
const crew = [
  { name: '娜娜' },
  { name: '波波' },
  { name: '莉莉' },
  { name: '阿保' },
  { name: '古信' },
];
const interestTags = ref(['家具', '贝壳']);
const ringValue = ref(64);
const redeemCode = ref('');
const bannerOpen = ref(true);
const loadStatus = ref<'idle' | 'loading' | 'done'>('idle');
function startLoad() {
  loadStatus.value = 'loading';
  setTimeout(() => (loadStatus.value = 'idle'), 1200);
}

const swatchTokens = [
  '--mochi-bg',
  '--mochi-surface',
  '--mochi-ink',
  '--mochi-primary',
  '--mochi-accent',
  '--mochi-danger',
] as const;

function removeTag(tag: string) {
  tags.value = tags.value.filter((item) => item !== tag);
}

function readTokens() {
  const computedStyle = getComputedStyle(document.documentElement);
  values.value = Object.fromEntries(
    swatchTokens.map((token) => [token, computedStyle.getPropertyValue(token).trim()]),
  );
}

function toggleTheme() {
  if (minted.value) {
    dispose?.();
    dispose = null;
    minted.value = false;
  } else {
    dispose = applyTheme(mintTheme);
    minted.value = true;
  }
  readTokens();
}

onMounted(() => {
  readTokens();
  if (new URLSearchParams(location.search).get('theme') === 'mint') toggleTheme();
});
</script>

<template>
  <div class="shell">
    <aside class="rail">
      <div class="brand">
        <span class="dot" />
        <span>Mochi</span>
      </div>

      <nav class="nav">
        <button
          v-for="section in sections"
          :key="section.id"
          type="button"
          :class="['nav-item', { on: active === section.id }]"
          @click="go(section.id)"
        >
          {{ section.label }}
        </button>
      </nav>

      <MochiButton size="sm" variant="soft" class="theme-btn" @click="toggleTheme">
        {{ minted ? '还原蜜桃橘' : '薄荷主题' }}
      </MochiButton>
    </aside>

    <main class="stage">
      <header class="head">
        <h1>{{ current.title }}</h1>
        <p>{{ current.desc }}</p>
      </header>

      <!-- 按钮 -->
      <section v-show="active === 'button'" class="spec">
        <div class="surface">
          <div class="row">
            <MochiButton>主要操作</MochiButton>
            <MochiButton variant="soft">次级操作</MochiButton>
            <MochiButton variant="ghost">幽灵按钮</MochiButton>
            <MochiButton disabled>禁用</MochiButton>
          </div>
          <MochiDivider label="尺寸" />
          <div class="row">
            <MochiButton size="sm">小号</MochiButton>
            <MochiButton size="md">中号</MochiButton>
            <MochiButton size="lg">大号</MochiButton>
          </div>
        </div>
      </section>

      <!-- 标签与徽标 -->
      <section v-show="active === 'tags'" class="spec">
        <div class="surface">
          <div class="row">
            <MochiTag v-for="tag in tags" :key="tag" closable :close-label="`移除 ${tag}`" @close="removeTag(tag)">
              {{ tag }}
            </MochiTag>
            <MochiTag tone="accent">薄荷</MochiTag>
            <MochiTag tone="candy">糖果</MochiTag>
            <MochiTag tone="danger">已过期</MochiTag>
          </div>
          <MochiDivider label="徽标与头像" />
          <div class="row">
            <MochiBadge dot tone="accent"><MochiAvatar name="咕噜" size="sm" /></MochiBadge>
            <MochiBadge :value="2"><MochiButton size="md" variant="soft">邮件</MochiButton></MochiBadge>
            <MochiBadge value="99+"><MochiAvatar name="阿獭" /></MochiBadge>
          </div>
        </div>
      </section>

      <!-- 表单 -->
      <section v-show="active === 'form'" class="spec">
        <div class="surface form">
          <MochiInput v-model="nickname" label="昵称" hint="最多 12 个字，会显示在广场上" />
          <MochiInput v-model="email" label="邮箱" invalid hint="格式不正确" />
          <MochiTextarea v-model="note" label="留言" :rows="3" hint="最多 200 字" />
          <MochiSelect v-model="menu" label="下午茶" placeholder="请选择" :options="menuOptions" />
          <MochiTimePicker v-model="dinner" label="晚餐时间" hint="点开选择，选完自动收起" />
          <MochiCascader v-model="addr" :options="addrOptions" label="地址" hint="逐级下钻，选到叶子为止" />
          <MochiTreeSelect v-model="spot" :data="spotOptions" label="地点" hint="展开树选一个节点" />
          <MochiAutoComplete v-model="place" :options="places" label="地点" hint="输入以筛选，↑↓ 选择，回车确认" />
          <MochiUpload :max-size="2 * 1024 * 1024" hint="拖入设计稿，或点击选择" />
          <MochiRadioGroup v-model="fruit" legend="今天想吃什么" :options="fruitOptions" />
          <div class="row">
            <MochiSwitch v-model="notify" label="接收通知" />
            <MochiCheckbox v-model="agree" label="同意条款" />
          </div>
        </div>
      </section>

      <!-- 表单进阶 -->
      <section v-show="active === 'form2'" class="spec">
        <div class="surface">
          <MochiDatePicker v-model="birthday" label="入住日期" hint="点开选择，选完自动收起" />
          <MochiForm @submit="() => {}">
            <MochiFormItem label="昵称" required :error="person ? '' : '昵称不能为空'">
              <MochiInput v-model="person" placeholder="给自己起个名字" />
            </MochiFormItem>
            <MochiFormItem label="岛上人口" hint="1-10 人">
              <MochiInputNumber v-model="pop" :min="1" :max="10" />
            </MochiFormItem>
            <div class="row">
              <MochiButton size="sm" type="submit">提交</MochiButton>
            </div>
          </MochiForm>
          <MochiDivider label="滑块与分段" />
          <MochiSlider v-model="volume" show-value label="音量" />
          <MochiSegmented v-model="view" :options="views" label="视图" />
          <MochiDivider label="日历" />
          <MochiCalendar v-model="date" />
        </div>
      </section>

      <!-- 数据展示 -->
      <section v-show="active === 'data2'" class="spec">
        <div class="surface">
          <div class="row">
            <MochiImage :src="photo" alt="岛屿航拍" caption="岛屿航拍 · 点击放大" width="140px" height="88px" />
            <MochiImage :src="photo" alt="港口" caption="港口 · 点击放大" width="140px" height="88px" />
          </div>
          <div class="row" style="gap: var(--mochi-space-8)">
            <MochiStatistic title="铃钱余额" :value="128450" suffix="铃" />
            <MochiStatistic title="岛屿评分" :value="4.7" :precision="1" suffix="/ 5" />
            <MochiCountUp :value="8642" suffix="里程" />
          </div>
          <MochiDivider label="岛屿档案" />
          <MochiWatermark content="MOCHI DEMO" :opacity="0.1" style="display: block; border-radius: var(--mochi-radius-md)">
            <MochiDescriptions :columns="2" :items="profile" style="padding: var(--mochi-space-3)" />
          </MochiWatermark>
          <MochiDivider label="地点树" />
          <MochiTree v-model:selected="treePicked" :data="treeNodes" style="border: var(--mochi-border-hairline) solid var(--mochi-line); border-radius: var(--mochi-radius-md)" />
          <MochiDivider label="家具清单" />
          <MochiTable :columns="columns" :rows="furniture" striped>
            <template #cell-status="{ value }">
              <MochiTag :tone="value === '在售' ? 'accent' : 'neutral'">{{ value }}</MochiTag>
            </template>
          </MochiTable>
        </div>

        <div class="surface">
          <MochiBreadcrumb :items="[{ label: '首页', href: '#' }, { label: '家具', href: '#' }, { label: '藤编系列' }]" />
          <MochiDivider />
          <MochiTimeline :items="events" />
        </div>
      </section>

      <!-- 反馈 -->
      <section v-show="active === 'feedback'" class="spec">
        <div class="surface form">
          <MochiAlert tone="info" title="今日公告">广场今晚有烟火大会，记得带毯子。</MochiAlert>
          <MochiAlert tone="danger" title="保存失败" closable>网络连接中断，请重试。</MochiAlert>
          <MochiDivider label="加载与占位" />
          <div class="row">
            <MochiSpinner />
            <MochiSpinner :size="28" label="读取岛屿数据" />
          </div>
          <MochiSkeleton :lines="2" />
          <MochiEmpty description="还没有收藏任何家具">
            <template #action>
              <MochiButton size="sm">去逛逛</MochiButton>
            </template>
          </MochiEmpty>
          <MochiDivider label="对话框" />
          <div class="row">
            <MochiButton size="sm" @click="modalOpen = true">打开对话框</MochiButton>
          </div>

          <MochiDivider label="通知与浮层" />
          <div class="row">
            <MochiButton size="sm" @click="toast({ title: '已保存', description: '捐赠记录更新了', tone: 'success' })">
              弹出通知
            </MochiButton>
            <MochiPopover>
              <template #trigger="{ attrs }">
                <MochiButton size="sm" variant="soft" v-bind="attrs">点我看详情</MochiButton>
              </template>
              <p style="margin: 0">浮层里可以放任意内容。</p>
              <p style="margin: 8px 0 0; color: var(--mochi-ink-soft); font-size: 12px">
                点击外部或按 Esc 关闭。
              </p>
            </MochiPopover>
            <MochiPopconfirm
              title="确定要移出岛屿吗？"
              description="这个操作无法撤销。"
              tone="danger"
              @confirm="toast({ title: '已移出', tone: 'warning' })"
            >
              <template #trigger>
                <MochiButton size="sm" variant="ghost">移出岛民</MochiButton>
              </template>
            </MochiPopconfirm>
          </div>
        </div>

        <MochiModal v-model:open="modalOpen" title="确认出售">
          这个化石能卖 3500 铃钱，卖出后无法找回。
          <template #footer>
            <MochiButton variant="ghost" size="sm" @click="modalOpen = false">再想想</MochiButton>
            <MochiButton size="sm" @click="modalOpen = false">卖出</MochiButton>
          </template>
        </MochiModal>

        <MochiDrawer v-model:open="drawerOpen" title="岛民档案" placement="right" width="320px">
          <p style="margin: 0 0 var(--mochi-space-3)">咕噜 · 岛龄 3 年</p>
          <p style="margin: 0">喜欢：钓鱼、看云、在广场发呆。</p>
        </MochiDrawer>
      </section>

      <!-- 容器 -->
      <section v-show="active === 'surface'" class="spec">
        <MochiPanel title="背包" class="block">
          <MochiList ordered stagger>
            <li v-for="chore in chores" :key="chore">{{ chore }}</li>
          </MochiList>
          <template #footer>
            <MochiButton size="sm" variant="soft">整理</MochiButton>
            <MochiButton size="sm">使用</MochiButton>
          </template>
        </MochiPanel>

        <MochiCollapse title="岛屿等级怎么提升？" class="block" open>
          完成日常委托、捐建公共设施、保持环境整洁都会累积评价。
        </MochiCollapse>
      </section>

      <!-- 导航 -->
      <section v-show="active === 'nav'" class="spec">
        <div class="surface">
          <MochiSteps :current="step" :items="steps" />
          <div class="row">
            <MochiButton size="sm" variant="soft" :disabled="step === 0" @click="step -= 1">上一步</MochiButton>
            <MochiButton size="sm" :disabled="step === steps.length - 1" @click="step += 1">下一步</MochiButton>
          </div>
          <MochiDivider label="翻页" />
          <MochiPagination v-model="page" :total="20" />
          <MochiDivider label="轮播" />
          <MochiCarousel :items="slides" :interval="3500" height="170px">
            <template #slide="{ item }">
              <div
                :style="{
                  width: '100%',
                  height: '100%',
                  display: 'grid',
                  placeItems: 'center',
                  background: item.bg as string,
                  fontSize: 'var(--mochi-font-size-lg)',
                  fontWeight: 'var(--mochi-font-weight-bold)',
                }"
              >
                {{ item.alt }}
              </div>
            </template>
          </MochiCarousel>
          <MochiDivider label="侧边菜单" />
          <div class="row" style="align-items: flex-start; gap: var(--mochi-space-6)">
            <MochiMenu v-model="activeMenu" :items="navItems" style="border: var(--mochi-border-hairline) solid var(--mochi-line); border-radius: var(--mochi-radius-md)" />
            <MochiText tone="soft" size="sm">当前：{{ activeMenu }}</MochiText>
          </div>
          <MochiDivider label="下拉菜单" />
          <div class="row">
            <MochiDropdown :items="menuItems" @select="pickedMenu = $event">
              <template #trigger>
                <MochiButton size="sm" variant="soft">更多操作</MochiButton>
              </template>
            </MochiDropdown>
            <MochiText v-if="pickedMenu" tone="soft" size="sm">已选择：{{ pickedMenu }}</MochiText>
          </div>
        </div>

        <div class="surface">
          <MochiRate v-model="score" label="岛屿评分" />
          <MochiDivider />
          <div class="row">
            <MochiTooltip content="保存在本地，不会上传" placement="top">
              <MochiButton size="sm" variant="soft">悬停看提示</MochiButton>
            </MochiTooltip>
            <MochiButton size="sm" @click="drawerOpen = true">打开抽屉</MochiButton>
          </div>
        </div>
      </section>

      <!-- 对话 -->
      <section v-show="active === 'dialog'" class="spec">
        <div class="surface dialog">
          <MochiDialogBubble
            :key="replay"
            class="left"
            placement="left"
            text="今天的胡萝卜收成不错，要不要一起去广场看看？"
            typewriter
            :speed="35"
          />
          <MochiDialogBubble class="right" placement="right" text="好呀，等我换上外套！" />
          <div class="row">
            <MochiButton size="sm" variant="ghost" @click="replay += 1">重播打字机</MochiButton>
          </div>
        </div>
      </section>

      <!-- 表单增强 -->
      <section v-show="active === 'more-form'" class="spec">
        <div class="surface">
          <MochiTransfer v-model="shelf" :data="shelfData" searchable :titles="['仓库', '货架']" />
          <MochiDivider label="取色器" />
          <div class="row">
            <MochiColorPicker v-model="pickedColor" label="品牌色" />
            <span
              :style="{
                width: '24px',
                height: '24px',
                borderRadius: 'var(--mochi-radius-xs)',
                border: '1px solid var(--mochi-line)',
                background: pickedColor,
              }"
            />
            <MochiText tone="soft" size="sm">当前：{{ pickedColor }}</MochiText>
          </div>
          <MochiDivider label="提及" />
          <MochiMentions v-model="mentionText" :options="villagers" label="留言板" hint="输入 @ 唤起岛民，↑↓ 选择，回车确认" />
        </div>
      </section>

      <!-- 快捷与随行 -->
      <section v-show="active === 'more-tool'" class="spec">
        <div class="surface">
          <div class="row">
            <MochiButton size="sm" @click="paletteOpen = true">打开命令面板（试试 ⌘K）</MochiButton>
            <MochiText v-if="lastCommand" tone="soft" size="sm">最近执行：{{ lastCommand }}</MochiText>
          </div>
          <MochiCommandPalette v-model:open="paletteOpen" :commands="paletteCommands" @select="lastCommand = $event.label" />
          <MochiDivider label="锚点（滚动页面看指示条滑动）" />
          <div style="display: flex; gap: var(--mochi-space-6)">
            <MochiAnchor :items="[{ id: 'pg-a', label: '第一章' }, { id: 'pg-b', label: '第二章' }]" />
            <div style="flex: 1; min-width: 0">
              <h3 id="pg-a" style="margin: 0 0 var(--mochi-space-2); font-size: var(--mochi-font-size-base)">第一章 · 登岛</h3>
              <p style="margin: 0 0 160px; color: var(--mochi-ink-soft)">往下滚动，指示条会跟着章节走。</p>
              <h3 id="pg-b" style="margin: 0 0 var(--mochi-space-2); font-size: var(--mochi-font-size-base)">第二章 · 开店</h3>
              <p style="margin: 0; color: var(--mochi-ink-soft)">选完记得回顶部看看。</p>
            </div>
          </div>
          <MochiDivider label="固钉" />
          <div
            style="
              height: 320px;
              box-sizing: border-box;
              border: var(--mochi-border-hairline) dashed var(--mochi-line-strong);
              border-radius: var(--mochi-radius-md);
              padding: var(--mochi-space-3);
            "
          >
            <MochiAffix :offset-top="16">
              <MochiTag tone="accent">往下滚，我会钉在窗口顶部</MochiTag>
            </MochiAffix>
          </div>
        </div>
      </section>

      <!-- 补充件 -->
      <section v-show="active === 'more-misc'" class="spec">
        <div class="surface">
          <MochiTabs v-model="moreTab" :items="moreTabs">
            <template #home>今天的广场有烟火大会，记得带毯子。</template>
            <template #bag>背包里装着贝壳、胡萝卜和一封没寄出的信。</template>
            <template #shop>商店街新到了一批藤编家具。</template>
          </MochiTabs>
          <MochiDivider label="结果页" />
          <MochiResult v-if="resultDone" tone="success" title="捐赠成功" description="博物馆收到了你捐的化石。">
            <template #actions>
              <MochiButton size="sm" variant="ghost" @click="resultDone = false">继续逛</MochiButton>
            </template>
          </MochiResult>
          <div v-else class="row">
            <MochiButton size="sm" @click="resultDone = true">再看一次结果页</MochiButton>
          </div>
          <MochiDivider label="二维码" />
          <div class="row" style="align-items: flex-start">
            <MochiQRCode :value="qrText" :size="132" />
            <div style="flex: 1; min-width: 0">
              <MochiInput v-model="qrText" label="二维码内容" hint="改内容看它弹簧重绘" />
            </div>
          </div>
          <MochiDivider label="间距与链接" />
          <MochiSpace size="md">
            <MochiLink href="https://github.com" external>项目仓库</MochiLink>
            <MochiLink href="#" disabled>暂未开放</MochiLink>
          </MochiSpace>
        </div>
      </section>

      <!-- 新到件 -->
      <section v-show="active === 'extra2'" class="spec">
        <div class="surface">
          <MochiAvatarGroup :items="crew" :max="4" />
          <MochiDivider label="标签输入" />
          <MochiTagInput v-model="interestTags" label="兴趣标签" hint="回车或逗号添加" :max="5" />
          <MochiDivider label="环形进度" />
          <div class="row">
            <MochiProgressRing v-model="ringValue" :size="88" label="今日活力" />
            <MochiProgressRing :value="40" tone="accent" :size="88" label="浇水" />
            <div class="row">
              <MochiButton size="sm" variant="soft" :disabled="ringValue >= 100" @click="ringValue = Math.min(100, ringValue + 12)">
                +12
              </MochiButton>
            </div>
          </div>
          <MochiDivider label="兑换码" />
          <MochiCodeInput v-model="redeemCode" :length="6" label="兑换码" hint="填满自动核销" @complete="toast({ title: '已核销', description: redeemCode, tone: 'success' })" />
          <MochiDivider label="倒计时" />
          <MochiDivider label="公告条" />
          <MochiBanner v-model:open="bannerOpen" tone="info" title="冬季更新">74 个组件到货。</MochiBanner>
          <div class="row">
            <MochiButton size="sm" variant="soft" @click="bannerOpen = true">重新展开公告</MochiButton>
          </div>
          <MochiDivider label="加载更多" />
          <MochiLoadMore :status="loadStatus" @more="startLoad" />
          <MochiDivider label="键位" />
          <p style="margin: 0">按 <MochiKbd>⌘K</MochiKbd> 唤起命令面板，<MochiKbd>Esc</MochiKbd> 关闭。</p>
        </div>
      </section>

      <!-- 令牌 -->
      <section v-if="active === 'virtual'" class="spec">
        <div class="surface">
          <div class="row" style="justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--mochi-space-4)">
            <strong>万行渲染：渐进分片 + CSS 虚拟化</strong>
            <div style="display: inline-flex; gap: var(--mochi-space-6); align-items: center">
              <label style="display: inline-flex; gap: var(--mochi-space-2); align-items: center">
                <MochiSwitch v-model="stressProgressive" />
                渐进分片
              </label>
              <label style="display: inline-flex; gap: var(--mochi-space-2); align-items: center">
                <MochiSwitch v-model="stressVirtual" />
                CSS 虚拟化
              </label>
              <span style="color: var(--mochi-ink-soft)">首屏 {{ stressMs === null ? '…' : `${stressMs} ms` }}</span>
            </div>
          </div>
          <p class="desc" style="margin: var(--mochi-space-2) 0 0; color: var(--mochi-ink-soft)">
            一万行表格 / 一千项选择器 / 两千多节点树。渐进分片：先渲染首块 200 行尽快出屏，
            其余行 idle 期补齐，块大小按上一块实测耗时反馈调节（目标 8ms），慢硬件自动缩小、
            快硬件自动放大；DOM 最终全量保留（可 Ctrl+F、可复制）。CSS 虚拟化三态：
            开关在这里是强制开/关，组件默认 auto——低端设备（≤4 核或 ≤4GB）自动开启。
          </p>

          <MochiDivider label="一万行表格" />
          <MochiTable
            :columns="stressColumns"
            :rows="stressRows"
            striped
            :virtual="stressVirtual"
            :progressive="stressProgressive"
          />

          <MochiDivider label="一千项选择器" />
          <MochiSelect v-model="stressSelect" :options="stressOptions" :virtual="stressVirtual" label="藏品检索" />

          <MochiDivider label="两千节点树" />
          <MochiTree
            default-expand-all
            :data="stressTree"
            :virtual="stressVirtual"
            style="max-height: 320px; overflow: auto; border: var(--mochi-border-hairline) solid var(--mochi-line); border-radius: var(--mochi-radius-md)"
          />
        </div>
      </section>

      <section v-show="active === 'tokens'" class="spec">
        <div class="surface">
          <div class="swatches">
            <figure v-for="token in swatchTokens" :key="token" class="swatch">
              <div class="chip" :style="{ background: `var(${token})` }" />
              <figcaption>
                <code>{{ token }}</code>
                <span>{{ values[token] || '—' }}</span>
              </figcaption>
            </figure>
          </div>
          <MochiDivider label="进度" />
          <MochiProgress :value="xp" label="今日进度" show-value />
          <div class="row">
            <MochiButton size="sm" variant="soft" :disabled="xp >= 100" @click="xp = Math.min(100, xp + 14)">
              完成一件
            </MochiButton>
          </div>
        </div>
      </section>
    </main>

    <MochiToastHost />
    <!-- 全局随行件：滚过一屏后出现 -->
    <MochiBackTop />
  </div>
</template>

<style scoped>
.shell {
  display: grid;
  grid-template-columns: 208px minmax(0, 1fr);
  min-height: 100vh;
  background: var(--mochi-bg);
  color: var(--mochi-ink);
  font-family: var(--mochi-font-family);
  font-size: var(--mochi-font-size-base);
  line-height: var(--mochi-line-height);
}

/* ---------- 左侧导航 ---------- */
.rail {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  gap: var(--mochi-space-6);
  height: 100vh;
  padding: var(--mochi-space-6) var(--mochi-space-4);
  box-sizing: border-box;
  border-right: var(--mochi-border-hairline) solid var(--mochi-line);
  background: var(--mochi-surface);
}

.brand {
  display: flex;
  align-items: center;
  gap: var(--mochi-space-2);
  padding-left: var(--mochi-space-2);
  font-size: var(--mochi-font-size-lg);
  font-weight: var(--mochi-font-weight-bold);
  letter-spacing: -0.2px;
}

.dot {
  width: 12px;
  height: 12px;
  border: 2px solid var(--mochi-primary-deep);
  border-radius: var(--mochi-radius-full);
  background: var(--mochi-primary);
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-item {
  padding: var(--mochi-space-2) var(--mochi-space-3);
  border: 0;
  border-radius: var(--mochi-radius-sm);
  background: transparent;
  color: var(--mochi-ink-soft);
  font: inherit;
  font-size: var(--mochi-font-size-sm);
  text-align: left;
  cursor: pointer;
  transition:
    background-color var(--mochi-duration-fast) var(--mochi-ease-out),
    color var(--mochi-duration-fast) var(--mochi-ease-out);
}

.nav-item:hover {
  background: var(--mochi-bg-sunken);
  color: var(--mochi-ink);
}

.nav-item.on {
  background: var(--mochi-primary-soft);
  color: var(--mochi-ink);
  font-weight: var(--mochi-font-weight-bold);
}

.nav-item:focus-visible {
  outline: none;
  box-shadow: var(--mochi-focus-ring);
}

.theme-btn {
  margin-top: auto;
}

/* ---------- 内容区 ---------- */
.stage {
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  padding: var(--mochi-space-8) var(--mochi-space-6) var(--mochi-space-8);
  box-sizing: border-box;
}

.head {
  margin-bottom: var(--mochi-space-6);
}

.head h1 {
  margin: 0;
  font-size: 28px;
  font-weight: var(--mochi-font-weight-bold);
  letter-spacing: -0.5px;
}

.head p {
  margin: var(--mochi-space-1) 0 0;
  color: var(--mochi-ink-soft);
  font-size: var(--mochi-font-size-sm);
}

.spec {
  display: flex;
  flex-direction: column;
  gap: var(--mochi-space-4);
}

.surface {
  display: flex;
  flex-direction: column;
  gap: var(--mochi-space-4);
  padding: var(--mochi-space-6);
  border: var(--mochi-border-hairline) solid var(--mochi-line);
  border-radius: var(--mochi-radius-lg);
  background: var(--mochi-surface);
  box-shadow: var(--mochi-shadow-soft);
}

.block {
  width: 100%;
}

.row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--mochi-space-3);
}

.form {
  gap: var(--mochi-space-4);
}

.dialog {
  gap: var(--mochi-space-4);
}

.left {
  align-self: flex-start;
  margin-left: var(--mochi-space-4);
}

.right {
  align-self: flex-end;
  margin-right: var(--mochi-space-4);
}

.swatches {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--mochi-space-2);
}

.swatch {
  margin: 0;
  padding: var(--mochi-space-2);
  border: var(--mochi-border-hairline) solid var(--mochi-line);
  border-radius: var(--mochi-radius-sm);
  background: var(--mochi-bg);
}

.chip {
  height: 40px;
  border-radius: var(--mochi-radius-xs);
  border: var(--mochi-border-hairline) solid var(--mochi-line);
}

figcaption {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-top: var(--mochi-space-1);
  color: var(--mochi-ink-soft);
}

code {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 11px;
}

@media (max-width: 760px) {
  .shell {
    grid-template-columns: 1fr;
  }

  .rail {
    position: static;
    height: auto;
    border-right: 0;
    border-bottom: var(--mochi-border-hairline) solid var(--mochi-line);
  }

  .nav {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
