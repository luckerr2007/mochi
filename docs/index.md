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

features:
  - title: 令牌即 API
    details: 全部 --mochi-* 变量声明在 :root，组件只用 var() 取值。覆盖变量即可换肤，连文档站本身都能一起变。
  - title: 动效有签名
    details: 弹簧曲线、按下位移、错峰入场。参数全部暴露为令牌，可整体调慢或关掉。
  - title: 尊重系统偏好
    details: prefers-reduced-motion 下移除过渡与悬浮，保留状态反馈；焦点环双层，在按钮描边上也看得见。
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
