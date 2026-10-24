<script setup lang="ts">
import { computed } from 'vue';
import qrcode from 'qrcode-generator';
import css from './MochiQRCode.module.css';
import { useMessages } from '../../locale';

defineOptions({ name: 'MochiQRCode' });

const m = useMessages();

const props = withDefaults(
  defineProps<{
    /** 编码进二维码的内容 */
    value: string;
    /** 边长（px） */
    size?: number;
    /** 纠错级别：L / M / Q / H，越高越抗遮挡、容量越小 */
    level?: 'L' | 'M' | 'Q' | 'H';
    /** 四周留白（模块数），扫码器需要静区 */
    margin?: number;
    /** 读屏朗读的描述，默认读内容本身 */
    label?: string;
  }>(),
  { size: 160, level: 'M', margin: 2, label: undefined },
);

// 默认编码按 charCode & 0xff 截断，中文会乱码；换成平台自带的 TextEncoder（UTF-8）
qrcode.stringToBytes = (s: string) => Array.from(new TextEncoder().encode(s));

/**
 * 版本号传 0 = 按内容长度自动选最小版本；内容超出容量时 make() 抛错，
 * 此时渲染占位而不是让组件崩溃。
 */
const matrix = computed(() => {
  const text = props.value;
  if (!text) return null;
  try {
    const qr = qrcode(0, props.level);
    qr.addData(text);
    qr.make();
    const count = qr.getModuleCount();
    const dark: boolean[] = [];
    for (let row = 0; row < count; row += 1) {
      for (let col = 0; col < count; col += 1) dark.push(qr.isDark(row, col));
    }
    return { count, dark };
  } catch {
    return null;
  }
});

/** key 含 value/level：内容变化时 SVG 重新挂载，入场动画重播 */
const matrixKey = computed(() => `${props.level}:${props.value}`);

const path = computed(() => {
  const data = matrix.value;
  if (!data) return '';
  const { count, dark } = data;
  let d = '';
  for (let row = 0; row < count; row += 1) {
    for (let col = 0; col < count; col += 1) {
      if (dark[row * count + col]) {
        d += `M${col + props.margin} ${row + props.margin}h1v1h-1z`;
      }
    }
  }
  return d;
});

const viewBox = computed(() => {
  const total = (matrix.value?.count ?? 0) + props.margin * 2;
  return `0 0 ${total} ${total}`;
});
</script>

<template>
  <div :class="css.root" role="img" :aria-label="label ?? m.qrLabel(value)">
    <svg
      v-if="matrix"
      :key="matrixKey"
      :class="css.code"
      :viewBox="viewBox"
      :style="{ width: `${size}px`, height: `${size}px` }"
      shape-rendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      <path :d="path" />
    </svg>
    <p v-else :class="css.error" :style="{ width: `${size}px` }">{{ m.qrFallback }}</p>
  </div>
</template>
