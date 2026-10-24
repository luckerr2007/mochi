---
layout: home

hero:
  name: Mochi
  text: 会呼吸的卡通组件库
  tagline: 设计令牌全部是 CSS 自定义属性——不改源码就能运行时换肤
  actions:
    - theme: brand
      text: 开始使用
      link: /guide/installation
    - theme: alt
      text: 浏览组件
      link: /components/button
    - theme: alt
      text: 博客模板示例
      link: https://mochi.liveroom.dpdns.org/blog/

features:
  - title: 令牌即 API
    details: 全部 --mochi-* 变量声明在 :root，组件只用 var() 取值。覆盖变量即可换肤，连文档站本身都能一起变。
  - title: 动效有签名
    details: 弹簧曲线、按下位移、错峰入场。参数全部暴露为令牌，可整体调慢或关掉。
  - title: 尊重系统偏好
    details: prefers-reduced-motion 下移除过渡与悬浮，保留状态反馈；焦点环双层，在按钮描边上也看得见。
  - title: 有现成的博客模板
    details: 用这套组件搭好的双语博客示例——Banner、归档 Timeline、LoadMore 分页、侧栏数据面板，直接换文案就能用。
---

## 看一眼

<div class="demo demo-col">
  <div class="demo">
    <MochiButton>主要操作</MochiButton>
    <MochiButton variant="soft">次级操作</MochiButton>
    <MochiButton variant="ghost">幽灵按钮</MochiButton>
  </div>
  <MochiDialogBubble placement="left" text="今天的胡萝卜收成不错，要不要一起去广场看看？" />
  <MochiPanel title="面板">
    header / body / footer 三段 anatomy，三层柔和边框。
    <template #footer>
      <MochiTag tone="candy">糖果色</MochiTag>
      <MochiTag tone="accent">薄荷</MochiTag>
    </template>
  </MochiPanel>
</div>

上面每个组件都没有写 import——文档站用同一套 `unplugin-vue-components` 解析器注册的。

## 博客模板

这份文档站的组件在 [博客模板示例](https://mochi.liveroom.dpdns.org/blog/) 里被搭成了一个完整的双语博客——
首页（公告横幅、标签筛选、加载更多、侧栏数据面板）、文章页与归档页（hash 路由）、中英文一键切换。
模板源码在仓库的 `examples/blog/`，复制走换掉数据就是自己的岛。
