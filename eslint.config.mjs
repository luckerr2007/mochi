import pluginVue from 'eslint-plugin-vue'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default defineConfigWithVueTs(
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/.vitepress/{cache,cache-deps,dist,.temp}/**',
      '**/components.d.ts',
      '**/.run/**',
    ],
  },
  pluginVue.configs['flat/recommended'],
  vueTsConfigs.recommended,
  skipFormatting,
  {
    rules: {
      // 仓库既有惯例：组件名单段命名（Mochi 前缀）、CSS Modules 双类叠加提权
      'vue/multi-word-component-names': 'off',
      // Vue 3 可选 prop 不需要默认值（undefined 即合法默认），withDefaults 按需用
      'vue/require-default-prop': 'off',
      // 模板里绑定表达式带中文注释的复杂度可接受，不强制拆 computed
      'vue/max-attributes-per-line': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/html-self-closing': 'off',
      // ts：未显式类型的 props 由 withDefaults 推断，any 只出现在必要边界
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['**/*.{spec,test}.ts'],
    rules: {
      // 测试里挂载后读 DOM、wrapper 变量名可短
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
)
