# 自定义组件指南

Mochi 的设计令牌全部是 CSS 自定义属性——**你也可以用同一套语言写自己的组件**，
让它们和库内组件看起来出自同一个岛。这篇讲规则、步骤和必须避开的坑。

## 三条硬规则

1. **颜色、间距、圆角、阴影、时长只写 `var(--mochi-*)`**。
   在两个令牌之间取值用 `color-mix()`，不要写十六进制；
   间距必须是 4px 的整数倍（`--mochi-space-*`），控件高度用 `--mochi-control-sm|md|lg`。
2. **焦点一律 `box-shadow: var(--mochi-focus-ring)`**，不要用浏览器默认 outline。
3. **动效只用令牌里的曲线与时长**（`--mochi-spring` / `--mochi-ease-out` / `--mochi-duration-*`），
   并且写 `prefers-reduced-motion: reduce` 降级。

## 两个官方踩过的血坑

- **CSS Modules 只哈希类名**。属性选择器（`[data-tone='x']`）和元素选择器（`ul`、`h3`）
  都是**全局规则**——Badge 曾用裸 `[data-tone]` 给组件染色，结果页面上所有带该属性的
  元素一起被染；文档站这类富样式宿主还会用元素选择器（`.vp-doc ul`、`.vp-doc p`）
  污染你的组件。**组件的每个样式都必须挂在组件自己的类上**。
- **`defineModel` 用数组类型时不要给 default**（类型会退化），用 computed get/set 代理兜底。

## 最小示例：一张优惠券

```vue
<script setup lang="ts">
import css from './Voucher.module.css';

withDefaults(defineProps<{ title: string; point: number }>(), { point: 0 });
</script>

<template>
  <div :class="css.root">
    <span :class="css.point">{{ point }}<i>铃</i></span>
    <span :class="css.title">{{ title }}</span>
  </div>
</template>
```

```css
/* Voucher.module.css —— 每条规则都挂在组件自己的类上 */
.root {
  display: inline-flex;
  align-items: center;
  gap: var(--mochi-space-3);
  padding: var(--mochi-space-3) var(--mochi-space-4);
  border: var(--mochi-border-hairline) dashed var(--mochi-primary-deep);
  border-radius: var(--mochi-radius-md);
  background: color-mix(in srgb, var(--mochi-primary-soft) 60%, var(--mochi-surface));
  box-shadow: 0 2px 0 0 var(--mochi-shadow-press-color);
  color: var(--mochi-ink);
  font-family: var(--mochi-font-family);
}

.point {
  font-size: var(--mochi-font-size-lg);
  font-weight: var(--mochi-font-weight-bold);
  color: var(--mochi-primary-deep);
  font-variant-numeric: tabular-nums;
}

.point i {
  margin-left: 1px;
  font-style: normal;
  font-size: var(--mochi-font-size-sm);
  color: var(--mochi-ink-soft);
}

.title {
  font-size: var(--mochi-font-size-base);
}

@media (prefers-reduced-motion: reduce) {
  .root { transition: none; }
}
```

## 接入方式

- **按需自动引入**：把你的组件目录也交给 `unplugin-vue-components`（`dirs` 配置指向你的目录），
  或干脆在自己的页面里 import。
- **主题联动**：只要色彩都走令牌，`applyTheme()` 换肤时你的组件会**跟着一起换**——
  这是不写死任何颜色值的全部回报。
- **发布**：如果你的组件想进 Mochi 本体，按 `packages/mochi-island-ui/src/components/<name>/` 的
  目录结构（`MochiX.vue` + `MochiX.module.css` + `types.ts` + `index.ts`）提交，
  并在 `src/resolver.ts` 登记。

## 检查清单

- [ ] 没有裸色值 / 裸 px 间距（圆角描边等 1-2px 结构值除外）
- [ ] 焦点环、按压位移（`--mochi-shadow-offset`）与库内组件一致
- [ ] 交互动效都来自令牌曲线，且有 reduced-motion 降级
- [ ] 无属性/元素选择器裸规则，所有样式挂在组件类上
- [ ] 表单类组件带正确的 ARIA（label 关联、`aria-invalid`、role）
