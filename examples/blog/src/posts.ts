export interface LocalizedPost {
  title: string;
  tags: string[];
  excerpt: string;
  paragraphs: string[];
}

export interface BlogPost {
  key: string;
  date: string;
  zh: LocalizedPost;
  en: LocalizedPost;
}

export const posts: BlogPost[] = [
  {
    key: 'design-tokens',
    date: '2026-10-24',
    zh: {
      title: '设计令牌是组件库的 API',
      tags: ['设计系统', '令牌'],
      excerpt: '把颜色、间距、圆角全部变成 CSS 自定义属性，运行时换肤就不再是"重构"，而是改几个变量。',
      paragraphs: [
        'Mochi 的第一个决定：不把主题写在组件里。组件只认 var(--mochi-*)，令牌表是唯一的主题来源。',
        '这样做的回报是：applyTheme() 五个变量就能把整个站点从蜜桃橘换成薄荷绿，按钮、开关、进度环全部跟随。',
        '代价是纪律——组件里不允许出现任何裸色值。需要介于两个令牌之间的颜色时，用 color-mix() 现场派生。',
      ],
    },
    en: {
      title: 'Design tokens are the component library API',
      tags: ['Design system', 'Tokens'],
      excerpt: 'Turn colors, spacing and radii into CSS custom properties — runtime theming stops being a refactor and becomes a few variables.',
      paragraphs: [
        'The first decision in Mochi: keep the theme out of the components. Components only understand var(--mochi-*); the token sheet is the single source of theme.',
        'The payoff: applyTheme() with five variables switches the whole site from peach to mint — buttons, switches and progress rings all follow.',
        'The cost is discipline — no bare color values inside components. When you need something between two tokens, derive it with color-mix().',
      ],
    },
  },
  {
    key: 'animation-signature',
    date: '2026-10-22',
    zh: {
      title: '按下比松手快：一套动效签名',
      tags: ['动效', '细节'],
      excerpt: '按下 90ms、松手 220ms，位移量等于台阶高度——动效的"手感"一半藏在这些数字里。',
      paragraphs: [
        '卡通感的界面不怕夸张，怕的是不统一。按钮、分页、加载更多共用同一套台阶物理：hover 抬 1px，active 塌到阴影消失。',
        '列表类动效只用两条曲线：进场 spring（带一点过冲），离场 ease-in（快走不拖泥带水）。',
        '最后一条纪律：prefers-reduced-motion 下全部降级，但保留状态反馈——动画可以没有，信息不能丢。',
      ],
    },
    en: {
      title: 'Press faster than release: a motion signature',
      tags: ['Motion', 'Details'],
      excerpt: '90ms to press, 220ms to release, travel equal to the step height — half of the "feel" hides in these numbers.',
      paragraphs: [
        'Cartoonish UIs are not afraid of exaggeration, only of inconsistency. Buttons, pagination and load-more share the same step physics: hover lifts 1px, active sinks until the shadow vanishes.',
        'List motion uses exactly two curves: a spring on enter (a little overshoot), ease-in on leave (leave fast, never linger).',
        'The last rule: everything degrades under prefers-reduced-motion, but state feedback stays — animation is optional, information is not.',
      ],
    },
  },
  {
    key: 'platform-first',
    date: '2026-10-18',
    zh: {
      title: '能交给平台就别自己写',
      tags: ['工程', '取舍'],
      excerpt: 'Slider 用透明 range、Collapse 用 details、兑换码的 UTF-8 用 TextEncoder——三次省下的自研逻辑够写三篇博客。',
      paragraphs: [
        '自绘控件的所有权是全方位的：键盘、读屏、触摸、IME，每一个都是长期的维护成本。',
        '平台已经把这些做对的场合，包一层皮就够了。真正需要自己写的，只有"长相不可控"和"平台做错"的部分。',
        '判断标准只有一条：这个决定错了之后，修复成本是改一行 CSS，还是重写一套交互？',
      ],
    },
    en: {
      title: 'Delegate to the platform whenever it can',
      tags: ['Engineering', 'Trade-offs'],
      excerpt: 'Slider on a transparent range, Collapse on details, UTF-8 for the code input via TextEncoder — three saved rewrites worth three blog posts.',
      paragraphs: [
        'Owning a custom control is a full-time job: keyboard, screen readers, touch, IME — each is long-term maintenance.',
        'Where the platform already got it right, wrapping it in a skin is enough. Only "the look is uncontrollable" or "the platform got it wrong" justifies hand-rolling.',
        'One test: if this decision is wrong, is the fix a one-line CSS change or a rewritten interaction?',
      ],
    },
  },
  {
    key: 'blog-template',
    date: '2026-10-14',
    zh: {
      title: '用 74 个组件搭一个博客',
      tags: ['组件库', '示例'],
      excerpt: '这篇博客本身就是模板：Banner 做公告，Timeline 做归档，LoadMore 做翻页，DialogBubble 负责打招呼。',
      paragraphs: [
        '组件库的最终检验不是测试覆盖率，而是"能不能用它快速搭出一个真实页面"。',
        '这个模板展示了组合方式：侧栏用 Panel 与 Tag 做分类，页脚用 Kbd 标注快捷键，阅读页用 BackTop 收尾。',
        '把这份代码复制走，换掉文案与数据，就是一座新的岛。',
      ],
    },
    en: {
      title: 'Building a blog from 74 components',
      tags: ['Components', 'Example'],
      excerpt: 'This blog is the template itself: Banner for notices, Timeline for the archive, LoadMore for paging, DialogBubble for greetings.',
      paragraphs: [
        'The final test of a component library is not coverage — it is whether you can assemble a real page with it quickly.',
        'This template demonstrates the composition: Panel and Tag for the sidebar categories, Kbd for shortcuts in the footer, BackTop to finish a reading session.',
        'Copy the code, replace the copy and data, and you have a new island.',
      ],
    },
  },
];

export const archive: Array<{ date: string; key: string; title: { zh: string; en: string } }> = posts.map((post) => ({
  date: post.date,
  key: post.key,
  title: { zh: post.zh.title, en: post.en.title },
}));
