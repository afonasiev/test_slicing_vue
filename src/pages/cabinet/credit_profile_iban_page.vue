<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { IbanDialog } from '@/features/confirm-iban';
import { useContractStore } from '@/entities/contract';
import { useProfileStore } from '@/entities/profile';
import { useMediaQuery } from '@/shared/lib/media';
import DocumentsPage from './credit_profile_documents_page.vue';
import Dashboard from './credit_profile_dashboard.vue';
const mobile = useMediaQuery('(max-width: 767px)');
const route = useRoute();
const router = useRouter();
const contract = useContractStore();
const profile = useProfileStore();
const verification = computed(() => route.query.state === 'verification');
function close() {
  void router.push('/documents?state=success');
}
function edit() {
  void router.replace({ name: 'iban' });
}
function verify(value: string) {
  contract.iban = value;
  void router.push({ name: 'iban', query: { state: 'verification' } });
}
async function confirm(value: string) {
  contract.iban = value;
  await profile.update({ iban: value });
  void router.push('/contract');
}
</script>
<template>
  <DocumentsPage v-if="mobile" preset="success" /><Dashboard v-else /><IbanDialog
    :verification="verification"
    :value="contract.iban"
    @close="close"
    @edit="edit"
    @verify="verify"
    @confirmed="confirm"
  />
</template>
