<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ProfileButton, ProfileBadge, ProfileIcon } from '@/shared/ui';
const route = useRoute();
const router = useRouter();
const completed = computed(() => !!route.query.state && route.query.state !== 'default');
function withdraw() {
  void router.push('/withdrawal');
}
</script>
<template>
  <section :class="$style.card" aria-label="Saldo disponibile">
    <header>
      <div>
        <p>Il tuo saldo</p>
        <h1>Importo approvato dai nostri partner</h1>
      </div>
      <ProfileBadge :class="$style.badge">{{
        completed ? 'Disponibile' : 'Completa i passaggi'
      }}</ProfileBadge>
    </header>
    <div>
      <strong :class="$style.amount">€ 12 000</strong>
      <p :class="$style.description">Prestito personale • TAN 3,8%</p>
    </div>
    <ProfileButton :disabled="!completed" :class="$style.withdraw" @click="withdraw"
      ><ProfileIcon name="bank" />Preleva i fondi →</ProfileButton
    >
    <p :class="$style.note">Fondi disponibili dopo l'approvazione dei documenti</p>
  </section>
</template>
<style module lang="scss" src="./styles/index.module.scss"></style>
