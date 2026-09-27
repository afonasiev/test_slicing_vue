<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';
import { isValidIban, normalizeIban } from '@/entities/documents';
import { ProfileButton, ProfileField, ProfileIcon, ProfileRange } from '@/shared/ui';
const props = defineProps<{ initialIban: string; initialHolder: string; receive?: boolean }>();
const emit = defineEmits<{ submit: [iban: string, holder: string, amount: number]; close: [] }>();
const iban = ref(props.initialIban);
const holder = ref(props.initialHolder);
const error = ref('');
const amount = ref(8300);
const formattedAmount = computed(() => new Intl.NumberFormat('it-IT').format(amount.value));
const percentage = computed(() => Math.round(amount.value / 83));
const method = ref<'iban' | 'card'>('iban');
const form = useTemplateRef('form');
function selectIban() {
  method.value = 'iban';
  error.value = '';
}
function selectCard() {
  method.value = 'card';
  error.value = '';
}
function close() {
  emit('close');
}
function submit() {
  if (!isValidIban(iban.value)) {
    error.value = 'Inserisci un IBAN valido.';
    form.value?.querySelector('input')?.focus();
    return;
  }
  if (!holder.value.trim()) {
    error.value = 'Inserisci il nome dell’intestatario.';
    form.value?.querySelectorAll('input')[1]?.focus();
    return;
  }
  error.value = '';
  emit('submit', normalizeIban(iban.value), holder.value.trim(), amount.value);
}
</script>
<template>
  <section
    :class="[$style.panel, receive && $style.receive]"
    aria-label="Coordinate per ricevere il credito"
  >
    <header :class="$style.header">
      <ProfileButton
        v-if="!receive"
        variant="plain"
        :class="$style.close"
        aria-label="Chiudi coordinate"
        @click="close"
        ><ProfileIcon name="close"
      /></ProfileButton>
      <h2 v-if="receive">Scegli il metodo di ricezione</h2>
      <h2 v-else>
        Crea il tuo account per gestire<br :class="$style.desktopBreak" />
        la tua pratica di credito.
      </h2>
      <p>Inserisci le coordinate per ricevere il credito</p>
    </header>
    <form ref="form" :class="$style.form" novalidate @submit.prevent="submit">
      <div :class="$style.methods" aria-label="Metodo di accredito">
        <ProfileButton :aria-pressed="method === 'iban'" :class="$style.method" @click="selectIban"
          >IBAN<small>Bonifico bancario</small></ProfileButton
        >
        <ProfileButton :aria-pressed="method === 'card'" :class="$style.method" @click="selectCard"
          >Carta<small>Trasferimento su carta</small></ProfileButton
        >
      </div>
      <template v-if="method === 'iban'">
        <div :class="$style.ibanField">
          <ProfileField
            v-model="iban"
            label="IBAN"
            mask="iban"
            placeholder="IT00 X000 0000 0000 0000 0000 000"
            :invalid="!!error"
          />
          <p v-if="receive" :class="$style.hint">Da 15 a 34 caratteri, lettere e cifre</p>
        </div>
        <ProfileField v-model="holder" label="Intestatario" autocomplete="name" />
        <section v-if="receive" :class="$style.amount" aria-label="Importo da ricevere">
          <p>Importo da ricevere</p>
          <div>
            <strong>{{ formattedAmount }} €</strong><span>/ 8.300 €</span>
          </div>
          <small>{{ percentage }}% del totale disponibile</small>
          <ProfileRange
            v-model="amount"
            :min="1"
            :max="8300"
            label="Importo da ricevere"
            unit="€"
            :class="$style.slider"
          />
        </section>
        <p v-if="error" :class="$style.error" role="alert">{{ error }}</p>
        <ProfileButton type="submit" variant="primary" :class="$style.submit"
          >{{ receive ? 'Avvia il trasferimento' : 'Vai alla commissione'
          }}<span v-if="receive" aria-hidden="true">→</span></ProfileButton
        >
      </template>
      <p v-else :class="$style.cardNotice" role="status">
        Il trasferimento su carta non è disponibile nella demo. Seleziona IBAN per continuare.
      </p>
    </form>
  </section>
</template>
<style module lang="scss" src="./styles/index.module.scss"></style>
