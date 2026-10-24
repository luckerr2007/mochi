# 设计令牌与换肤

Mochi 没有"主题配置对象"，主题就是一组 CSS 自定义属性。全部声明在 `:root`，组件只通过
`var(--mochi-*)` 取值——所以覆盖变量就等于换肤，不需要构建期编译，也不需要重新挂载组件。

## 亲手试一下

下面的按钮会把整站的令牌换成薄荷色（包括你现在看到的这一页）：

<div class="demo">
  <MochiButton @click="toggleTheme">{{ minted ? '还原蜜桃橘' : '整站切换到薄荷' }}</MochiButton>
  <MochiButton variant="soft">次级按钮</MochiButton>
  <MochiTag tone="accent">强调色不受影响</MochiTag>
</div>

<script setup>
import { onUnmounted, ref } from 'vue';
import { applyTheme } from 'mochi-island-ui';

const mintTheme = {
  '--mochi-primary': '#4fa89b',
  '--mochi-primary-deep': '#35786f',
  '--mochi-primary-soft': '#d9f2ee',
  '--mochi-on-primary': '#0f332e',
  '--mochi-shadow-press-color': '#b7d8d2',
};

const minted = ref(false);
let dispose = null;

function toggleTheme() {
  if (minted.value) {
    dispose?.();
    dispose = null;
    minted.value = false;
    return;
  }
  dispose = applyTheme(mintTheme);
  minted.value = true;
}

onUnmounted(() => dispose?.());
</script>

注意 `--mochi-accent` 没有被覆盖，所以标签仍然是薄荷绿——**只改你想改的那几个**，
其余自动继承。

## applyTheme

```ts
import { applyTheme } from 'mochi-island-ui';

const dispose = applyTheme({
  '--mochi-primary': '#4fa89b',
  '--mochi-primary-deep': '#35786f',
});

dispose(); // 还原到覆盖前的值
```

`applyTheme` 把覆盖值写到元素的行内 `style` 上，因此优先级高于 `:root`，且不污染样式表。
返回的还原函数会精确恢复每个被改过的变量。

### 局部换肤

第二个参数可以指定容器，只让某一块区域换肤：

```ts
applyTheme({ '--mochi-primary': '#7fc8c0' }, document.querySelector('.sidebar'));
```

因为令牌是 CSS 自定义属性，天然沿 DOM 继承——这是"运行时换肤"不需要任何组件配合的原因。

## 令牌清单

### 色彩

| 预览 | 令牌 | 默认值 | 用途 |
| --- | --- | --- | --- |
| <span class="tk" style="background:var(--mochi-primary)"></span> | `--mochi-primary` | `#f0875c` | 主按钮、选中态 |
| <span class="tk" style="background:var(--mochi-primary-deep)"></span> | `--mochi-primary-deep` | `#c2603c` | 3D 下沿、描边 |
| <span class="tk" style="background:var(--mochi-primary-soft)"></span> | `--mochi-primary-soft` | `#fde0d2` | 浅底、选中行 |
| <span class="tk" style="background:var(--mochi-on-primary)"></span> | `--mochi-on-primary` | `#43281a` | 主色之上的文字 |
| <span class="tk" style="background:var(--mochi-bg)"></span> | `--mochi-bg` | `#fdf6e9` | 页面底 |
| <span class="tk" style="background:var(--mochi-bg-sunken)"></span> | `--mochi-bg-sunken` | `#f3e7d4` | 凹陷区 |
| <span class="tk" style="background:var(--mochi-surface)"></span> | `--mochi-surface` | `#fffdf7` | 面板表面 |
| <span class="tk" style="background:var(--mochi-surface-sunken)"></span> | `--mochi-surface-sunken` | `#f8efe0` | 输入槽 |
| <span class="tk" style="background:var(--mochi-ink)"></span> | `--mochi-ink` | `#3d2f28` | 正文（深棕，非纯黑） |
| <span class="tk" style="background:var(--mochi-ink-soft)"></span> | `--mochi-ink-soft` | `#7a6455` | 次要文字、占位符 |
| <span class="tk" style="background:var(--mochi-line)"></span> | `--mochi-line` | `#e6d7c3` | 外层描边 |
| <span class="tk" style="background:var(--mochi-line-strong)"></span> | `--mochi-line-strong` | `#d3bda2` | 内层描边 |
| <span class="tk" style="background:var(--mochi-accent)"></span> | `--mochi-accent` | `#7fc8c0` | 可选强调（薄荷） |
| <span class="tk" style="background:var(--mochi-accent-candy)"></span> | `--mochi-accent-candy` | `#ff9fb8` | 可选强调（糖果粉） |
| <span class="tk" style="background:var(--mochi-danger)"></span> | `--mochi-danger` | `#bf4a46` | 错误态 |

