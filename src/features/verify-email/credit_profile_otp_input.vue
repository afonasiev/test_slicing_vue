<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
const code = defineModel<string>({ required: true });
defineProps<{ invalid?: boolean }>();
const group = useTemplateRef('group');
const digits = computed(() =>
  Array.from({ length: 6 }, (_, index) => ({
    index,
    label: `Cifra ${index + 1}`,
    value: code.value[index] === ' ' ? '' : code.value[index] || '',
  })),
);
function inputs() {
  return Array.from(group.value?.querySelectorAll('input') || []);
}
function focus(index: number) {
  const input = inputs()[index];
  input?.focus();
  input?.select();
}
function focusFirst() {
  focus(0);
}
defineExpose({ focusFirst });
function input(event: Event) {
  const target = event.target as HTMLInputElement;
  const index = Number(target.dataset.index);
  const value = target.value.replace(/\D/g, '');
  const chars = code.value.padEnd(6, ' ').split('');
  if (!value) chars[index] = ' ';
  else
    for (let offset = 0; offset < value.length && index + offset < 6; offset++)
      chars[index + offset] = value[offset]!;
  code.value = chars.join('');
  target.value = chars[index]?.trim() || '';
  if (value) focus(Math.min(index + value.length, 5));
}
function paste(event: ClipboardEvent) {
  event.preventDefault();
  const text = event.clipboardData?.getData('text').replace(/\D/g, '').slice(0, 6) || '';
  if (!text) return;
  code.value = text.padEnd(6, ' ');
  focus(Math.min(text.length, 5));
}
function keydown(event: KeyboardEvent) {
  const target = event.target as HTMLInputElement;
  const index = Number(target.dataset.index);
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    focus(Math.max(0, Math.min(5, index + (event.key === 'ArrowLeft' ? -1 : 1))));
  }
  if (event.key === 'Backspace' && !target.value && index > 0) {
    event.preventDefault();
    const chars = code.value.padEnd(6, ' ').split('');
    chars[index - 1] = ' ';
    code.value = chars.join('');
    focus(index - 1);
  }
}
function select(event: FocusEvent) {
  (event.target as HTMLInputElement).select();
}
</script>
<template>
  <div ref="group" :class="$style.group" role="group" aria-label="Codice di verifica">
    <input
      v-for="digit in digits"
      :key="digit.index"
      :data-index="digit.index"
      :value="digit.value"
      :aria-label="digit.label"
      :aria-invalid="invalid"
      inputmode="numeric"
      autocomplete="one-time-code"
      :class="$style.digit"
      @input="input"
      @paste="paste"
      @keydown="keydown"
      @focus="select"
    />
  </div>
</template>
<style module lang="scss">
.group {
  display: flex;
  gap: 10px;
}
.digit {
  width: 32px;
  height: 32px;
  padding: 0;
  text-align: center;
  background: transparent;
  border: 0;
  box-shadow: inset 0 0 0 0.32px var(--accent);
  border-radius: 2.56px;
  color: var(--ink);
  font-size: 16px;
  &[aria-invalid='true'] {
    box-shadow: inset 0 0 0 1px #b42318;
  }
}
@media (max-width: 359px) {
  .group {
    gap: 6px;
  }
}
</style>
