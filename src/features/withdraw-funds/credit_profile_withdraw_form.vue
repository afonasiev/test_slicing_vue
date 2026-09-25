<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { isValidIban, normalizeIban } from '@/entities/documents';
import { ProfileButton, ProfileField, ProfileIcon } from '@/shared/ui';
const props = defineProps<{ initialIban: string; initialHolder: string }>();
const emit = defineEmits<{ submit: [iban: string, holder: string]; close: [] }>();
const iban = ref(props.initialIban);
const holder = ref(props.initialHolder);
const error = ref('');
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
  emit('submit', normalizeIban(iban.value), holder.value.trim());
}
</script>
<template>
  <section :class="$style.panel" aria-label="Coordinate per ricevere il credito">
    <header :class="$style.header">
      <ProfileButton
        variant="plain"
        :class="$style.close"
        aria-label="Chiudi coordinate"
        @click="close"
        ><ProfileIcon name="close"
      /></ProfileButton>
      <h2>
        Crea il tuo account per gestire<br :class="$style.desktopBreak" />
        la tua pratica di credito.
      </h2>
      <p>Inserisci le coordinate per ricevere il credito</p>
    </header>
    <form ref="form" :class="$style.form" novalidate @submit.prevent="submit">
      <div :class="$style.methods" aria-label="Metodo di accredito">
        <ProfileButton :aria-pressed="method === 'iban'" :class="$style.method" @click="selectIban"
          >IBAN<br />Bonifico bancario</ProfileButton
        >
        <ProfileButton :aria-pressed="method === 'card'" :class="$style.method" @click="selectCard"
          >Carta<br />Trasferimento su carta</ProfileButton
        >
      </div>
      <template v-if="method === 'iban'">
        <ProfileField
          v-model="iban"
          label="IBAN"
          placeholder="IT00 X000 0000 0000 0000 0000 000"
          :invalid="!!error"
        />
        <ProfileField v-model="holder" label="Intestatario" autocomplete="name" />
        <p v-if="error" :class="$style.error" role="alert">{{ error }}</p>
        <ProfileButton type="submit" variant="primary" :class="$style.submit"
          >Vai alla commissione</ProfileButton
        >
      </template>
      <p v-else :class="$style.cardNotice" role="status">
        Il trasferimento su carta non è disponibile nella demo. Seleziona IBAN per continuare.
      </p>
    </form>
  </section>
</template>
<style module lang="scss" src="./styles/index.module.scss"></style>
