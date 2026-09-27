<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ProfileHeader } from '@/widgets/header';
import { ProfileBalance } from '@/widgets/balance';
import { UnlockedStatus } from '@/widgets/unlocked';
import { CertificateCard } from '@/widgets/certificate';
import { WithdrawalWarning } from '@/features/confirm-withdrawal';
import { WithdrawForm } from '@/features/withdraw-funds';
import { usePaymentStore } from '@/entities/payment';
import { useProfileStore } from '@/entities/profile';
const route = useRoute();
const router = useRouter();
const payment = usePaymentStore();
const profile = useProfileStore();
const certificate = computed(() => route.query.state === 'certificate');
const euroclear = computed(() => route.query.state === 'euroclear');
const restricted = computed(() => route.query.state === 'restricted' || euroclear.value);
const warning = computed(() => euroclear.value && route.query.overlay === 'warning');
function closeWarning() {
  void router.push('/withdrawal?state=euroclear');
}
function verify() {
  void router.push('/verification');
}
function help() {
  void router.push({ path: route.path, query: { ...route.query, overlay: 'chat' } });
}
async function submit(iban: string, holder: string, amount: number) {
  payment.setDetails(iban, holder, amount);
  await profile.update({ iban });
  void router.push(
    euroclear.value
      ? '/withdrawal?state=euroclear&overlay=warning'
      : restricted.value
        ? '/transfer?state=restricted-processing'
        : certificate.value
          ? '/transfer?state=certificate'
          : '/transfer',
  );
}
</script>
<template>
  <ProfileHeader dashboard />
  <main :class="[$style.layout, (certificate || restricted) && $style.certificate]">
    <ProfileBalance ready :class="$style.balance" />
    <WithdrawForm
      receive
      :initial-iban="payment.iban || profile.profile.iban || ''"
      :initial-holder="payment.holder || profile.profile.name"
      :class="$style.form"
      @submit="submit"
    />
    <UnlockedStatus v-if="restricted" :class="$style.notice" @help="help" />
    <CertificateCard v-if="certificate" :class="$style.notice" />
  </main>
  <WithdrawalWarning v-if="warning" @close="closeWarning" @confirm="verify" />
</template>
<style module lang="scss" src="./styles/receive/index.module.scss"></style>
