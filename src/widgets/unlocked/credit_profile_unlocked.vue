<script setup lang="ts">
import { ProfileButton, ProfileIcon } from '@/shared/ui';
const emit = defineEmits<{ help: [] }>();
const steps = [
  {
    icon: 'unlockDatabase',
    title: 'Verifica completata',
    text: 'I Suoi dati sono stati verificati con successo.',
  },
  { icon: 'unlockLock', title: 'Account sbloccato', text: 'Il Suo account è stato sbloccato.' },
  {
    icon: 'unlockWallet',
    title: 'Prelievo disponibile',
    text: 'Può effettuare il prelievo dei fondi quando desidera.',
  },
] as const;
function help() {
  emit('help');
}
</script>
<template>
  <section :class="$style.card">
    <header>
      <h2>SBLOCCO DEI<br />FONDI COMPLETATO</h2>
      <ProfileButton variant="plain" @click="help">Hai bisogno di aiuto?</ProfileButton>
    </header>
    <ol>
      <li v-for="step in steps" :key="step.icon">
        <span><ProfileIcon :name="step.icon" /></span>
        <h3>{{ step.title }}</h3>
        <p>{{ step.text }}</p>
      </li>
    </ol>
  </section>
</template>
<style module lang="scss" src="./styles/index.module.scss"></style>
