<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ProfileHeader } from '@/widgets/header';
import { ProfileProgress } from '@/widgets/progress';
import { ProfilePersonalData } from '@/widgets/personal-data';
import { ProfileChecklist } from '@/widgets/checklist';
import { SignatureDialog } from '@/features/sign-contract';
import { ContractDocument, useContractStore } from '@/entities/contract';
import { useProfileStore } from '@/entities/profile';
import { ProfileButton, ProfileLink, ProfileIcon } from '@/shared/ui';
import { contractPdf } from '@/shared/assets';
import { routePaths } from '@/shared/config';
const route = useRoute();
const router = useRouter();
const contract = useContractStore();
const profile = useProfileStore();
const signing = computed(() => route.query.overlay === 'signature');
const maskedIban = computed(() =>
  contract.iban
    ? `${contract.iban.slice(0, 4)} •••• •••• •••• ${contract.iban.slice(-4)}`
    : undefined,
);
function navigate(destination: string) {
  void router.push(routePaths[destination] ?? '/');
}
function sign() {
  void router.push({ name: 'contract', query: { overlay: 'signature' } });
}
function close() {
  void router.replace({ name: 'contract' });
}
function signed(image: string) {
  contract.signature = image;
  close();
}
</script>
<template>
  <ProfileHeader dashboard />
  <main :class="$style.layout">
    <div :class="$style.main">
      <ProfileProgress compact :completed="4" @navigate="navigate" />
      <h1>I tuoi documenti</h1>
      <div :class="$style.banner">
        <ProfileIcon name="check" />
        <p>Documento d'identità verificato: la sezione è nel tuo profilo.</p>
        <ProfileLink to="/profile">Apri il profilo</ProfileLink>
      </div>
      <section :class="$style.card">
        <div>
          <small>Firma dei documenti</small>
          <h2>Contratto di credito</h2>
        </div>
        <ProfileLink :href="contractPdf" target="_blank" rel="noopener">Apri PDF</ProfileLink
        ><ProfileLink to="/documents/iban">IBAN inserito</ProfileLink
        ><ProfileButton variant="primary" :disabled="!!contract.signature" @click="sign">{{
          contract.signature ? 'Contratto firmato' : 'Firma il contratto'
        }}</ProfileButton>
      </section>
      <div>
        <ContractDocument
          :name="profile.profile.name"
          :email="profile.profile.email"
          :iban="maskedIban"
          :signature="contract.signature"
        />
      </div>
      <p v-if="contract.signature" role="status" :class="$style.banner">
        Contratto firmato con successo.
      </p>
      <div :class="$style.banner">
        <ProfileIcon name="check" />
        <p>Documento caricato<br /><strong>Documento d’identità</strong></p>
      </div>
    </div>
    <aside :class="$style.aside">
      <ProfilePersonalData compact /><ProfileChecklist
        compact
        :completed="4"
        @navigate="navigate"
      />
    </aside>
  </main>
  <SignatureDialog v-if="signing" @close="close" @signed="signed" />
</template>
<style module lang="scss" src="./styles/contract/index.module.scss"></style>
