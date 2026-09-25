<script setup lang="ts">
import { reactive, ref, useTemplateRef } from 'vue';
import { useApplicationStore } from '@/entities/application';
import { ProfileButton, ProfileField, ProfileSelect } from '@/shared/ui';
const emit = defineEmits<{ saved: [] }>();
const store = useApplicationStore();
const draft = reactive({ ...store.application });
const form = useTemplateRef('form');
const error = ref('');
const documentOptions = [
  { value: 'passport', label: 'Passaporto' },
  { value: 'identity', label: 'Carta d’identità nazionale' },
  { value: 'license', label: 'Patente di guida' },
  { value: 'residence', label: 'Permesso di soggiorno' },
  { value: 'other', label: 'Altro documento ufficiale' },
];
function male() {
  draft.gender = 'male';
}
function female() {
  draft.gender = 'female';
}
async function save() {
  if (!form.value?.reportValidity()) return false;
  if (!draft.firstName.trim() || !draft.lastName.trim()) {
    error.value = 'Inserisci il tuo nome e cognome.';
    form.value.querySelector<HTMLInputElement>('input')?.focus();
    return false;
  }
  error.value = '';
  await store.update({
    ...draft,
    firstName: draft.firstName.trim(),
    lastName: draft.lastName.trim(),
  });
  emit('saved');
  return true;
}
defineExpose({ save });
</script>
<template>
  <form ref="form" :class="$style.form" @submit.prevent="save">
    <header :class="$style.heading">
      <p>Dati personali</p>
      <h1>Dicci chi sei</h1>
    </header>
    <div :class="$style.names">
      <ProfileField
        v-model="draft.lastName"
        :class="$style.field"
        label="Cognome"
        autocomplete="family-name"
        placeholder="Inserisci il tuo cognome"
        required
      />
      <ProfileField
        v-model="draft.firstName"
        :class="$style.field"
        label="Nome"
        autocomplete="given-name"
        placeholder="Inserisci il tuo nome"
        required
      />
    </div>
    <div
      :class="$style.gender"
      role="group"
      aria-labelledby="gender-label"
      aria-describedby="gender-description"
    >
      <div>
        <p id="gender-label" :class="$style.label">Sesso</p>
        <p id="gender-description" :class="$style.description">
          Serve per personalizzare l'animazione del prelievo.
        </p>
      </div>
      <div :class="$style.choices">
        <ProfileButton
          :class="[$style.choice, draft.gender === 'male' && $style.selected]"
          :aria-pressed="draft.gender === 'male'"
          @click="male"
          ><span aria-hidden="true">♂</span>Uomo</ProfileButton
        >
        <ProfileButton
          :class="[$style.choice, draft.gender === 'female' && $style.selected]"
          :aria-pressed="draft.gender === 'female'"
          @click="female"
          ><span aria-hidden="true">♀</span>Donna</ProfileButton
        >
      </div>
    </div>
    <ProfileSelect
      v-model="draft.documentType"
      :class="$style.document"
      label="Tipo di documento"
      placeholder="Seleziona il tipo"
      :options="documentOptions"
      required
    />
    <p :class="$style.consent">
      <span aria-hidden="true">i</span>Acconsento al trattamento dei miei dati personali per la
      verifica della richiesta.
    </p>
    <p v-if="error" role="alert">{{ error }}</p>
    <slot />
  </form>
</template>
<style module lang="scss" src="./styles/index.module.scss"></style>
