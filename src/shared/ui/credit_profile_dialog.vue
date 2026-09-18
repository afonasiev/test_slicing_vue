<script setup lang="ts">
import { onMounted, onBeforeUnmount, useId, useTemplateRef } from 'vue';
import ProfileButton from './credit_profile_button.vue';
defineProps<{ title: string }>();
const emit = defineEmits<{ close: [] }>();
const dialog = useTemplateRef('dialog');
const titleId = useId();
let previousFocus: HTMLElement | null = null;
function close() {
  emit('close');
}
let pointerStartedOutside = false;
function outside(event: PointerEvent | MouseEvent) {
  const bounds = dialog.value?.getBoundingClientRect();
  return (
    !!bounds &&
    (event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom)
  );
}
function pointerDown(event: PointerEvent) {
  pointerStartedOutside = outside(event);
}
function backdropClick(event: MouseEvent) {
  if (pointerStartedOutside && outside(event)) close();
  pointerStartedOutside = false;
}
onMounted(() => {
  previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  dialog.value?.showModal();
  document.documentElement.classList.add('profile-dialog-open');
});
onBeforeUnmount(() => {
  dialog.value?.close();
  document.documentElement.classList.remove('profile-dialog-open');
  previousFocus?.focus();
});
</script>
<template>
  <Teleport to="body">
    <dialog
      ref="dialog"
      :class="$style.dialog"
      :aria-labelledby="titleId"
      @cancel.prevent="close"
      @pointerdown="pointerDown"
      @click="backdropClick"
    >
      <header :class="$style.header">
        <h2 :id="titleId">{{ title }}</h2>
        <ProfileButton variant="plain" aria-label="Chiudi" @click="close">×</ProfileButton>
      </header>
      <slot />
    </dialog>
  </Teleport>
</template>
<style module lang="scss">
:global(html.profile-dialog-open) {
  overflow: hidden;
}
.dialog {
  max-height: calc(100dvh - 32px);
  overflow-y: auto;
  overscroll-behavior: contain;
  width: min(440px, calc(100% - 32px));
  padding: 24px;
  border: 1px solid var(--border);
  border-radius: 16px;
  color: var(--ink);
  box-shadow: 0 16px 64px #1a233226;
  &::backdrop {
    background: #1a233266;
  }
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
  h2 {
    font-size: 18px;
    font-weight: 600;
  }
  button {
    font-size: 26px;
    width: 28px;
    height: 28px;
  }
}
</style>
