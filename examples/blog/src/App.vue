<script setup lang="ts">
import { computed, ref, watch } from 'vue';
// 模板示例：显式引入组件（也可以配 unplugin-vue-components 自动按需）
import {
  MochiAvatar,
  MochiBackTop,
  MochiBanner,
  MochiButton,
  MochiDialogBubble,
  MochiDivider,
  MochiKbd,
  MochiList,
  MochiLoadMore,
  MochiPanel,
  MochiProgressRing,
  MochiSegmented,
  MochiStatistic,
  MochiTag,
  MochiTimeline,
} from 'mochi-island-ui';
import { archive, posts, type BlogPost } from './posts';
import { locale, localeOptions, setLocale, useT, type Locale } from './i18n';

/* ---------- 极简 hash 路由：#/post/<key> 是文章页，#/archive 归档，其余列表页 ---------- */
const route = ref(window.location.hash);
window.addEventListener('hashchange', () => {
  route.value = window.location.hash;
  window.scrollTo({ top: 0 });
});
const currentPost = computed<BlogPost | null>(() => {
  const match = /^#\/post\/(.+)$/.exec(route.value);
  return match ? (posts.find((post) => post.key === match[1]) ?? null) : null;
});

const t = useT();

// 文章本地化视图：语言切换时 key 不变、内容随之切换
const localized = computed(() => posts.map((post) => ({ ...post, ...post[locale.value as Locale] })));
const currentLocalized = computed(() =>
  currentPost.value ? (currentPost.value[locale.value as Locale] ?? currentPost.value.zh) : null,
);

// 上下篇（按 posts 声明顺序）
const postIndex = computed(() => (currentPost.value ? posts.findIndex((p) => p.key === currentPost.value!.key) : -1));
const prevPost = computed(() => (postIndex.value > 0 ? posts[postIndex.value - 1] : null));
const nextPost = computed(() => (postIndex.value >= 0 && postIndex.value < posts.length - 1 ? posts[postIndex.value + 1] : null));

/* ---------- 列表：LoadMore 分页 + 标签筛选 ---------- */
const visibleCount = ref(3);
const loadStatus = ref<'idle' | 'loading' | 'done'>('idle');
const visiblePosts = computed(() => localized.value.slice(0, visibleCount.value));
function loadMore() {
  loadStatus.value = 'loading';
  setTimeout(() => {
    visibleCount.value = localized.value.length;
    loadStatus.value = 'done';
  }, 900);
}

const allTags = computed(() => [...new Set(localized.value.flatMap((post) => post.tags))]);
const activeTag = ref('');
const filteredPosts = computed(() =>
  activeTag.value ? visiblePosts.value.filter((post) => post.tags.includes(activeTag.value)) : visiblePosts.value,
);
function toggleTag(tag: string) {
  activeTag.value = activeTag.value === tag ? '' : tag;
}

const bannerOpen = ref(true);
function goPost(key: string) {
  window.location.hash = key ? `#/post/${key}` : '#/';
}

// 语言或路由变化时同步标签页标题
watch([locale, route, currentPost], () => {
  const site = t.value.siteName;
  document.title = currentLocalized.value
    ? `${currentLocalized.value.title} · ${site}`
    : `${t.value.navHome} · ${site}`;
}, { immediate: true });
</script>

