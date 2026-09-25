<script setup lang="ts">
import { computed, ref } from 'vue';
import { ProfileDialog, ProfileButton, ProfileIcon } from '@/shared/ui';
const props = defineProps<{ coordinates: boolean }>();
const emit = defineEmits<{ close: []; back: []; next: [] }>();
const title = computed(() =>
  props.coordinates ? 'Coordinate di pagamento' : 'Commissione da versare',
);
const message = ref('');
const details = [
  { label: 'IVA 22%', value: '6,67 €' },
  { label: 'Servizi selezione', value: '18,20 €' },
  { label: 'Firma digitale', value: '12,13 €' },
];
const paymentRows = [
  { label: 'BENEFICIARIO', value: 'Indaco Salvatore' },
  { label: 'IBAN', value: 'IT26 U020 0809 5000 0043 1003 095' },
  { label: 'SWIFT/BIC', value: 'UNCRITMMXXX' },
  { label: 'IMPORTO', value: '37 €' },
];
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
    :dialog-class="props.coordinates ? $style.coordinateDialog : $style.dialog"
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
      <section :class="$style.amount" aria-label="Dettaglio commissione">
        <p>IMPORTO DA VERSARE</p>
        <strong>37 €</strong>
        <dl>
          <div v-for="row in details" :key="row.label">
            <dt>{{ row.label }}</dt>
            <dd>{{ row.value }}</dd>
          </div>
        </dl>
      </section>
      <aside :class="$style.note">
        <span aria-hidden="true">?</span>
        <p>
          Il servizio gestisce la tua pratica di credito e garantisce il trasferimento al tasso
          agevolato. Il costo del servizio non è detraibile dal credito.
        </p>
      </aside>
      <section :class="$style.payment">
        <ProfileIcon name="paymentCard" />
        <div>
          <h3>Pagamento servizi</h3>
          <p>
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
      <p :class="$style.sepa">Seleziona il metodo SEPA Instant <span aria-hidden="true">?</span></p>
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
