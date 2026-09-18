<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'outline' | 'plain';
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
  }>(),
  { variant: 'outline', type: 'button', disabled: false },
);
const emit = defineEmits<{ click: [event: MouseEvent] }>();
function click(event: MouseEvent) {
  // Safari does not focus buttons on pointer activation by default.
  (event.currentTarget as HTMLButtonElement).focus({ preventScroll: true });
  emit('click', event);
}
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[$style.button, $style[variant]]"
    @click="click"
  >
    <slot />
  </button>
</template>

<style module lang="scss">
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  line-height: 16px;
  background: transparent;
  color: var(--ink);
  transition:
    filter 120ms,
    box-shadow 120ms;
  &:disabled {
    opacity: 0.65;
  }
  &:active:not(:disabled) {
    filter: brightness(0.93);
  }
  @media (hover: hover) {
    &:hover:not(:disabled) {
      filter: brightness(0.95);
    }
  }
}
.outline {
  border: 1.5px solid var(--accent);
  color: var(--accent);
  background: white;
}
.primary {
  color: white;
  background: var(--accent);
  box-shadow: 0 1px 2px #1a1a1a0d;
}
.plain {
  padding: 0;
  border: 0;
  border-radius: 0;
}
</style>
