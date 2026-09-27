import { ref } from 'vue';
import { defineStore } from 'pinia';

/** Local payout details only; no payment credentials are persisted. */
export const usePaymentStore = defineStore('payment', () => {
  const iban = ref('');
  const holder = ref('');
  const amount = ref(8300);
  function setDetails(nextIban: string, nextHolder: string, nextAmount = 8300) {
    iban.value = nextIban;
    holder.value = nextHolder;
    amount.value = nextAmount;
  }
  function reset() {
    iban.value = '';
    holder.value = '';
    amount.value = 8300;
  }
  return { iban, holder, amount, setDetails, reset };
});
