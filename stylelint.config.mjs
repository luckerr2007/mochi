export default {
  extends: ['stylelint-config-standard'],
  rules: {
    // 仓库既有惯例：CSS Modules 用 .root.root / .list.list 双类叠加提权压过文档站样式
    'no-duplicate-selectors': null,
    // 令牌/私有变量：--mochi-* 与组件内 --_i、--sider-w 这类私有变量
    'custom-property-pattern': null,
    // 折叠态/状态由 data 属性驱动，类名 kebab-case 即可
    'selector-class-pattern': null,
    // @media (prefers-reduced-motion: reduce) 内写 transition: none 是有意为之
    'declaration-block-no-duplicate-properties': null,
    'comment-empty-line-before': null,
    'no-descending-specificity': null,
    // 仓库既有惯例：keyframes 驼峰命名（popIn/fileIn/panelIn…），颜色用传统记法
    'keyframes-name-pattern': null,
    // 媒体查询记法交给 Prettier（它统一成 range 记法，两条规则别打架）
    'media-feature-range-notation': null,
    'color-function-notation': null,
    'color-function-alias-notation': null,
    'alpha-value-notation': null,
  },
  ignoreFiles: ['**/dist/**', '**/node_modules/**', '**/.vitepress/**'],
}
