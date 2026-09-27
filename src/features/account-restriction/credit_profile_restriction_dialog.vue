<script setup lang="ts">
import { ref } from 'vue';
import { ProfileDialog, ProfileButton, ProfileBadge, ProfileIcon } from '@/shared/ui';
defineProps<{ instructions: boolean }>();
const emit = defineEmits<{ close: []; instructions: []; back: [] }>();
const message = ref('');
const steps = [
  'Apri App Store (iPhone) o Play Store (Android)',
  'Cerca Telegram nella barra di ricerca',
  'Clicca su Scarica o Installa',
  'Clicca sul pulsante: Contatta il direttore finanziario',
];
function close() {
  emit('close');
}
function instructionsOpen() {
  emit('instructions');
}
function back() {
  emit('back');
}
function contact() {
  message.value = 'Demo: il contatto del direttore finanziario non è configurato.';
}
</script>
<template>
  <ProfileDialog
    :title="
      instructions ? 'Istruzioni per l’installazione di Telegram' : 'Accesso all’account limitato'
    "
    :dialog-class="instructions ? $style.instructions : $style.dialog"
    @close="close"
  >
    <template #header="{ titleId }">
      <ProfileButton :class="$style.close" variant="plain" aria-label="Chiudi" @click="close"
        ><ProfileIcon name="close"
      /></ProfileButton>
      <ProfileBadge v-if="!instructions" :class="$style.error">ERRORE</ProfileBadge>
      <div :class="instructions && $style.instructionHeader">
        <ProfileIcon v-if="instructions" name="telegram" />
        <h2 :id="titleId">
          {{
            instructions
              ? 'Istruzioni per l’installazione di Telegram'
              : 'Accesso all’account limitato'
          }}
        </h2>
      </div>
    </template>
    <template v-if="instructions">
      <p>Se non hai l’applicazione Telegram, scaricala seguendo queste istruzioni:</p>
      <ol>
        <li v-for="(step, index) in steps" :key="step">
          <ProfileBadge>{{ index + 1 }}</ProfileBadge
          ><span>{{ step }}</span>
        </li>
      </ol>
    </template>
    <p v-else :class="$style.warning">
      <ProfileIcon name="transferInfo" /><span
        >Il tuo account è temporaneamente congelato dal Dipartimento di Monitoraggio Finanziario;
        per maggiori informazioni contatta il direttore finanziario.</span
      >
    </p>
    <ProfileButton variant="primary" :class="$style.action" @click="contact"
      >Contatta il direttore finanziario</ProfileButton
    >
    <ProfileButton v-if="instructions" :class="$style.back" @click="back">Indietro</ProfileButton>
    <ProfileButton v-else variant="plain" :class="$style.help" @click="instructionsOpen"
      >Non hai Telegram?</ProfileButton
    >
    <p v-if="message" role="status">{{ message }}</p>
  </ProfileDialog>
</template>
<style module lang="scss" src="./styles/index.module.scss"></style>
