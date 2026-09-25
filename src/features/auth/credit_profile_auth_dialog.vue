<script setup lang="ts">
import { computed, ref, watch, useTemplateRef, nextTick, useCssModule } from 'vue';
import { accountService } from '@/entities/account';
import {
  ProfileIcon,
  ProfileDialog,
  ProfileLogo,
  ProfileButton,
  ProfileLink,
  ProfileField,
  ProfilePasswordField,
} from '@/shared/ui';
defineOptions({ inheritAttrs: false });
const props = defineProps<{ mode: 'register' | 'login' }>();
const emit = defineEmits<{ close: []; authenticated: [email: string] }>();
const email = ref('');
const password = ref('');
const confirmation = ref('');
const error = ref('');
const styles = useCssModule();
const dialogClass = computed(() =>
  [styles.dialog, props.mode === 'login' && styles.login].filter(Boolean).join(' '),
);
const busy = ref(false);
const form = useTemplateRef('form');
const registering = computed(() => props.mode === 'register');
const autocomplete = computed(() => (registering.value ? 'new-password' : 'current-password'));
const tabs = computed(() => {
  const register = {
    to: '/auth/register',
    label: 'Crea account',
    current: registering.value ? ('page' as const) : undefined,
  };
  const login = {
    to: '/auth/login',
    label: 'Accedi',
    current: registering.value ? undefined : ('page' as const),
  };
  return [register, login];
});
watch(
  () => props.mode,
  () => {
    error.value = '';
    password.value = '';
    confirmation.value = '';
  },
);
async function submit() {
  if (busy.value) return;
  error.value = '';
  if (!form.value?.reportValidity()) return;
  if (password.value.length < 8) error.value = 'La password deve contenere almeno 8 caratteri.';
  else if (registering.value && password.value !== confirmation.value)
    error.value = 'Le password non coincidono.';
  if (error.value) {
    await nextTick();
    form.value?.querySelector<HTMLInputElement>('input[autocomplete$="password"]')?.focus();
    return;
  }
  busy.value = true;
  try {
    const account = await accountService.enter(email.value);
    password.value = '';
    confirmation.value = '';
    emit('authenticated', account.email);
  } catch (failure) {
    error.value = failure instanceof Error ? failure.message : 'Impossibile accedere. Riprova.';
  } finally {
    busy.value = false;
  }
}
function close() {
  emit('close');
}
</script>
<template>
  <ProfileDialog
    title="Crea il tuo account per gestire la tua pratica di credito."
    :dialog-class="dialogClass"
    @close="close"
  >
    <template #header="{ titleId }">
      <header :class="$style.header">
        <ProfileButton variant="plain" :class="$style.close" aria-label="Chiudi" @click="close"
          ><ProfileIcon name="close"
        /></ProfileButton>
        <ProfileLogo :class="$style.logo" />
        <h2 :id="titleId">Crea il tuo account per gestire la tua pratica di credito.</h2>
        <p>Spazio personale sicuro · SSL</p>
      </header>
    </template>
    <div :class="$style.body">
      <nav :class="$style.tabs" aria-label="Accesso account">
        <ProfileLink v-for="tab in tabs" :key="tab.to" :to="tab.to" :aria-current="tab.current">{{
          tab.label
        }}</ProfileLink>
      </nav>
      <form ref="form" :class="$style.form" @submit.prevent="submit">
        <ProfileField
          v-model="email"
          label="INDIRIZZO EMAIL"
          type="email"
          autocomplete="email"
          required
        />
        <ProfilePasswordField
          v-model="password"
          label="PASSWORD"
          :autocomplete="autocomplete"
          :invalid="!!error"
        />
        <ProfilePasswordField
          v-if="registering"
          v-model="confirmation"
          label="CONFERMA PASSWORD"
          autocomplete="new-password"
          :invalid="!!error"
        />
        <p v-if="error" :class="$style.error" role="alert">{{ error }}</p>
        <ProfileButton type="submit" variant="primary" :class="$style.submit" :disabled="busy"
          >Crea account e accedi ›</ProfileButton
        >
      </form>
      <p :class="$style.privacy">I tuoi dati sono protetti con crittografia</p>
    </div>
  </ProfileDialog>
</template>
<style module lang="scss" src="./styles/index.module.scss"></style>
