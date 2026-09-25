<script setup lang="ts">
import type { ProfileEditKind } from './types';
import { computed, ref, useCssModule } from 'vue';
import { profileService, useProfileStore } from '@/entities/profile';
import {
  ProfileButton,
  ProfileDialog,
  ProfileField,
  ProfilePasswordField,
  ProfileLogo,
  ProfileIcon,
} from '@/shared/ui';
const props = defineProps<{ kind: ProfileEditKind }>();
const emit = defineEmits<{ close: []; saved: [message: string] }>();
const store = useProfileStore();
const styles = useCssModule();
const titles = {
  name: 'Modifica nome e cognome',
  email: 'Cambia indirizzo email',
  password: 'Cambia password',
};
const descriptions = {
  name: 'Questi dati compaiono nella scheda cliente\ne nel contratto',
  email:
    'Ti invieremo un codice di conferma al nuovo indirizzo.\nL’email può essere cambiata una sola volta.',
  password: 'Scegli una password sicura\ndi almeno 8 caratteri',
};
const title = computed(() => titles[props.kind]);
const description = computed(() => descriptions[props.kind]);
const dialogClass = computed(() => `${styles.dialog} ${styles[props.kind]}`);
const value = ref(
  props.kind === 'name' ? store.profile.name : props.kind === 'email' ? store.profile.email : '',
);
const surname = ref(store.profile.surname);
const currentPassword = ref('');
const confirmation = ref('');
const error = ref('');
const busy = ref(false);
function close() {
  if (!busy.value) emit('close');
}
async function save() {
  if (busy.value) return;
  error.value = '';
  if (props.kind === 'password') {
    if (!currentPassword.value) error.value = 'Inserisci la password attuale.';
    else if (value.value.length < 8) error.value = 'La password deve contenere almeno 8 caratteri.';
    else if (value.value !== confirmation.value) error.value = 'Le password non coincidono.';
    if (error.value) return;
  }
  busy.value = true;
  try {
    if (props.kind === 'password') await profileService.changePassword(value.value);
    else if (props.kind === 'name')
      await store.update({ name: value.value.trim(), surname: surname.value.trim() });
    else await store.update({ email: value.value.trim() });
    value.value = '';
    confirmation.value = '';
    currentPassword.value = '';
    emit('saved', 'Modifiche salvate.');
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Impossibile salvare. Riprova.';
  } finally {
    busy.value = false;
  }
}
</script>
<template>
  <ProfileDialog :title="title" :dialog-class="dialogClass" @close="close">
    <template #header="{ titleId }">
      <header :class="$style.header">
        <ProfileButton variant="plain" :class="$style.close" aria-label="Chiudi" @click="close"
          ><ProfileIcon name="close"
        /></ProfileButton>
        <ProfileLogo :class="$style.logo" />
        <h2 :id="titleId">{{ title }}</h2>
        <p>{{ description }}</p>
      </header>
    </template>
    <form :class="$style.form" novalidate @submit.prevent="save">
      <template v-if="kind === 'name'">
        <ProfileField v-model="surname" label="Cognome" autocomplete="family-name" required />
        <ProfileField v-model="value" label="Nome" autocomplete="given-name" required />
      </template>
      <div v-else-if="kind === 'email'" :class="$style.group">
        <ProfileField v-model="value" label="Email" type="email" autocomplete="email" required />
        <p :class="$style.hint">
          <ProfileIcon name="info" />Useremo questa email per le comunicazioni sul credito.
        </p>
      </div>
      <template v-else>
        <ProfilePasswordField
          v-model="currentPassword"
          label="Password attuale"
          autocomplete="current-password"
        />
        <div :class="$style.group">
          <ProfilePasswordField
            v-model="value"
            label="Nuova password"
            autocomplete="new-password"
          />
          <p :class="$style.hint"><ProfileIcon name="info" />Minimo 8 caratteri.</p>
        </div>
        <ProfilePasswordField
          v-model="confirmation"
          label="Conferma nuova password"
          autocomplete="new-password"
        />
      </template>
      <p v-if="error" :class="$style.error" role="alert">{{ error }}</p>
      <div :class="$style.actions">
        <ProfileButton :disabled="busy" @click="close">Annulla</ProfileButton>
        <ProfileButton type="submit" variant="primary" :disabled="busy">Salva</ProfileButton>
      </div>
    </form>
  </ProfileDialog>
</template>
<style module lang="scss" src="./styles/index.module.scss"></style>
