import { ref } from 'vue';
import { defineStore } from 'pinia';
export const useTransferStore = defineStore('transfer', () => {
  const percentage = ref(1);
  const running = ref(false);
  function pause() {
    running.value = false;
  }
  function reset() {
    percentage.value = 1;
    pause();
  }
  function toggle() {
    if (percentage.value >= 100) percentage.value = 1;
    running.value = !running.value;
  }
  function advance() {
    if (!running.value) return;
    percentage.value = Math.min(100, percentage.value + 1);
    if (percentage.value === 100) pause();
  }
  return { percentage, running, toggle, advance, pause, reset };
});
