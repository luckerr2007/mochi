<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import css from './MochiCountdown.module.css';

defineOptions({ name: 'MochiCountdown' });

const props = withDefaults(
  defineProps<{
    /** 目标时刻：Date / 时间戳 / 可被 Date 解析的字符串 */
    to: string | number | Date;
    /** 读屏与标题里的说明 */
    label?: string;
  }>(),
  { label: '倒计时' },
);

const emit = defineEmits<{ finish: [] }>();

const remaining = ref(0);
let timer: ReturnType<typeof setInterval> | undefined;

function tick() {
  const target = new Date(props.to).getTime();
  remaining.value = Math.max(0, target - Date.now());
  if (remaining.value === 0) {
    clearInterval(timer);
    timer = undefined;
    emit('finish');
  }
}

onMounted(() => {
  tick();
  timer = setInterval(tick, 250);
});

onBeforeUnmount(() => clearInterval(timer));

const units = computed(() => {
  const total = Math.ceil(remaining.value / 1000);
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return [
    { key: 'd', value: String(days), unit: '天' },
    { key: 'h', value: String(hours).padStart(2, '0'), unit: '时' },
    { key: 'm', value: String(minutes).padStart(2, '0'), unit: '分' },
    { key: 's', value: String(seconds).padStart(2, '0'), unit: '秒' },
  ];
});
</script>

<template>
  <span :class="css.root" role="timer" :aria-label="`${label}：剩余 ${units.map((u) => u.value + u.unit).join('')}`">
    <span v-for="u in units" :key="u.key" :class="css.cell">
      <!-- 数字变化时重挂载重播弹跳；等宽数字防抖动 -->
      <span :key="u.value" :class="css.value" :data-zero="Number(u.value) === 0 || undefined">{{ u.value }}</span>
      <span :class="css.unit" aria-hidden="true">{{ u.unit }}</span>
    </span>
  </span>
</template>
