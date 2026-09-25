<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { CommissionDialog } from '@/features/pay-commission';
import { useMediaQuery } from '@/shared/lib/media';
import WithdrawalPage from './credit_profile_withdrawal_page.vue';
import Dashboard from './credit_profile_dashboard.vue';
const mobile = useMediaQuery('(max-width: 767px)');
const route = useRoute();
const router = useRouter();
const coordinates = computed(() => route.query.overlay === 'coordinates');
function close() {
  void router.push('/');
}
function back() {
  void router.push(coordinates.value ? '/commission' : '/withdrawal');
}
function next() {
  void router.push({ name: 'commission', query: { overlay: 'coordinates' } });
}
</script>
<template>
  <WithdrawalPage v-if="mobile" /><Dashboard v-else /><CommissionDialog
    :key="String(coordinates)"
    :coordinates="coordinates"
    @close="close"
    @back="back"
    @next="next"
  />
</template>
