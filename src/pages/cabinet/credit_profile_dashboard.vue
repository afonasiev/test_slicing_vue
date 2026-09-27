<script setup lang="ts">
import { computed } from 'vue';
import { CertificateCard } from '@/widgets/certificate';
import { UnlockedStatus } from '@/widgets/unlocked';
import { useRoute, useRouter } from 'vue-router';
import { ProfileHeader } from '@/widgets/header';
import { ProfileProgress } from '@/widgets/progress';
import { ProfilePersonalData } from '@/widgets/personal-data';
import { ProfileChecklist } from '@/widgets/checklist';
import { ProfileBalance } from '@/widgets/balance';
import { ProfileLink, ProfileBadge, ProfileIcon } from '@/shared/ui';
import { routePaths } from '@/shared/config';
const router = useRouter();
const route = useRoute();
const state = computed(() => String(route.query.state ?? 'default'));
const completed = computed(() => route.name === 'home' && state.value !== 'default');
const certificate = computed(() => state.value.startsWith('certificate-'));
const unlocked = computed(() => ['restricted', 'euroclear'].includes(state.value));
const completedBasic = computed(() => state.value === 'completed');
const compactHome = computed(() => state.value === 'completed-compact');
const insurance = computed(() => state.value === 'insurance');
const showSummary = computed(() => !insurance.value && !unlocked.value);
const withdrawalTarget = computed(() => {
  if (state.value === 'certificate-ready') return '/certificate';
  if (certificate.value) return '/withdrawal?state=certificate';
  if (unlocked.value || insurance.value) return `/withdrawal?state=${state.value}`;
  return '/withdrawal';
});
function help() {
  void router.push({ path: route.path, query: { ...route.query, overlay: 'chat' } });
}
function navigate(destination: string) {
  void router.push(routePaths[destination] ?? '/');
}
</script>
<template>
  <ProfileHeader dashboard />
  <main
    :class="[
      $style.layout,
      insurance && $style.full,
      unlocked && $style.unlocked,
      completedBasic && $style.completedHome,
      compactHome && $style.compactHome,
    ]"
    aria-label="Home Avanti"
  >
    <div :class="$style.left">
      <ProfileProgress
        v-if="!completed || completedBasic"
        compact
        :completed="completed ? 5 : 3"
        :class="completedBasic && $style.mobileProgress"
        @navigate="navigate"
      />
      <ProfileBalance :ready="completed" :withdrawal-target="withdrawalTarget" />
      <ProfilePersonalData v-if="completedBasic" :class="$style.mobileDetails" />
      <ProfileChecklist v-if="completedBasic" :completed="5" @navigate="navigate" />
      <CertificateCard v-if="certificate" />
      <UnlockedStatus v-if="unlocked" @help="help" />
      <ProfileChecklist v-if="insurance" :completed="5" @navigate="navigate" />
      <section v-if="!completed" :class="$style.remaining">
        <span :class="$style.lock"><ProfileIcon name="locked" /></span>
        <header :class="$style.remainingTitle">
          <h2>Per il prelievo dei fondi, completa tutti gli step</h2>
          <p>Step ancora da completare</p>
        </header>
        <div :class="$style.remainingLinks">
          <ProfileLink to="/documents"
            ><span :class="$style.checkbox" aria-hidden="true" />Documenti</ProfileLink
          ><ProfileLink to="/contract"
            ><span :class="$style.checkbox" aria-hidden="true" />Firma</ProfileLink
          >
        </div>
        <ProfileBadge :class="$style.completed"
          >3 / 5<span :class="$style.desktopLabel">&nbsp;Completati</span></ProfileBadge
        >
      </section>
    </div>
    <aside v-if="!insurance" :class="$style.right" aria-label="Riepilogo richiesta">
      <ProfilePersonalData v-if="showSummary" compact :class="$style.summary" />
      <ProfileChecklist
        v-if="!completedBasic"
        compact
        :completed="completed ? 5 : 3"
        @navigate="navigate"
      />
    </aside>
  </main>
</template>
<style module lang="scss" src="./styles/dashboard/index.module.scss"></style>
