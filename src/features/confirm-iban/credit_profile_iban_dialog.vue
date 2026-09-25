<script setup lang="ts">
import { computed, ref } from 'vue';
import { isValidIban, normalizeIban } from '@/entities/documents';
import { ProfileDialog, ProfileLogo, ProfileButton, ProfileField, ProfileIcon } from '@/shared/ui';
const props = defineProps<{ verification: boolean; value: string }>();
const emit = defineEmits<{
  close: [];
  verify: [value: string];
  edit: [];
  confirmed: [value: string];
}>();
const input = ref(props.value);
const error = ref('');
const formatted = computed(() =>
  (props.value || 'IT00X000000000000000000000000').replace(/(.{4})/g, '$1 ').trim(),
);
function close() {
  emit('close');
}
function edit() {
  emit('edit');
}
function submit() {
  const iban = normalizeIban(input.value);
  if (!isValidIban(iban)) {
    error.value = 'Inserisci un IBAN valido.';
    return;
  }
  error.value = '';
  emit('verify', iban);
}
function confirm() {
  if (!isValidIban(props.value)) {
    error.value = 'Inserisci un IBAN valido prima di confermare.';
    return;
  }
  emit('confirmed', props.value);
}
function normalize() {
  input.value = normalizeIban(input.value);
}
</script>
<template>
  <ProfileDialog title="IBAN per l’accredito" :dialog-class="$style.dialog" @close="close">
    <template #header="{ titleId }">
      <header :class="$style.header">
        <ProfileButton :class="$style.close" variant="plain" aria-label="Chiudi" @click="close"
          ><ProfileIcon name="close"
        /></ProfileButton>
        <ProfileLogo :class="$style.logo" />
        <h2 :id="titleId">IBAN per l’accredito</h2>
        <p>
          Su questo conto la banca partner versa l’importo del credito.<br />Compare nel contratto
          al posto della riga vuota.
        </p>
      </header>
    </template>
    <ol :class="$style.steps">
      <li :class="!verification && $style.active">1<br />Conto</li>
      <li :class="verification && $style.active">2<br />Verifica</li>
    </ol>
    <form v-if="!verification" :class="$style.form" novalidate @submit.prevent="submit">
      <ProfileField
        v-model="input"
        label="IBAN"
        placeholder="IT00 X000 0000 0000 0000 0000 000"
        required
        :invalid="!!error"
        @input="normalize"
      />
      <p :class="$style.note">
        <ProfileIcon name="info" /><span
          >Lettere e cifre. Il campo si ferma alla lunghezza del paese: 27 per l’Italia.<br /><br />Del
          numero conserviamo solo l’inizio e la fine: il resto resta nascosto.</span
        >
      </p>
      <p v-if="error" :class="$style.error" role="alert">{{ error }}</p>
      <ProfileButton type="submit" variant="primary" :class="$style.submit">Continua</ProfileButton>
    </form>
    <div v-else :class="$style.form">
      <div :class="$style.confirmation">
        <h3>Controlla il numero</h3>
        <p>{{ formatted }}</p>
      </div>
      <p :class="$style.note">
        <ProfileIcon name="info" /><span
          >Un numero errato manda i fondi su un altro conto:<br />la banca non può annullare il
          bonifico.</span
        >
      </p>
      <p v-if="error" :class="$style.error" role="alert">{{ error }}</p>
      <div :class="$style.actions">
        <ProfileButton @click="edit">Modifica</ProfileButton
        ><ProfileButton variant="primary" @click="confirm">Conferma</ProfileButton>
      </div>
    </div>
  </ProfileDialog>
</template>
<style module lang="scss" src="./styles/index.module.scss"></style>
