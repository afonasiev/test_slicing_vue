import { ref } from 'vue';
import { defineStore } from 'pinia';
export const useContractStore = defineStore('contract', () => {
  const iban = ref('');
  const signature = ref('');
  function reset() {
    iban.value = '';
    signature.value = '';
  }
  return { iban, signature, reset };
});
