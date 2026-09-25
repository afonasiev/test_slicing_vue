<script setup lang="ts">
import { computed, useId } from 'vue';
const props = defineProps<{ label: string; min: number; max: number; unit: string }>();
const value = defineModel<number>({ required: true });
const id = useId();
const progress = computed(() => value.value - props.min);
const total = computed(() => props.max - props.min);
</script>
<template>
  <div :class="$style.range">
    <label :for="id" :class="$style.visuallyHidden">{{ label }}</label>
    <output :for="id">
      <strong>{{ value }}</strong> {{ unit }}
    </output>
    <div :class="$style.control">
      <progress :value="progress" :max="total" aria-hidden="true" />
      <input :id="id" v-model.number="value" type="range" :min="min" :max="max" />
    </div>
  </div>
</template>
<style module lang="scss">
.range {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.range output {
  text-align: center;
  color: var(--accent);
  font-size: 24px;
  font-weight: 600;
}
.range strong {
  font-size: 40px;
}
.control {
  position: relative;
  height: 32px;
}
.control progress {
  position: absolute;
  inset: 10px 0;
  width: 100%;
  height: 12px;
  border: 0;
  border-radius: 20px;
  overflow: hidden;
  background: #e9e9e9;
}
.control progress::-webkit-progress-bar {
  background: #e9e9e9;
}
.control progress::-webkit-progress-value {
  background: var(--accent);
}
.control progress::-moz-progress-bar {
  background: var(--accent);
}
.range input::-webkit-slider-runnable-track {
  height: 32px;
  background: transparent;
}
.range input::-moz-range-track {
  height: 32px;
  background: transparent;
}
.range input::-webkit-slider-thumb {
  appearance: none;
  width: 32px;
  height: 32px;
  border: 8px solid white;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 2px 6px #0002;
}
.range input::-moz-range-thumb {
  box-sizing: border-box;
  width: 32px;
  height: 32px;
  border: 8px solid white;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 2px 6px #0002;
}
.range input {
  appearance: none;
  position: relative;
  background: transparent;
  width: 100%;
  height: 32px;
  margin: 0;
  accent-color: var(--accent);
  cursor: pointer;
}
.visuallyHidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}
@media (max-width: 767px) {
  .control progress {
    height: 8px;
    inset-block: 12px;
  }
  .range output {
    font-size: 18px;
    font-weight: 500;
  }
  .range strong {
    font-size: 28px;
    font-weight: 600;
  }
  .range {
    gap: 16px;
  }
}
</style>
