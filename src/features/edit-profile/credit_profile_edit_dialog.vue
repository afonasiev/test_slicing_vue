<script setup lang="ts">
import type { ProfileEditKind } from './types';
import { computed, ref } from 'vue';
import { profileService, useProfileStore } from '@/entities/profile';
import { ProfileButton, ProfileDialog, ProfileField } from '@/shared/ui';
const props = defineProps<{ kind: ProfileEditKind }>();
const emit = defineEmits<{ close: []; saved: [message: string] }>();
const store = useProfileStore();
const titles = { name: 'Modifica nome', email: 'Cambia email', password: 'Cambia password' };
const title = computed(() => titles[props.kind]);
const value = ref(
  props.kind === 'name' ? store.profile.name : props.kind === 'email' ? store.profile.email : '',
);
const confirmation = ref('');
const error = ref('');
const busy = ref(false);
function close() {
  if (!busy.value) emit('close');
}
async function save() {
  if (busy.value) return;
  error.value = '';
  if (props.kind === 'password' && value.value !== confirmation.value) {
    error.value = 'Le password non coincidono.';
    return;
  }
  busy.value = true;
  try {
    if (props.kind === 'password') await profileService.changePassword(value.value);
    else await store.update({ [props.kind]: value.value.trim() });
    value.value = '';
    confirmation.value = '';
    emit('saved', 'Modifiche salvate.');
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Impossibile salvare. Riprova.';
  } finally {
    busy.value = false;
  }
}
</script>
<template>
  <ProfileDialog :title="title" @close="close">
    <form :class="$style.form" novalidate @submit.prevent="save">
      <ProfileField v-if="kind === 'name'" v-model="value" label="Nome" autocomplete="name" />
      <ProfileField
        v-else-if="kind === 'email'"
        v-model="value"
        label="Email"
        type="email"
        autocomplete="email"
      />
      <template v-else
        ><ProfileField
          v-model="value"
          label="Nuova password"
          type="password"
          autocomplete="new-password"
        />
        <ProfileField
          v-model="confirmation"
          label="Conferma password"
          type="password"
          autocomplete="new-password"
        />
        <p :class="$style.hint">Almeno 8 caratteri.</p>
      </template>
      <p v-if="error" :class="$style.error" role="alert">{{ error }}</p>
      <div :class="$style.actions">
        <ProfileButton :disabled="busy" @click="close">Annulla</ProfileButton>
        <ProfileButton type="submit" variant="primary" :disabled="busy">Salva</ProfileButton>
      </div>
    </form>
  </ProfileDialog>
</template>
<style module lang="scss">
.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}
.error {
  font-size: 13px;
  color: #b42318;
}
.hint {
  font-size: 12px;
  color: var(--muted);
}
</style>
