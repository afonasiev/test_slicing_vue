<script setup lang="ts">
import { useId } from 'vue';
import ProfileButton from '../credit_profile_button.vue';
import { ProfileIcon } from '../icons';
defineProps<{
  label: string;
  placeholder: string;
  options: readonly { value: string; label: string }[];
  required?: boolean;
  menuOpen?: boolean;
}>();
const model = defineModel<string>({ required: true });
const id = useId();
const emit = defineEmits<{ close: [] }>();
function choose(event: MouseEvent) {
  model.value = (event.currentTarget as HTMLButtonElement).dataset.value ?? '';
  emit('close');
}
function close() {
  emit('close');
}
</script>
<template>
  <div :class="$style.field">
    <label :for="id">{{ label }}</label>
    <div :class="$style.control">
      <select :id="id" v-model="model" :required="required" @change="close">
        <option disabled value="">{{ placeholder }}</option>
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <ProfileIcon name="back" :class="$style.arrow" />
    </div>
    <div
      v-if="menuOpen"
      :class="$style.options"
      role="group"
      :aria-label="label"
      @keydown.esc="close"
    >
      <ProfileButton
        v-for="option in options"
        :key="option.value"
        variant="plain"
        :data-value="option.value"
        @click="choose"
        >{{ option.label }}</ProfileButton
      >
    </div>
  </div>
</template>
<style module lang="scss">
.field {
  display: grid;
  gap: 12px;
}
.control {
  position: relative;
}
.control select {
  appearance: none;
  width: 100%;
  min-width: 0;
  height: 85px;
  border: 1.5px solid var(--accent);
  border-radius: 19px;
  padding: 0 56px 0 24px;
  background: var(--background);
  color: #747474;
  font-size: 18px;
  box-shadow: 0 4px 6px #0000000d;
}
.arrow {
  position: absolute;
  right: 24px;
  top: calc(50% - 12px);
  width: 24px;
  height: 24px;
  transform: rotate(90deg);
  pointer-events: none;
}
@media (max-width: 767px) {
  .field {
    gap: 8px;
  }
  .control select {
    height: 46px;
    padding-left: 16px;
    font-size: 15px;
    border-radius: 14px;
  }
  .arrow {
    right: 16px;
  }
}
.options {
  display: grid;
  padding: 8px;
  gap: 2px;
  background: white;
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: 0 4px 12px #00000014;
  button {
    text-align: left;
    justify-content: start;
    min-height: 40px;
    padding: 8px 16px;
  }
  button:hover {
    background: var(--tint);
  }
}
</style>
