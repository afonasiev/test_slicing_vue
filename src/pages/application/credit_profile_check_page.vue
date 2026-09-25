<script setup lang="ts">
import { onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ApplicationShell, ApplicationNavigation } from '@/widgets/application-shell';
import { BankCheck } from '@/widgets/bank-check';
import { useBankCheckStore } from '@/entities/application';
const router = useRouter();
const check = useBankCheckStore();
const label = computed(() =>
  check.running ? 'Pausa' : check.completed === 12 ? 'Continua' : 'Avvia la verifica',
);
let timer: ReturnType<typeof setInterval> | undefined;
onMounted(() => {
  timer = setInterval(check.advance, 1000);
});
onUnmounted(() => {
  clearInterval(timer);
  check.pause();
});
function back() {
  void router.push({ name: 'personal' });
}
function next() {
  if (check.completed === 12) void router.push({ name: 'approved' });
  else check.toggle();
}
</script>
<template>
  <ApplicationShell>
    <main :class="$style.content">
      <header :class="$style.heading">
        <p :class="$style.eyebrow">Analisi in corso</p>
        <h1>Confronto con le banche partner</h1>
        <p :class="$style.subtitle">
          Scoring invisibile: nessuna traccia nella tua storia creditizia.
        </p>
      </header>
      <BankCheck />
      <ApplicationNavigation
        :next-label="label"
        :class="$style.navigation"
        @back="back"
        @next="next"
      />
    </main>
  </ApplicationShell>
</template>
<style module lang="scss" src="./styles/check/index.module.scss"></style>
