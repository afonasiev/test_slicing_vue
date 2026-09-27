<script setup lang="ts">
import { computed, ref, useTemplateRef, onBeforeUnmount, watch } from 'vue';
import { documentTypes, validateDocument } from '@/entities/documents';
import { ProfileIcon, ProfileBadge, ProfileButton, ProfileImage } from '@/shared/ui';
const props = withDefaults(defineProps<{ state?: string }>(), { state: 'default' });
const emit = defineEmits<{ verified: [] }>();
const selected = ref('');
const file = ref<File>();
const preview = ref('');
const error = ref('');
const busy = ref(false);
const verified = ref(false);
const input = useTemplateRef('input');
const complete = computed(() => verified.value || props.state === 'success');
const failure = computed(
  () =>
    error.value ||
    (props.state === 'error'
      ? 'Caricamento non riuscito. Controlla la connessione e riprova.'
      : ''),
);
const status = computed(() => (complete.value ? 'Verificato' : 'Da caricare'));
let generation = 0;
function clear() {
  generation++;
  if (preview.value) URL.revokeObjectURL(preview.value);
  preview.value = '';
  file.value = undefined;
  selected.value = '';
  verified.value = false;
  error.value = '';
  busy.value = false;
}
watch(() => props.state, clear);
onBeforeUnmount(clear);
function choose() {
  input.value?.click();
}
async function change(event: Event) {
  const target = event.target as HTMLInputElement;
  const chosen = target.files?.[0];
  target.value = '';
  if (!chosen) return;
  const current = ++generation;
  error.value = '';
  busy.value = true;
  try {
    await validateDocument(chosen);
    if (current !== generation) return;
    if (preview.value) URL.revokeObjectURL(preview.value);
    preview.value = URL.createObjectURL(chosen);
    file.value = chosen;
  } catch (cause) {
    if (current === generation)
      error.value = cause instanceof Error ? cause.message : 'Impossibile caricare il file.';
  } finally {
    if (current === generation) busy.value = false;
  }
}
function submit() {
  if (!file.value) {
    error.value = 'Scegli una foto del documento.';
    return;
  }
  verified.value = true;
  emit('verified');
}
</script>
<template>
  <section :class="$style.card" aria-label="Documenti richiesti">
    <h2 v-if="!complete" :class="$style.title">Documenti richiesti</h2>
    <div :class="$style.body">
      <div :class="$style.summary">
        <span :class="$style.icon"><ProfileIcon name="documentFile" /></span>
        <div :class="$style.description">
          <small v-if="!complete">Tipo di documento</small><strong>Documento d'identità</strong>
        </div>
        <ProfileBadge :class="$style.badge">{{ status }}</ProfileBadge>
      </div>
      <div v-if="complete" :class="$style.success" role="status">
        <span :class="$style.check"><ProfileIcon name="check" /></span>
        <h3>Documento verificato</h3>
        <p>Le foto sono leggibili e i dati corrispondono alla tua pratica.</p>
        <p>Puoi proseguire con la firma del contratto.</p>
        <p :class="$style.notice">
          Documenti verificati e accettati.<br />Non è più possibile caricarli di nuovo.
        </p>
      </div>
      <template v-else>
        <fieldset :class="$style.options">
          <legend>Scegli il tipo di documento</legend>
          <label v-for="option in documentTypes" :key="option.id" :class="$style.option">
            <span :class="$style.icon"><ProfileIcon name="documentCard" /></span>
            <span :class="$style.description"
              ><strong>{{ option.label }}</strong
              ><small>Una foto</small></span
            >
            <input v-model="selected" type="radio" name="document-type" :value="option.id" />
          </label>
        </fieldset>
        <input
          ref="input"
          :class="$style.fileInput"
          type="file"
          name="document-photo"
          accept="image/jpeg,image/png,image/webp"
          aria-label="Foto del documento"
          @change="change"
        />
        <div v-if="selected || state === 'error'" :class="$style.upload">
          <ProfileImage
            v-if="preview"
            :src="preview"
            alt="Anteprima del documento selezionato"
            :width="64"
            :height="48"
            :class="$style.preview"
          />
          <span>{{ file?.name || 'Foto del documento' }}</span>
          <ProfileButton :disabled="busy" @click="choose">{{
            file ? 'Sostituisci' : 'Scegli foto'
          }}</ProfileButton>
        </div>
        <p v-if="failure" :class="$style.error" role="alert">{{ failure }}</p>
        <ProfileButton
          v-if="selected || state === 'error'"
          :class="$style.submit"
          variant="primary"
          :disabled="busy"
          @click="submit"
          >Carica il documento</ProfileButton
        >
        <p :class="$style.hint">
          Formati accettati: JPG, PNG, WEBP · massimo 20 MB per file · I file restano nel tuo
          browser: partono insieme alla richiesta.
        </p>
      </template>
    </div>
  </section>
</template>
<style module lang="scss" src="./styles/index.module.scss"></style>