### 圆角与间距

| 令牌 | 默认值 | 说明 |
| --- | --- | --- |
| `--mochi-radius-xs` | `8px` | 小方块（勾选框） |
| `--mochi-radius-sm` | `12px` | 小卡片、色块 |
| `--mochi-radius-md` | `16px` | 输入框、常规卡片 |
| `--mochi-radius-lg` | `20px` | 面板、气泡 |
| `--mochi-radius-full` | `999px` | 胶囊按钮、标签 |
| `--mochi-space-unit` | `4px` | 间距网格基数 |
| `--mochi-space-1/2/3/4/6/8` | `4 / 8 / 12 / 16 / 24 / 32px` | 网格整数倍 |

### 边框与阴影

| 令牌 | 默认值 | 说明 |
| --- | --- | --- |
| `--mochi-border-hairline` | `1px` | 细分隔线 |
| `--mochi-border-width` | `2px` | 控件主描边 |
| `--mochi-border-width-strong` | `3px` | 强调描边 |
| `--mochi-shadow-offset` | `4px` | 按下位移量 = 台阶高度 |
| `--mochi-shadow-color` | `rgba(61,47,40,.14)` | 氛围阴影色 |
| `--mochi-shadow-press-color` | `#dcc0a0` | 3D 台阶实色底 |
| `--mochi-shadow-soft` | `0 10px 28px -10px …` | 大气氛阴影 |
| `--mochi-shadow-press` | `0 4px 0 0 …` | 按钮立体台阶 |
| `--mochi-shadow-inset` | `inset 0 2px 0 rgba(…)` | 凹陷槽 |

### 动效

| 令牌 | 默认值 | 说明 |
| --- | --- | --- |
| `--mochi-spring` | `cubic-bezier(.34,1.56,.64,1)` | 回弹曲线，位移类都用它 |
| `--mochi-spring-soft` | `cubic-bezier(.22,1.12,.36,1)` | 大面积回弹（弹层、对话框），过冲更小 |
| `--mochi-ease-out` | `cubic-bezier(.22,1,.36,1)` | 淡入 |
| `--mochi-ease-in` | `cubic-bezier(.4,0,1,1)` | 离场，比入场快 |
| `--mochi-duration-press` | `90ms` | 按下瞬间：比松手更快，手感的一半在这 |
| `--mochi-duration-fast` | `120ms` | 颜色、图标 |
| `--mochi-duration-base` | `220ms` | 开关滑块、弹层 |
| `--mochi-duration-slow` | `420ms` | 面板入场 |
| `--mochi-stagger` | `60ms` | 列表错峰入场步长 |

### 字体与焦点

| 令牌 | 默认值 | 说明 |
| --- | --- | --- |
| `--mochi-font-family` | `Nunito, PingFang SC, …` | 全局字体栈 |
| `--mochi-font-size-sm/base/lg` | `13 / 15 / 18px` | 三档字号 |
| `--mochi-line-height` | `1.55` | 正文行高 |
| `--mochi-font-weight-normal/bold` | `500 / 800` | 两档字重 |
| `--mochi-focus-ring-color` | `#b4552f` | 焦点环颜色 |
| `--mochi-focus-ring` | `0 0 0 3px surface, 0 0 0 5px …` | 双层焦点环 |

## 对比度约束

`tokens.spec.ts` 里有一组对比度测试，锁死以下组合不低于 WCAG AA 的 4.5:1：

- `ink` / `bg`、`ink` / `surface`、`ink-soft` / `surface`
- `on-primary` / `primary`、`on-primary` / `primary-soft`

这也是 `--mochi-on-primary` 是深棕而不是奶油白的原因：白字压蜜桃橘只有 2.4:1。
换肤时如果改了 `--mochi-primary`，记得同时检查 `--mochi-on-primary` 的对比度。

<style>
.tk {
  display: inline-block;
  width: 40px;
  height: 18px;
  border: 1px solid var(--mochi-line);
  border-radius: 4px;
  vertical-align: middle;
}
</style>
