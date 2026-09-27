<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ProfileDialog, ProfileButton } from '@/shared/ui';
import TransferPage from './credit_profile_transfer_page.vue';
import { CommissionDialog } from '@/features/pay-commission';
import { useMediaQuery } from '@/shared/lib/media';
import WithdrawalPage from './credit_profile_withdrawal_page.vue';
import Dashboard from './credit_profile_dashboard.vue';
const mobile = useMediaQuery('(max-width: 767px)');
const route = useRoute();
const router = useRouter();
const certificate = computed(() => route.query.state === 'certificate');
const processing = computed(() => route.query.state === 'processing');
const sepa = computed(() => route.query.overlay === 'sepa');
const insurance = computed(() => route.query.state === 'insurance');
const details = computed(() => route.query.overlay === 'details');
const coordinates = computed(() => route.query.overlay === 'coordinates' || sepa.value);
function close() {
  void router.push(
    certificate.value
      ? '/transfer?state=certificate'
      : insurance.value
        ? '/transfer?state=interrupted'
        : '/',
  );
}
function back() {
  if (coordinates.value || details.value)
    void router.push({ name: 'commission', query: { state: route.query.state } });
  else if (certificate.value) void router.push('/transfer?state=certificate');
  else void router.push(insurance.value ? '/transfer?state=interrupted' : '/withdrawal');
}
function next() {
  void router.push({
    name: 'commission',
    query: { state: route.query.state, overlay: 'coordinates' },
  });
}
function showDetails() {
  void router.push({ name: 'commission', query: { state: route.query.state, overlay: 'details' } });
}
function showSepa() {
  void router.push({ name: 'commission', query: { state: route.query.state, overlay: 'sepa' } });
}
</script>
<template>
  <TransferPage v-if="insurance || certificate" :force-interrupted="insurance" /><WithdrawalPage
    v-else-if="mobile"
  /><Dashboard v-else /><CommissionDialog
    :key="String(coordinates)"
    :coordinates="coordinates"
    :insurance="insurance"
    :certificate="certificate"
    :processing="processing"
    @sepa="showSepa"
    @details="showDetails"
    @close="close"
    @back="back"
    @next="next"
  />
  <ProfileDialog v-if="details" title="Dettagli" @close="back">
    <div :class="$style.details">
      <template v-if="insurance"
        ><p>
          L’attivazione della polizza assicurativa è un passaggio obbligatorio previsto dal
          contratto di finanziamento sottoscritto ed è necessaria per il perfezionamento
          dell’operazione, ai sensi dell’art. 1882 del Codice Civile e delle normative IVASS in
          materia di contratti di credito. La presenza della copertura assicurativa consente di
          accedere al finanziamento a condizioni più vantaggiose.
        </p>
        <aside>
          La copertura assicurativa garantisce la protezione del credito per tutta la durata del
          finanziamento.
        </aside></template
      >
      <template v-else-if="certificate"
        ><p>
          In conformità con le direttive UE antiriciclaggio (AML) e la direttiva sui servizi di
          pagamento PSD2, le piattaforme finanziarie sono tenute a verificare la titolarità degli
          strumenti di pagamento, prevenendo il riciclaggio di denaro tramite terzi. Un pagamento di
          prova di 136 € avvia l’autenticazione forte del cliente (SCA), consentendo di confermare
          che il conto sia utilizzato dal cliente della piattaforma.
        </p>
        <h3>Causa:</h3>
        <p>
          Poiché il processo di prelievo dei fondi è stato avviato più volte e non è stato
          completato, il regolatore dei pagamenti SEPA ha richiesto un pagamento di prova per
          verificare il tuo conto.
        </p>
        <aside>
          Dopo la verifica del conto, l’importo del pagamento di prova sarà disponibile per il
          prelievo insieme all’importo del credito.
        </aside></template
      >
      <template v-else
        ><p>
          Il servizio gestisce la tua pratica di credito e garantisce il trasferimento al tasso
          agevolato.
        </p>
        <p>Il costo del servizio non è detraibile dal credito erogato.</p></template
      >
      <ProfileButton variant="primary" @click="back">Ho capito</ProfileButton>
    </div>
  </ProfileDialog>
  <ProfileDialog v-if="sepa" title="SEPA Instant" @close="next"
    ><div :class="$style.details">
      <p>SEPA Instant garantisce l’elaborazione del pagamento entro 60 minuti.</p>
      <p>
        Con bonifico ordinario (SEPA Standard) l’accredito del credito può richiedere da 1 a 3
        giorni lavorativi.
      </p>
      <ProfileButton @click="next">Ho capito</ProfileButton>
    </div></ProfileDialog
  >
</template>
<style module lang="scss">
.details {
  display: grid;
  gap: 24px;
  font-size: 16px;
  line-height: 24px;
  padding-top: 24px;
  aside {
    background: var(--tint);
    border-radius: 12px;
    padding: 16px;
    font-size: 14px;
    line-height: 20px;
  }
}
</style>
