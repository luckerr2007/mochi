<script setup lang="ts">
import { computed, ref } from 'vue';
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
  MochiStatistic,
  MochiTag,
  MochiTimeline,
} from 'mochi-island-ui';
import { archive, posts, type BlogPost } from './posts';

/* ---------- 极简 hash 路由：#/post/<key> 是文章页，其余是列表页 ---------- */
const route = ref(window.location.hash);
window.addEventListener('hashchange', () => {
  route.value = window.location.hash;
  window.scrollTo({ top: 0 });
});
const currentPost = computed<BlogPost | null>(() => {
  const match = /^#\/post\/(.+)$/.exec(route.value);
  return match ? (posts.find((post) => post.key === match[1]) ?? null) : null;
});

/* ---------- 列表：LoadMore 分页 ---------- */
const visibleCount = ref(3);
const loadStatus = ref<'idle' | 'loading' | 'done'>('idle');
const visiblePosts = computed(() => posts.slice(0, visibleCount.value));
function loadMore() {
  loadStatus.value = 'loading';
  setTimeout(() => {
    visibleCount.value = posts.length;
    loadStatus.value = 'done';
  }, 900);
}

const allTags = [...new Set(posts.flatMap((post) => post.tags))];
const activeTag = ref('');
const filteredPosts = computed(() =>
  activeTag.value ? visiblePosts.value.filter((post) => post.tags.includes(activeTag.value)) : visiblePosts.value,
);
function toggleTag(tag: string) {
  activeTag.value = activeTag.value === tag ? '' : tag;
}

const bannerOpen = ref(true);
function goPost(key: string) {
  window.location.hash = `#/post/${key}`;
}
</script>

<template>
  <div :class="css.page">
    <!-- 全站公告：吸顶横幅，关闭时高度收起 -->
    <MochiBanner v-model:open="bannerOpen" tone="success" title="岛屿公告" sticky>
      博客模板已用 Mochi 组件搭建完成，欢迎按 <MochiKbd>⌘K</MochiKbd> 的思路定制自己的岛。
    </MochiBanner>

    <header :class="css.header">
      <span :class="css.brand"><i :class="css.dot" />薄荷岛日报</span>
      <nav :class="css.nav">
        <a :class="css.navLink" href="#/">首页</a>
        <a :class="css.navLink" href="#/archive" :data-active="route === '#/archive' || undefined">归档</a>
      </nav>
    </header>

    <!-- 文章页 -->
    <main v-if="currentPost" :class="css.post">
      <MochiButton size="sm" variant="ghost" @click="goPost('')">← 回列表</MochiButton>
      <h1 :class="css.postTitle">{{ currentPost.title }}</h1>
      <p :class="css.meta">
        <MochiTag v-for="tag in currentPost.tags" :key="tag" tone="accent">{{ tag }}</MochiTag>
        <span :class="css.date">{{ currentPost.date }}</span>
      </p>
      <MochiDivider />
      <p v-for="(para, i) in currentPost.paragraphs" :key="i" :class="css.para">{{ para }}</p>
      <MochiDivider label="继续逛" />
      <MochiList divided>
        <li v-for="other in posts.filter((p) => p.key !== currentPost.key)" :key="other.key">
          <a :class="css.readNext" :href="`#/post/${other.key}`">{{ other.title }}</a>
        </li>
      </MochiList>
    </main>

    <!-- 归档页 -->
    <main v-else-if="route === '#/archive'" :class="css.home">
      <MochiPanel title="归档">
        <MochiTimeline
          :items="archive.map((a) => ({ title: a.title, time: a.date }))"
        />
      </MochiPanel>
    </main>

    <!-- 列表页 -->
    <main v-else :class="css.home">
      <MochiPanel title="最新文章" class="block">
        <template #header>
          <h2 :class="css.listTitle">最新文章</h2>
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

        <MochiLoadMore :status="loadStatus" @more="loadMore" />
      </MochiPanel>

      <!-- 侧栏：打招呼、统计、归档 -->
      <aside :class="css.side">
        <MochiPanel class="block">
          <div :class="css.profile">
            <MochiAvatar name="咕噜" size="lg" />
            <div>
              <strong>咕噜</strong>
              <p :class="css.profileText">岛龄 3 年 · 每周更新</p>
            </div>
          </div>
          <MochiDialogBubble placement="right" text="今天的博客也很热闹，随便逛逛吧！" />
        </MochiPanel>

        <MochiPanel title="岛上数据">
          <div :class="css.stats">
            <MochiStatistic title="文章" :value="posts.length" suffix="篇" />
            <MochiStatistic title="标签" :value="allTags.length" suffix="个" />
            <MochiProgressRing :value="72" :size="72" label="写作进度" />
          </div>
        </MochiPanel>

        <MochiPanel title="归档">
          <MochiList divided>
            <li v-for="item in archive.slice(0, 3)" :key="item.key">
              <a :class="css.readNext" :href="`#/post/${item.key}`">{{ item.title }}</a>
            </li>
          </MochiList>
        </MochiPanel>
      </aside>
    </main>

    <footer :class="css.footer">
      <span>用 <MochiKbd>mochi-island-ui</MochiKbd> 搭建 · 薄荷岛日报</span>
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
  font-size: var(--mochi-font-size-lg);
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
