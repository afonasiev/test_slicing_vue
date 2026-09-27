<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ProfileHeader } from '@/widgets/header';
import { ProfileBalance } from '@/widgets/balance';
import { ProfileChecklist } from '@/widgets/checklist';
import { CertificateCard, CertificateViewer } from '@/widgets/certificate';
import { CertificateConfirmation } from '@/features/confirm-certificate';
import { ProfileDialog } from '@/shared/ui';
import { useMediaQuery } from '@/shared/lib/media';
import { routePaths } from '@/shared/config';
const mobile = useMediaQuery('(max-width: 767px)');
const route = useRoute();
const router = useRouter();
const confirming = computed(() => route.query.state === 'confirm');
function askConfirmation() {
  void router.push('/certificate?state=confirm');
}
function cancel() {
  void router.push('/certificate');
}
function confirm() {
  void router.push('/withdrawal?state=certificate');
}
function navigate(destination: string) {
  void router.push(routePaths[destination] ?? '/');
}
</script>
<template>
  <ProfileHeader dashboard />
  <main v-if="!mobile" :class="$style.layout">
    <div :class="$style.column"><ProfileBalance ready /><CertificateCard /></div>
    <ProfileChecklist compact :completed="5" @navigate="navigate" />
  </main>
  <main v-if="mobile" :class="$style.mobile"><CertificateViewer @close="askConfirmation" /></main>
  <ProfileDialog
    v-else
    title="Certificato CPI"
    :dialog-class="$style.viewerDialog"
    @close="askConfirmation"
    ><template #header><span /></template><CertificateViewer @close="askConfirmation"
  /></ProfileDialog>
  <CertificateConfirmation v-if="confirming" @close="cancel" @confirm="confirm" />
</template>
<style module lang="scss" src="./styles/certificate/index.module.scss"></style>
