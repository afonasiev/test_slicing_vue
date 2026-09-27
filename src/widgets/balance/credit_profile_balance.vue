<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ProfileButton, ProfileBadge, ProfileIcon, ProfileLink } from '@/shared/ui';
const props = defineProps<{
  ready?: boolean;
  compact?: boolean;
  pendingCertificate?: boolean;
  withdrawalTarget?: string;
}>();
const route = useRoute();
const router = useRouter();
const completed = computed(
  () => props.ready || (!!route.query.state && route.query.state !== 'default'),
);
function withdraw() {
  void router.push(
    props.withdrawalTarget ?? (props.ready ? '/withdrawal?state=insurance' : '/withdrawal'),
  );
}
</script>
<template>
  <section
    :class="[$style.card, ready && $style.ready, compact && $style.compact]"
    aria-label="Saldo disponibile"
  >
    <header>
      <div>
        <p>Il tuo saldo</p>
        <h1>Importo approvato dai nostri partner</h1>
      </div>
      <ProfileBadge :class="$style.badge">{{
        pendingCertificate
          ? 'Attesa emissione certificato'
          : ready
            ? 'Pronto al prelievo'
            : completed
              ? 'Disponibile'
              : 'Completa i passaggi'
      }}</ProfileBadge>
    </header>
    <div :class="$style.balanceRow">
      <div>
        <strong :class="$style.amount">€ 12 000</strong>
        <p :class="$style.description">
          {{ ready ? 'Credito approvato • TAN 3,8%' : 'Prestito personale • TAN 3,8%' }}
        </p>
      </div>
      <ProfileLink v-if="ready" to="/contract" :class="$style.loan">Prestito</ProfileLink>
    </div>
    <ProfileButton :disabled="!completed" :class="$style.withdraw" @click="withdraw"
      ><ProfileIcon name="bank" />Preleva i fondi →</ProfileButton
    >
    <p :class="[$style.note, ready && $style.readyNote]">
      Fondi disponibili dopo l'approvazione dei documenti
    </p>
  </section>
</template>
<style module lang="scss" src="./styles/index.module.scss"></style>
