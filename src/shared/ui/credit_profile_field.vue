<script setup lang="ts">
import { computed, useId } from 'vue';
import { formatInput, maskInput, type InputMask } from '@/shared/lib/input-mask';
const props = withDefaults(
  defineProps<{
    label: string;
    mask?: InputMask;
    inputmode?: 'text' | 'numeric' | 'email' | 'tel' | 'decimal';
    type?: string;
    autocomplete?: string;
    placeholder?: string;
    required?: boolean;
    invalid?: boolean;
  }>(),
  {
    type: 'text',
    autocomplete: 'off',
  },
);
const value = defineModel<string>({ required: true });
const id = useId();
const displayed = computed(() => formatInput(value.value, props.mask));
const keyboard = computed(
  () => props.inputmode ?? (props.mask === 'integer' ? 'numeric' : undefined),
);
function input(event: Event) {
  value.value = maskInput(event.target as HTMLInputElement, props.mask);
}
</script>
<template>
  <div :class="$style.field">
    <label :for="id">{{ label }}</label>
    <input
      :id="id"
      :name="id"
      :value="displayed"
      :inputmode="keyboard"
      :spellcheck="mask ? false : undefined"
      :autocapitalize="mask === 'iban' ? 'characters' : undefined"
      @input="input"
      :type="type"
      :autocomplete="autocomplete"
      :placeholder="placeholder"
      :required="required"
      :aria-invalid="invalid"
    />
  </div>
</template>
<style module lang="scss">
.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 13px;
  input {
    width: 100%;
    min-width: 0;
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 12px;
    color: var(--ink);
    background: var(--background);
  }
}
</style>
