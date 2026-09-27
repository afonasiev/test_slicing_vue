<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ProfileHeader } from '@/widgets/header';
import { ProfileProgress } from '@/widgets/progress';
import { ProfilePersonalData } from '@/widgets/personal-data';
import { ProfileChecklist } from '@/widgets/checklist';
import { WithdrawForm } from '@/features/withdraw-funds';
import { usePaymentStore } from '@/entities/payment';
import { useProfileStore } from '@/entities/profile';
import { ProfileButton, ProfileIcon } from '@/shared/ui';
import { routePaths } from '@/shared/config';
import { useMediaQuery } from '@/shared/lib/media';
import ReceivePage from './credit_profile_receive_page.vue';
const route = useRoute();
const receive = computed(() =>
  ['insurance', 'certificate', 'restricted', 'euroclear'].includes(String(route.query.state)),
);
const router = useRouter();
const profile = useProfileStore();
const payment = usePaymentStore();
const mobile = useMediaQuery('(max-width: 767px)');
const completed = computed(() => (mobile.value ? 5 : 3));
const open = ref(true);
function show() {
  open.value = true;
}
function close() {
  open.value = false;
}
function navigate(destination: string) {
  void router.push(routePaths[destination] ?? '/');
}
async function submit(iban: string, holder: string) {
  payment.setDetails(iban, holder);
  await profile.update({ iban });
  void router.push('/commission');
}
</script>
<template>
  <ReceivePage v-if="receive" />
  <template v-else
    ><ProfileHeader />
    <main :class="$style.layout" aria-label="Prelievo dei fondi">
      <div :class="$style.column">
        <ProfileProgress :completed="completed" @navigate="navigate" />
        <section :class="$style.card">
          <h1>Importo da ricevere</h1>
          <strong :class="$style.amount">€ 12 000</strong>
          <p :class="$style.caption">100% del totale disponibile</p>
          <ProfileButton
            variant="primary"
            :class="$style.withdraw"
            :aria-expanded="open"
            @click="show"
            ><ProfileIcon name="bank" />Preleva i fondi
            <span aria-hidden="true">→</span></ProfileButton
          >
          <WithdrawForm
            v-if="open"
            :initial-iban="payment.iban || profile.profile.iban || ''"
            :initial-holder="payment.holder || profile.profile.name"
            @submit="submit"
            @close="close"
          />
        </section>
      </div>
      <aside :class="$style.column" aria-label="Riepilogo richiesta">
        <ProfilePersonalData compact :class="$style.summary" />
        <ProfileChecklist compact :completed="5" @navigate="navigate" />
      </aside></main
  ></template>
</template>
<style module lang="scss" src="./styles/financial/index.module.scss"></style>
