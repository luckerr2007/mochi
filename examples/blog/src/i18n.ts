import { computed, ref } from 'vue';

export type Locale = 'zh' | 'en';

const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('blog-locale') : null;
export const locale = ref<Locale>(saved === 'en' || saved === 'zh' ? saved : 'zh');

export function setLocale(next: Locale) {
  locale.value = next;
  localStorage.setItem('blog-locale', next);
}

export const localeOptions = [
  { label: '中文', value: 'zh' as const },
  { label: 'EN', value: 'en' as const },
];

const messages = {
  zh: {
    siteName: '薄荷岛日报',
    navHome: '首页',
    navArchive: '归档',
    bannerTitle: '岛屿公告',
    bannerText: '博客模板已用 Mochi 组件搭建完成，欢迎按 ⌘K 的思路定制自己的岛。',
    latest: '最新文章',
    readMore: '继续阅读',
    loadMore: '加载更多',
    loading: '加载中…',
    noMore: '没有更多了',
    postsUnit: '篇',
    tagsUnit: '个',
    statsPosts: '文章',
    statsTags: '标签',
    writing: '写作进度',
    panelArchive: '归档',
    profileRole: '岛龄 3 年 · 每周更新',
    greeting: '今天的博客也很热闹，随便逛逛吧！',
    backToList: '← 回列表',
    continueReading: '继续逛',
    prevPost: '上一篇',
    nextPost: '下一篇',
    footer: '搭建 · 薄荷岛日报',
    builtWith: '用',
    langLabel: '语言',
  },
  en: {
    siteName: 'Mint Isle Daily',
    navHome: 'Home',
    navArchive: 'Archive',
    bannerTitle: 'Island notice',
    bannerText: 'This blog template is built with Mochi components — customize your own island the ⌘K way.',
    latest: 'Latest posts',
    readMore: 'Continue reading',
    loadMore: 'Load more',
    loading: 'Loading…',
    noMore: 'No more posts',
    postsUnit: 'posts',
    tagsUnit: 'tags',
    statsPosts: 'Posts',
    statsTags: 'Tags',
    writing: 'Writing progress',
    panelArchive: 'Archive',
    profileRole: '3 years on the isle · weekly updates',
    greeting: 'The blog is bustling today — look around!',
    backToList: '← Back to posts',
    continueReading: 'Keep reading',
    prevPost: 'Previous',
    nextPost: 'Next',
    footer: 'built · Mint Isle Daily',
    builtWith: 'Built with',
    langLabel: 'Language',
  },
} as const;

export type LocaleKey = Locale;

export function useT() {
  return computed(() => messages[locale.value]);
}
