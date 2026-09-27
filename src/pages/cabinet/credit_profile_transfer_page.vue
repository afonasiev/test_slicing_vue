<script setup lang="ts">
import { computed, ref, watch, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ProfileHeader } from '@/widgets/header';
import { ProfileBalance } from '@/widgets/balance';
import { UnlockedStatus } from '@/widgets/unlocked';
import { RestrictionDialog } from '@/features/account-restriction';
import { CertificateCard } from '@/widgets/certificate';
import { TransferStatus } from '@/widgets/transfer';
import { useTransferStore, usePaymentStore } from '@/entities/payment';
import { useProfileStore } from '@/entities/profile';
import { ProfileDialog, ProfileButton } from '@/shared/ui';
const props = defineProps<{ forceInterrupted?: boolean }>();
const route = useRoute();
const router = useRouter();
const transfer = useTransferStore();
const payment = usePaymentStore();
const profile = useProfileStore();
const certificate = computed(() => route.query.state === 'certificate');
const restricted = computed(() => String(route.query.state).startsWith('restricted'));
const restrictionOpen = computed(() => route.query.state === 'restricted');
const instructions = computed(() => route.query.overlay === 'instructions');
const coordinates = ref(false);
function restrict() {
  void router.push('/transfer?state=restricted');
}
function closeRestriction() {
  void router.push('/transfer?state=restricted-processing');
}
function showInstructions() {
  void router.push('/transfer?state=restricted&overlay=instructions');
}
function help() {
  void router.push({ path: route.path, query: { ...route.query, overlay: 'chat' } });
}
const interrupted = computed(
  () => props.forceInterrupted || route.query.state === 'interrupted' || restrictionOpen.value,
);
const iban = computed(() => payment.iban || profile.profile.iban || '—');
const holder = computed(() => payment.holder || profile.profile.name);
watch(
  () => route.query.state,
  () => {
    transfer.reset();
    coordinates.value = false;
  },
);
const interval = window.setInterval(transfer.advance, 1000);
onBeforeUnmount(() => {
  window.clearInterval(interval);
  transfer.pause();
});
function action() {
  if (restricted.value) restrict();
  else if (interrupted.value) void router.push('/commission?state=insurance');
  else coordinates.value = true;
}
function close() {
  coordinates.value = false;
}
</script>
<template>
  <ProfileHeader dashboard />
  <main
    :class="[$style.layout, (certificate || restricted || forceInterrupted) && $style.certificate]"
  >
    <ProfileBalance
      ready
      :compact="certificate"
      :pending-certificate="certificate"
      :class="$style.balance"
    />
    <TransferStatus
      :certificate="certificate"
      :compact="restricted || forceInterrupted"
      :class="$style.status"
      :interrupted="interrupted"
      :percentage="transfer.percentage"
      :amount="payment.amount"
      @action="action"
    />
    <UnlockedStatus v-if="restricted" :class="$style.unlocked" @help="help" />
    <CertificateCard v-if="certificate" :class="$style.notice" />
  </main>
  <RestrictionDialog
    v-if="restrictionOpen"
    :instructions="instructions"
    @close="closeRestriction"
    @back="restrict"
    @instructions="showInstructions"
  />
  <ProfileDialog v-if="coordinates" title="Le mie coordinate" @close="close">
    <dl :class="$style.details">
      <dt>Intestatario</dt>
      <dd>{{ holder }}</dd>
      <dt>IBAN</dt>
      <dd>{{ iban }}</dd>
    </dl>
    <ProfileButton variant="primary" @click="close">Chiudi</ProfileButton>
  </ProfileDialog>
</template>
<style module lang="scss" src="./styles/transfer/index.module.scss"></style>
