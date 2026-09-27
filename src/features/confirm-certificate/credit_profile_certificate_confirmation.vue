<script setup lang="ts">
import { ref } from 'vue';
import { ProfileDialog, ProfileButton, ProfileIcon } from '@/shared/ui';
const emit = defineEmits<{ close: []; confirm: [] }>();
const checked = ref(false);
function close() {
  emit('close');
}
function confirm() {
  if (checked.value) emit('confirm');
}
</script>
<template>
  <ProfileDialog
    title="Conferma di aver visto il certificato"
    :dialog-class="$style.dialog"
    @close="close"
  >
    <template #header="{ titleId }"
      ><header :class="$style.header">
        <ProfileIcon name="certificateShield" />
        <div>
          <p>Conferma Visione</p>
          <h2 :id="titleId">Conferma di aver visto il certificato</h2>
        </div>
      </header></template
    >
    <p :class="$style.description">
      Hai consultato il certificato CPI. Spunta la casella per confermare e sbloccare il prelievo.
    </p>
    <label :class="$style.checkbox"
      ><input v-model="checked" type="checkbox" name="certificate-confirmation" /><span
        >Conferma di aver visto e consultato il certificato CPI</span
      ></label
    >
    <ProfileButton variant="primary" :disabled="!checked" :class="$style.confirm" @click="confirm"
      >Conferma</ProfileButton
    >
  </ProfileDialog>
</template>
<style module lang="scss" src="./styles/index.module.scss"></style>
