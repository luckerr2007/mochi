<script setup lang="ts">
import css from './MochiLink.module.css';

defineOptions({ name: 'MochiLink' });

const props = withDefaults(
  defineProps<{ href?: string; external?: boolean; disabled?: boolean }>(),
  { external: false, disabled: false },
);

function onClick(event: MouseEvent) {
  if (props.disabled) event.preventDefault();
}
</script>

<template>
  <a
    :class="css.root"
    :href="disabled ? undefined : href"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noreferrer noopener' : undefined"
    :aria-disabled="disabled || undefined"
    @click="onClick"
  >
    <slot />
    <svg v-if="external" :class="css.arrow" viewBox="0 0 10 10" aria-hidden="true">
      <path d="M3 7 L7 3 M3.5 3 H7 V6.5" />
    </svg>
  </a>
</template>
