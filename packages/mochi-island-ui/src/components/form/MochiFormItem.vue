<script setup lang="ts">
import { computed, useId } from 'vue';
import css from './MochiFormItem.module.css';

defineOptions({ name: 'MochiFormItem' });

const props = defineProps<{
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  /** 提示与错误文案的 id，交给内部控件做 aria-describedby */
  describedById?: string;
}>();

const uid = useId();
const messageId = computed(() => props.describedById ?? `${uid}-msg`);
</script>

<template>
  <div :class="css.root" :data-invalid="error ? true : undefined">
    <p v-if="label" :class="css.label">
      {{ label }}<span v-if="required" :class="css.required" aria-hidden="true">*</span>
    </p>

    <slot :message-id="messageId" :invalid="Boolean(error)" />

    <!-- 错误与提示互斥出现：key 强制换节点，新文案淡入下落；appear 让首帧携带的错误也有登场 -->
    <Transition :enter-active-class="css.messageIn" appear>
      <p v-if="error" :id="messageId" key="error" :class="css.error" role="alert">{{ error }}</p>
      <p v-else-if="hint" :id="messageId" key="hint" :class="css.hint">{{ hint }}</p>
    </Transition>
  </div>
</template>