<template>
  <div :class="css.page">
    <!-- 全站公告：吸顶横幅，关闭时高度收起 -->
    <MochiBanner v-model:open="bannerOpen" tone="success" :title="t.bannerTitle" sticky>
      {{ t.bannerText }}
    </MochiBanner>

    <header :class="css.header">
      <span :class="css.brand"><i :class="css.dot" />{{ t.siteName }}</span>
      <nav :class="css.nav">
        <a :class="css.navLink" href="#/" :data-active="route !== '#/archive' && !currentPost || undefined">{{ t.navHome }}</a>
        <a :class="css.navLink" href="#/archive" :data-active="route === '#/archive' || undefined">{{ t.navArchive }}</a>
        <MochiSegmented
          :model-value="locale"
          :options="localeOptions"
          :label="t.langLabel"
          size="sm"
          @update:model-value="setLocale($event as Locale)"
        />
      </nav>
    </header>

    <!-- 文章页 -->
    <main v-if="currentPost && currentLocalized" :class="css.post">
      <MochiButton size="sm" variant="ghost" @click="goPost('')">{{ t.backToList }}</MochiButton>
      <h1 :class="css.postTitle">{{ currentLocalized.title }}</h1>
      <p :class="css.meta">
        <MochiTag v-for="tag in currentLocalized.tags" :key="tag" tone="accent">{{ tag }}</MochiTag>
        <span :class="css.date">{{ currentPost.date }}</span>
      </p>
      <MochiDivider />
      <p v-for="(para, i) in currentLocalized.paragraphs" :key="i" :class="css.para">{{ para }}</p>
      <MochiDivider :label="t.continueReading" />
      <MochiList divided>
        <li v-for="other in localized.filter((p) => p.key !== currentPost?.key)" :key="other.key">
          <a :class="css.readNext" :href="`#/post/${other.key}`">{{ other.title }}</a>
        </li>
      </MochiList>
      <p :class="css.pager">
        <MochiButton v-if="prevPost" size="sm" variant="soft" @click="goPost(prevPost.key)">
          {{ t.prevPost }}：{{ prevPost[locale].title }}
        </MochiButton>
        <MochiButton v-if="nextPost" size="sm" variant="soft" @click="goPost(nextPost.key)">
          {{ t.nextPost }}：{{ nextPost[locale].title }}
        </MochiButton>
      </p>
    </main>

    <!-- 归档页 -->
    <main v-else-if="route === '#/archive'" :class="css.home">
      <MochiPanel :title="t.panelArchive">
        <MochiTimeline :items="archive.map((a) => ({ title: a.title[locale], time: a.date }))" />
      </MochiPanel>
    </main>

    <!-- 列表页 -->
    <main v-else :class="css.home">
      <MochiPanel class="block">
        <template #header>
          <h2 :class="css.listTitle">{{ t.latest }}</h2>
          <div :class="css.tagRow">
            <MochiTag
              v-for="tag in allTags"
              :key="tag"
              :data-active="activeTag === tag || undefined"
              :class="css.filterTag"
              @click="toggleTag(tag)"
            >
              {{ tag }}
            </MochiTag>
          </div>
        </template>

        <article v-for="post in filteredPosts" :key="post.key" :class="css.card" @click="goPost(post.key)">
          <h3 :class="css.cardTitle">{{ post.title }}</h3>
          <p :class="css.excerpt">{{ post.excerpt }}</p>
          <p :class="css.meta">
            <MochiTag v-for="tag in post.tags" :key="tag" tone="accent">{{ tag }}</MochiTag>
            <span :class="css.date">{{ post.date }}</span>
          </p>
        </article>

        <MochiLoadMore
          :status="loadStatus"
          :idle-text="t.loadMore"
          :loading-text="t.loading"
          :done-text="t.noMore"
          @more="loadMore"
        />
      </MochiPanel>

      <!-- 侧栏：打招呼、统计、归档 -->
      <aside :class="css.side">
        <MochiPanel class="block">
          <div :class="css.profile">
            <MochiAvatar name="Guru" size="lg" />
            <div>
              <strong>咕噜 / Guru</strong>
              <p :class="css.profileText">{{ t.profileRole }}</p>
            </div>
          </div>
          <MochiDialogBubble placement="right" :text="t.greeting" />
        </MochiPanel>

        <MochiPanel :title="locale === 'zh' ? '岛上数据' : 'Isle stats'">
          <div :class="css.stats">
            <MochiStatistic :title="t.statsPosts" :value="posts.length" :suffix="t.postsUnit" />
            <MochiStatistic :title="t.statsTags" :value="allTags.length" :suffix="t.tagsUnit" />
            <MochiProgressRing :value="72" :size="72" :label="t.writing" />
          </div>
        </MochiPanel>

        <MochiPanel :title="t.panelArchive">
          <MochiList divided>
            <li v-for="item in archive.slice(0, 3)" :key="item.key">
              <a :class="css.readNext" :href="`#/post/${item.key}`">{{ item.title[locale] }}</a>
            </li>
          </MochiList>
        </MochiPanel>
      </aside>
    </main>

    <footer :class="css.footer">
      <span>{{ t.builtWith }} <MochiKbd>mochi-island-ui</MochiKbd> {{ t.footer }}</span>
    </footer>

    <MochiBackTop />
  </div>
</template>

<style module="css">
.page {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 16px 32px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--mochi-bg);
  color: var(--mochi-ink);
  font-family: var(--mochi-font-family);
  font-size: var(--mochi-font-size-base);
  line-height: var(--mochi-line-height);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 20px 0;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: var(--mochi-font-size-lg);
  font-weight: var(--mochi-font-weight-bold);
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
  align-items: center;
  gap: 16px;
}

.navLink {
  color: var(--mochi-ink-soft);
  text-decoration: none;
  font-weight: var(--mochi-font-weight-bold);
}

.navLink[data-active],
.navLink:hover {
  color: var(--mochi-primary-deep);
}

.home {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 24px;
  align-items: start;
}

.side {
  display: grid;
  gap: 16px;
}

.block {
  width: 100%;
}

.listTitle {
  margin: 0;
  font-size: var(--mochi-font-size-lg);
}

.tagRow {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filterTag {
  cursor: pointer;
}

.filterTag[data-active] {
  background: var(--mochi-primary);
  color: var(--mochi-on-primary);
}

.card {
  padding: 16px 0;
  border-bottom: 1px solid var(--mochi-line);
  cursor: pointer;
}

.card:hover .cardTitle {
  color: var(--mochi-primary-deep);
}

.cardTitle {
  margin: 0 0 8px;
  font-size: var(--mochi-font-size-lg);
  transition: color var(--mochi-duration-fast) var(--mochi-ease-out);
}

.excerpt {
  margin: 0 0 8px;
  color: var(--mochi-ink-soft);
  font-size: var(--mochi-font-size-sm);
}

.meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  flex-wrap: wrap;
}

.date {
  color: var(--mochi-ink-soft);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}

.post {
  max-width: 720px;
  margin: 0 auto;
  width: 100%;
}

.postTitle {
  margin: 16px 0 8px;
  font-size: 28px;
  line-height: 1.3;
}

.para {
  margin: 0 0 16px;
  font-size: var(--mochi-font-size-base);
}

.readNext {
  color: var(--mochi-ink);
  text-decoration: none;
}

.readNext:hover {
  color: var(--mochi-primary-deep);
}

.pager {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin: 16px 0 0;
}

.profile {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.profileText {
  margin: 0;
  color: var(--mochi-ink-soft);
  font-size: var(--mochi-font-size-sm);
}

.stats {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
}

.footer {
  margin-top: auto;
  padding: 24px 0 8px;
  color: var(--mochi-ink-soft);
  font-size: var(--mochi-font-size-sm);
  text-align: center;
}

@media (max-width: 720px) {
  .home {
    grid-template-columns: 1fr;
  }
}
</style>
