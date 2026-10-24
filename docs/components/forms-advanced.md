# 表单进阶：Form · InputNumber · Slider · Segmented

## MochiForm / MochiFormItem

<div class="demo" style="width: 100%">
  <MochiForm style="width: 100%" @submit="submitted = true">
    <MochiFormItem label="昵称" required :error="name ? '' : '昵称不能为空'">
      <MochiInput v-model="name" placeholder="给自己起个名字" />
    </MochiFormItem>
    <MochiFormItem label="岛屿人口" hint="1-10 人">
      <MochiInputNumber v-model="population" :min="1" :max="10" />
    </MochiFormItem>
    <MochiButton type="submit" size="sm">提交</MochiButton>
  </MochiForm>
</div>

<p v-if="submitted" style="color: var(--mochi-primary-deep); font-size: 13px">已提交（这里只演示事件）</p>

<script setup>
import { ref } from 'vue';
const name = ref('');
const population = ref(3);
const submitted = ref(false);
const count = ref(6);
const volume = ref(64);
const view = ref('grid');
const views = [
  { label: '网格', value: 'grid' },
  { label: '列表', value: 'list' },
  { label: '地图', value: 'map', disabled: true },
];
</script>

| 组件 | props |
| --- | --- |
| `MochiForm` | `layout: 'vertical' \| 'horizontal'`，`@submit` |
| `MochiFormItem` | `label` `error` `hint` `required`，作用域插槽给 `invalid` / `messageId` |

**FormItem 不接管校验**，只负责排版和错误文案的位置。为什么：校验规则属于业务，
塞进组件要么写一套规则引擎（重），要么只能做必填/长度这类表面检查（不够用）。
它把 `invalid` 通过作用域插槽递出来，你把同一个 `error` 同时喂给字段的 `invalid` 和
FormItem 的 `error`，两边就一致了。

## MochiInputNumber

<div class="demo">
  <MochiInputNumber v-model="count" :min="0" :max="99" label="数量" />
  <MochiInputNumber :model-value="20" disabled label="禁用" />
</div>

| props | 默认 | 说明 |
| --- | --- | --- |
| `min` / `max` | 无 | 越界会被夹住 |
| `step` | `1` | 加减步长 |
| `label` / `hint` / `disabled` / `invalid` | — | 与输入框一致 |

`↑` / `↓` 也能增减；输入框是 `inputmode="decimal"`，手机上直接起数字键盘。

## MochiSlider

<div class="demo demo-col" style="width: 100%">
  <MochiSlider v-model="volume" show-value label="音量" />
  <MochiSlider :model-value="30" disabled label="禁用" />
</div>

| props | 默认 | 说明 |
| --- | --- | --- |
| `min` / `max` / `step` | `0` / `100` / `1` | — |
| `showValue` | `false` | 右侧显示当前值 |

底层是**透明铺在最上层的原生 `range`**：拖拽、方向键、读屏、触摸全部免费，
外面那层轨道和滑块只负责长相。拖拽过程中关掉过渡（`:active`），否则滑块会"追不上手指"。

## MochiSegmented

<div class="demo">
  <MochiSegmented v-model="view" :options="views" label="视图" />
</div>

| props | 说明 |
| --- | --- |
| `options` | `{ label, value, disabled? }[]` |
| `label` | radiogroup 的无障碍名称 |

选中块是两个按钮之间**滑过去**的（和 Tabs 同一套测位逻辑），不是各自换底色。
`←` / `→` 切换，跳过禁用项。
