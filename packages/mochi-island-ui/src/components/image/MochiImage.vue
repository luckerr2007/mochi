<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue';
import css from './MochiImage.module.css';
import { useMessages } from '../../locale';

defineOptions({ name: 'MochiImage' });

const m = useMessages();

const props = withDefaults(
  defineProps<{ src: string; alt: string; caption?: string; width?: string; height?: string }>(),
  {},
);

const open = ref(false);

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') open.value = false;
}

watch(open, (isOpen) => {
  if (isOpen) document.addEventListener('keydown', onKeydown);
  else document.removeEventListener('keydown', onKeydown);
});

onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown));
</script>

<template>
  <button
    :class="css.root"
    type="button"
    :style="{ width, height }"
    :aria-label="m.imageZoom(alt)"
    @click="open = true"
  >
    <img :class="css.img" :src="src" :alt="alt" loading="lazy" />
  </button>

  <Teleport to="body">
    <Transition :enter-active-class="css.enter" :leave-active-class="css.leave">
      <div
        v-if="open"
        :class="css.mask"
        role="dialog"
        aria-modal="true"
        :aria-label="alt"
        @click="open = false"
      >
        <figure :class="css.frame" @click.stop>
          <img :class="css.large" :src="src" :alt="alt" />
          <figcaption v-if="caption || alt" :class="css.caption">{{ caption || alt }}</figcaption>
        </figure>
        <button :class="css.close" type="button" :aria-label="m.imageClose" @click="open = false">
          <svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2 2 L8 8 M8 2 L2 8" /></svg>
        </button>
      </div>
    </Transition>
  </Teleport>
</template>
