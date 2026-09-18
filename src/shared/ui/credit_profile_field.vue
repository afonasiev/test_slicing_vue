<script setup lang="ts">
import { useId } from 'vue';
withDefaults(defineProps<{ label: string; type?: string; autocomplete?: string }>(), {
  type: 'text',
  autocomplete: 'off',
});
const value = defineModel<string>({ required: true });
const id = useId();
</script>
<template>
  <div :class="$style.field">
    <label :for="id">{{ label }}</label>
    <input :id="id" v-model="value" :type="type" :autocomplete="autocomplete" />
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
