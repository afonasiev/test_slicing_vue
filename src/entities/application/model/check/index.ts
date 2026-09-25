import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

export const useBankCheckStore = defineStore('bank-check', () => {
  const completed = ref(6);
  const running = ref(false);
  const percentage = computed(() => Math.round((completed.value / 12) * 100));
  function toggle() {
    if (completed.value === 12) completed.value = 0;
    running.value = !running.value;
  }
  function advance() {
    if (!running.value) return;
    completed.value = Math.min(12, completed.value + 1);
    if (completed.value === 12) running.value = false;
  }
  function pause() {
    running.value = false;
  }
  function reset() {
    completed.value = 6;
    pause();
  }
  return { completed, running, percentage, toggle, advance, pause, reset };
});
