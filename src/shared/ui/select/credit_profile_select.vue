<script setup lang="ts">
import { useId } from 'vue';
import { ProfileIcon } from '../icons';
defineProps<{
  label: string;
  placeholder: string;
  options: readonly { value: string; label: string }[];
  required?: boolean;
}>();
const model = defineModel<string>({ required: true });
const id = useId();
</script>
<template>
  <div :class="$style.field">
    <label :for="id">{{ label }}</label>
    <div :class="$style.control">
      <select :id="id" v-model="model" :required="required">
        <option disabled value="">{{ placeholder }}</option>
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <ProfileIcon name="back" :class="$style.arrow" />
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
</style>
