<script setup lang="ts">
import { computed, ref } from 'vue';
import { useMediaQuery } from '@/shared/lib/media';
import { ProfileDialog, ProfileButton, ProfileIcon } from '@/shared/ui';
const props = defineProps<{
  coordinates: boolean;
  insurance?: boolean;
  verification?: boolean;
  certificate?: boolean;
  processing?: boolean;
}>();
const emit = defineEmits<{ close: []; back: []; next: []; details: []; sepa: [] }>();
const title = computed(() =>
  props.coordinates ? 'Coordinate di pagamento' : 'Commissione da versare',
);
const message = ref('');
const mobile = useMediaQuery('(max-width: 767px)');
const amount = computed(() =>
  props.verification
    ? props.coordinates
      ? '172 €'
      : '0 €'
    : props.certificate
      ? props.coordinates
        ? '172 €'
        : '136 €'
      : props.insurance
        ? '172 €'
        : '37 €',
);
const extended = computed(
  () => props.insurance || props.verification || props.certificate || props.processing,
);
const paymentTitle = computed(() =>
  props.certificate
    ? 'Deposito di verifica'
    : props.verification
      ? 'Tassa di verifica'
      : props.insurance
        ? 'Copertura assicurativa'
        : 'Pagamento servizi',
);
function showSepa() {
  emit('sepa');
}
const details = computed(() =>
  props.certificate
    ? [
        { label: 'IVA 22%', value: '24,52 €' },
        { label: 'Servizi selezione', value: '66,89 €' },
        { label: 'Firma digitale', value: '44,59 €' },
      ]
    : props.verification
      ? ['IVA 22%', 'Servizi selezione', 'Firma digitale'].map((label) => ({ label, value: '0 €' }))
      : props.insurance
        ? [
            { label: mobile.value ? 'Imposta assicurativa' : 'IVA 22%', value: '31,02 €' },
            { label: mobile.value ? 'Consulenza legale' : 'Servizi selezione', value: '84,59 €' },
            { label: 'Firma digitale', value: '56,39 €' },
          ]
        : [
            { label: 'IVA 22%', value: '6,67 €' },
            { label: 'Servizi selezione', value: '18,20 €' },
            { label: 'Firma digitale', value: '12,13 €' },
          ],
);
const paymentRows = computed(() => [
  { label: 'BENEFICIARIO', value: 'Indaco Salvatore' },
  { label: 'IBAN', value: 'IT26 U020 0809 5000 0043 1003 095' },
  { label: 'SWIFT/BIC', value: 'UNCRITMMXXX' },
  { label: 'IMPORTO', value: amount.value },
]);
function detailsOpen() {
  emit('details');
}
function close() {
  emit('close');
}
function back() {
  emit('back');
}
function next() {
  emit('next');
}
async function copy(event: MouseEvent) {
  const value = (event.currentTarget as HTMLElement).dataset.value;
  if (!value) return;
  try {
    await navigator.clipboard.writeText(value);
    message.value = 'Dato copiato.';
  } catch {
    message.value = 'Copia non disponibile. Seleziona il dato e copialo manualmente.';
  }
}
function receipt() {
  message.value = 'Demo: ricevuta segnalata al consulente. Nessun pagamento è stato effettuato.';
}
</script>
<template>
  <ProfileDialog
    :title="title"
    :dialog-class="
      props.coordinates ? $style.coordinateDialog : extended ? $style.insurance : $style.dialog
    "
    @close="close"
  >
    <template #header="{ titleId }">
      <nav :class="$style.navigation" aria-label="Navigazione commissione">
        <ProfileButton variant="plain" aria-label="Indietro" @click="back"
          ><ProfileIcon name="arrowLeft"
        /></ProfileButton>
        <ProfileButton variant="plain" aria-label="Chiudi" @click="close"
          ><ProfileIcon name="close"
        /></ProfileButton>
      </nav>
      <header :class="$style.heading">
        <p>Commissione</p>
        <h2 :id="titleId">{{ title }}</h2>
      </header>
    </template>
    <ol :class="$style.steps">
      <li>1. IBAN</li>
      <li :class="!props.coordinates && $style.active">2. COMMISSIONE</li>
      <li :class="props.coordinates && $style.active">3. COORDINATE</li>
    </ol>
    <template v-if="!props.coordinates">
      <div :class="$style.breakdown">
        <section :class="$style.amount" aria-label="Dettaglio commissione">
          <p>IMPORTO DA VERSARE</p>
          <strong>{{ amount }}</strong>
          <dl>
            <div v-for="row in details" :key="row.label">
              <dt>{{ row.label }}</dt>
              <dd>{{ row.value }}</dd>
            </div>
          </dl>
        </section>
        <ProfileButton v-if="extended" variant="plain" :class="$style.help" @click="detailsOpen">
          <span aria-hidden="true">?</span
          ><span
            ><strong>Hai dubbi sulla commissione?</strong
            ><small>Scopri cosa include e perché viene applicata.</small></span
          >
        </ProfileButton>
        <aside v-else :class="$style.note">
          <span aria-hidden="true">?</span>
          <p>
            Il servizio gestisce la tua pratica di credito e garantisce il trasferimento al tasso
            agevolato. Il costo del servizio non è detraibile dal credito.
          </p>
        </aside>
      </div>
      <section :class="$style.payment">
        <ProfileIcon name="paymentCard" />
        <div>
          <h3>{{ paymentTitle }}</h3>
          <p v-if="certificate">
            In base al regolamento UE 2024/886, a causa di frequenti prelievi serve la verifica del
            conto. Un deposito di €136,00 sarà restituito dopo la verifica.
          </p>
          <p v-else-if="verification">
            Per completare la verifica del conto è necessario effettuare un deposito di prova che
            sarà restituito dopo la verifica.
          </p>
          <p v-else-if="insurance">
            Per proseguire con la procedura di accredito del finanziamento è necessario attivare la
            copertura assicurativa del credito ai sensi del contratto di credito sottoscritto.
          </p>
          <p v-else>
            Per proseguire con la procedura di accredito del finanziamento è necessario effettuare
            il pagamento dei servizi.
          </p>
        </div>
      </section>
      <ProfileButton variant="primary" :class="$style.action" @click="next"
        >Vai alle coordinate</ProfileButton
      >
    </template>
    <template v-else>
      <p :class="$style.instructions">Copia i dati, apri la tua banca e invia il bonifico.</p>
      <ProfileButton variant="plain" :class="$style.sepa" @click="showSepa"
        >Seleziona il metodo SEPA Instant <span aria-hidden="true">?</span></ProfileButton
      >
      <section :class="$style.coordinates" aria-label="Coordinate bancarie">
        <dl>
          <div v-for="row in paymentRows" :key="row.label">
            <dt>{{ row.label }}</dt>
            <dd>
              <span>{{ row.value }}</span
              ><ProfileButton
                variant="plain"
                :aria-label="'Copia ' + row.label"
                :data-value="row.value"
                @click="copy"
                ><ProfileIcon name="copy"
              /></ProfileButton>
            </dd>
          </div>
        </dl>
        <p>Se necessario, nel campo "Causale" indichi "Transfer" ❗</p>
      </section>
      <p :class="$style.receipt">Invia la ricevuta al tuo consulente</p>
      <ProfileButton variant="primary" :class="$style.action" @click="receipt"
        >Conferma pagamento</ProfileButton
      >
    </template>
    <p v-if="message" :class="$style.message" role="status">{{ message }}</p>
    <footer :class="$style.footer">Connessione SSL · Visa · Mastercard · SEPA</footer>
  </ProfileDialog>
</template>
<style module lang="scss" src="./styles/index.module.scss"></style>
