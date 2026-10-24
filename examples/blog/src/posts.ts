export interface BlogPost {
  key: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  paragraphs: string[];
}

export const posts: BlogPost[] = [
  {
    key: 'design-tokens',
    title: '设计令牌是组件库的 API',
    date: '2026-10-24',
    tags: ['设计系统', '令牌'],
    excerpt: '把颜色、间距、圆角全部变成 CSS 自定义属性，运行时换肤就不再是"重构"，而是改几个变量。',
    paragraphs: [
      'Mochi 的第一个决定：不把主题写在组件里。组件只认 var(--mochi-*)，令牌表是唯一的主题来源。',
      '这样做的回报是：applyTheme() 五个变量就能把整个站点从蜜桃橘换成薄荷绿，按钮、开关、进度环全部跟随。',
      '代价是纪律——组件里不允许出现任何裸色值。需要介于两个令牌之间的颜色时，用 color-mix() 现场派生。',
    ],
  },
  {
    key: 'animation-signature',
    title: '按下比松手快：一套动效签名',
    date: '2026-10-22',
    tags: ['动效', '细节'],
    excerpt: '按下 90ms、松手 220ms，位移量等于台阶高度——动效的"手感"一半藏在这些数字里。',
    paragraphs: [
      '卡通感的界面不怕夸张，怕的是不统一。按钮、分页、加载更多共用同一套台阶物理：hover 抬 1px，active 塌到阴影消失。',
      '列表类动效只用两条曲线：进场 spring（带一点过冲），离场 ease-in（快走不拖泥带水）。',
      '最后一条纪律：prefers-reduced-motion 下全部降级，但保留状态反馈——动画可以没有，信息不能丢。',
    ],
  },
  {
    key: 'platform-first',
    title: '能交给平台就别自己写',
    date: '2026-10-18',
    tags: ['工程', '取舍'],
    excerpt: 'Slider 用透明 range、Collapse 用 details、兑换码的 UTF-8 用 TextEncoder——三次省下的自研逻辑够写三篇博客。',
    paragraphs: [
      '自绘控件的所有权是全方位的：键盘、读屏、触摸、IME，每一个都是长期的维护成本。',
      '平台已经把这些做对的场合，包一层皮就够了。真正需要自己写的，只有"长相不可控"和"平台做错"的部分。',
      '判断标准只有一条：这个决定错了之后，修复成本是改一行 CSS，还是重写一套交互？',
    ],
  },
  {
    key: 'blog-template',
    title: '用 74 个组件搭一个博客',
    date: '2026-10-14',
    tags: ['组件库', '示例'],
    excerpt: '这篇博客本身就是模板：Banner 做公告，Timeline 做归档，LoadMore 做翻页，DialogBubble 负责打招呼。',
    paragraphs: [
      '组件库的最终检验不是测试覆盖率，而是"能不能用它快速搭出一个真实页面"。',
      '这个模板展示了组合方式：侧栏用 Panel 与 Tag 做分类，页脚用 Kbd 标注快捷键，阅读页用 BackTop 收尾。',
      '把这份代码复制走，换掉文案与数据，就是一座新的岛。',
    ],
  },
];

export const archive = [
  { date: '2026-10', title: '令牌即 API：一次换肤实践', key: 'design-tokens' },
  { date: '2026-10', title: '动效签名与台阶物理', key: 'animation-signature' },
  { date: '2026-09', title: '平台优先的组件取舍', key: 'platform-first' },
  { date: '2026-09', title: '博客模板的组件清单', key: 'blog-template' },
];
