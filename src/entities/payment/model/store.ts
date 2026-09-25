import { ref } from 'vue';
import { defineStore } from 'pinia';

/** Local payout details only; no payment credentials are persisted. */
export const usePaymentStore = defineStore('payment', () => {
  const iban = ref('');
  const holder = ref('');
  function setDetails(nextIban: string, nextHolder: string) {
    iban.value = nextIban;
    holder.value = nextHolder;
  }
  function reset() {
    iban.value = '';
    holder.value = '';
  }
  return { iban, holder, setDetails, reset };
});
