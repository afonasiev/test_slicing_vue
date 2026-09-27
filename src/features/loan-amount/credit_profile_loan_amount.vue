<script setup lang="ts">
import { computed, ref } from 'vue';
import { useApplicationStore } from '@/entities/application';
import { maskInput } from '@/shared/lib/input-mask';
import { ProfileRange } from '@/shared/ui';
const store = useApplicationStore();
const amount = ref(store.application.amount.toLocaleString('it-IT'));
const months = ref(store.application.months);
const touched = ref(false);
const error = ref('');
const desktopSummary = computed(() => summary.value.replaceAll('.', ' '));
const summary = computed(() =>
  touched.value ? Number(amount.value.replace(/\D/g, '')).toLocaleString('it-IT') : '10.000',
);
function change(event: Event) {
  amount.value = maskInput(event.target as HTMLInputElement, 'integer').slice(0, 6);
  (event.target as HTMLInputElement).value = amount.value;
  touched.value = true;
}
async function save() {
  const numeric = Number(amount.value.replace(/\D/g, ''));
  const maximum = window.matchMedia('(max-width:767px)').matches ? 53000 : 33000;
  if (numeric < 1000 || numeric > maximum) {
    error.value = `Inserisci un importo tra 1.000 e ${maximum.toLocaleString('it-IT')} €.`;
    return false;
  }
  error.value = '';
  await store.update({ amount: numeric, months: months.value });
  return true;
}
defineExpose({ save });
</script>
<template>
  <div :class="$style.grid">
    <div :class="$style.fields">
      <section>
        <header>
          <p>Importo del credito</p>
          <h1>Scegli l’importo che ti serve</h1>
        </header>
        <label :class="$style.amount">
          <input
            :value="amount"
            type="text"
            name="credit-amount"
            inputmode="numeric"
            aria-label="Importo del credito"
            @input="change"
          />
          <span>€</span>
        </label>
        <div :class="$style.limits">
          <span>1.000 €</span><span :class="$style.desktop">33.000 €</span
          ><span :class="$style.mobile">53.000 €</span>
        </div>
        <p v-if="error" role="alert" :class="$style.error">{{ error }}</p>
      </section>
      <section>
        <header>
          <p>Scegli la durata del rimborso</p>
          <h2>Per quale durata?</h2>
        </header>
        <ProfileRange v-model="months" :min="1" :max="36" unit="mesi" label="Durata rimborso" />
        <div :class="$style.limits"><span>1 mese</span><span>36 mesi</span></div>
      </section>
    </div>
    <aside :class="$style.summary">
      <dl :class="$style.card">
        <div>
          <dt>Importo richiesto</dt>
          <dd>
            <span :class="$style.desktop">{{ desktopSummary }}</span
            ><span :class="$style.mobile">{{ summary }}</span> <small>€</small>
          </dd>
        </div>
        <div>
          <dt>
            <span :class="$style.desktop">Data di restituzione</span
            ><span :class="$style.mobile">Rata di restituzione</span>
          </dt>
          <dd>178 <small>€/mese</small></dd>
        </div>
        <div>
          <dt>
            <span :class="$style.desktop">Mesi</span
            ><span :class="$style.mobile">Durata rimborso</span>
          </dt>
          <dd>{{ months }} <small :class="$style.mobile">mesi</small></dd>
        </div>
      </dl>
      <p :class="$style.note">
        <span aria-hidden="true">i</span>
        <span>
          Stima indicativa basata su un tasso preferenziale del 3,8% TAN.
          <strong>Offerta soggetta ad accettazione.</strong>
        </span>
      </p>
    </aside>
  </div>
</template>
<style module lang="scss" src="./styles/index.module.scss"></style>
