<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ProfileHeader } from '@/widgets/header';
import { ProfileProgress } from '@/widgets/progress';
import { DocumentUpload } from '@/features/upload-document';
import { ContractDocument } from '@/entities/contract';
import { ProfileDialog, ProfileButton, ProfileLink, ProfileIcon } from '@/shared/ui';
import { useMediaQuery } from '@/shared/lib/media';
import { contractPdf } from '@/shared/assets';
import Dashboard from './credit_profile_dashboard.vue';
const props = defineProps<{ preset?: string }>();
const mobile = useMediaQuery('(max-width: 767px)');
const route = useRoute();
const router = useRouter();
const state = computed(() => String(props.preset ?? route.query.state ?? 'default'));
function close() {
  void router.push('/');
}
function verified() {
  void router.replace({ name: 'documents', query: { state: 'success' } });
}
function navigate() {
  void router.push('/documents');
}
</script>
<template>
  <template v-if="!mobile">
    <Dashboard />
    <ProfileDialog title="Documenti richiesti" :dialog-class="$style.dialog" @close="close">
      <template #header
        ><ProfileButton :class="$style.close" variant="plain" aria-label="Chiudi" @click="close"
          ><ProfileIcon name="close" /></ProfileButton
      ></template>
      <DocumentUpload :state="state" @verified="verified" />
      <ProfileLink v-if="state === 'success'" :class="$style.next" to="/documents/iban"
        >Continua — IBAN</ProfileLink
      >
    </ProfileDialog>
  </template>
  <template v-else>
    <ProfileHeader dashboard />
    <main :class="$style.mobile">
      <ProfileProgress compact @navigate="navigate" />
      <h1>I tuoi documenti</h1>
      <DocumentUpload :state="state" @verified="verified" />
      <div :class="$style.banner">
        Documento d'identità verificato:<br />la sezione è nel tuo profilo.<ProfileLink
          to="/profile"
          >Apri il profilo</ProfileLink
        >
      </div>
      <section :class="$style.contract">
        <div>
          <small>Firma dei documenti</small>
          <h2>Contratto di credito</h2>
        </div>
        <ProfileLink to="/documents/iban">Inserisci IBAN</ProfileLink
        ><ProfileLink :href="contractPdf" target="_blank" rel="noopener">Apri PDF</ProfileLink
        ><ProfileLink to="/contract?overlay=signature">Firma il contratto</ProfileLink>
      </section>
      <ContractDocument :class="$style.document" />
      <div :class="$style.banner">Documento caricato<br />Documento d’identità</div>
    </main>
  </template>
</template>
<style module lang="scss" src="./styles/documents/index.module.scss"></style>
