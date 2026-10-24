<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue';
import FieldShell from '../../internal/FieldShell.vue';
import css from './MochiCodeInput.module.css';
import { useMessages } from '../../locale';

defineOptions({ name: 'MochiCodeInput' });

const m = useMessages();

const props = withDefaults(
  defineProps<{
    /** 位数 */
    length?: number;
    label?: string;
    hint?: string;
    disabled?: boolean;
    invalid?: boolean;
  }>(),
  { length: 6 },
);

const emit = defineEmits<{ complete: [string] }>();

/** 兑换码全文。数组模型的老问题在字符串上不存在，但保持小写归一 */
const model = defineModel<string>({ default: '' });

const boxes = computed(() => Array.from({ length: Math.max(1, props.length) }, (_, i) => model.value[i] ?? ''));
const fieldId = useId();
const hintId = computed(() => `${fieldId}-hint`);
const groupEl = ref<HTMLDivElement>();

/** 焦点定位走组内查询：模板函数 ref 在该编译路径上不触发，不依赖它 */
function focusAt(index: number) {
  const inputs = groupEl.value?.querySelectorAll<HTMLInputElement>('input');
  console.log('[dbg] focusAt', index, 'group:', Boolean(groupEl.value), 'inputs:', inputs?.length);
  inputs?.[Math.min(Math.max(index, 0), props.length - 1)]?.focus();
}

function setModel(next: string) {
  model.value = next.slice(0, props.length).toLowerCase();
}

/**
 * 输入一位就跳下一位；一次来多个字符（粘贴/连打）从当前位置顺位铺开。
 * 自动大写的键盘也不怕——统一归一小写。
 */
function onInput(index: number, event: Event) {
  const raw = (event.target as HTMLInputElement).value.toLowerCase().replace(/\s/g, '');
  if (!raw) return;
  const chars = model.value.padEnd(props.length, ' ').split('');
  for (let i = 0; i < raw.length && index + i < props.length; i += 1) {
    chars[index + i] = raw[i]!;
  }
  setModel(chars.join('').trimEnd());
  focusAt(index + raw.length);
}

function onKeydown(index: number, event: KeyboardEvent) {
  if (event.key === 'Backspace') {
    event.preventDefault();
    const chars = model.value.split('');
    if (chars[index]) {
      chars.splice(index, 1);
      setModel(chars.join(''));
    } else if (index > 0) {
      chars.splice(index - 1, 1);
      setModel(chars.join(''));
      focusAt(index - 1);
    }
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault();
    focusAt(index - 1);
  } else if (event.key === 'ArrowRight') {
    event.preventDefault();
    focusAt(index + 1);
  }
}

// 填满即抛 complete（父层通常在这里禁用输入并请求核销）
watch(model, (value) => {
  if (value.length === props.length) emit('complete', value);
});
</script>

<template>
  <FieldShell :label="label" :hint="hint" :field-id="fieldId" :hint-id="hintId" :invalid="invalid">
    <div ref="groupEl" :class="css.root" role="group" :aria-label="m.codeGroup(length)">
      <input
        v-for="(char, index) in boxes"
        :key="index"
        :class="css.box"
        :data-filled="Boolean(char) || undefined"
        type="text"
        inputmode="text"
        autocomplete="one-time-code"
        :value="char"
        :maxlength="1"
        :disabled="disabled"
        :aria-label="m.codeCell(index + 1)"
        :aria-invalid="invalid || undefined"
        spellcheck="false"
        @input="onInput(index, $event)"
        @keydown="onKeydown(index, $event)"
        @focus="($event.target as HTMLInputElement).select()"
      />
    </div>
  </FieldShell>
</template>
