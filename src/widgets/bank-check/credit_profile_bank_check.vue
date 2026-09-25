<script setup lang="ts">
import { computed } from 'vue';
import { useBankCheckStore } from '@/entities/application';
import { bankAssets } from '@/shared/assets';
import BankCard from './credit_profile_bank_card.vue';
const check = useBankCheckStore();
const banks = computed(() =>
  bankAssets.map((bank, index) => ({
    ...bank,
    status:
      index < check.completed
        ? ('verified' as const)
        : index === check.completed
          ? ('checking' as const)
          : ('waiting' as const),
  })),
);
const remaining = computed(() => 100 - check.percentage);
const status = computed(() => (check.completed === 12 ? 'Verificata' : 'In attesa'));
const message = computed(() =>
  check.completed === 12 ? 'Verifica completata' : 'Ancora qualche secondo…',
);
</script>
<template>
  <section :class="$style.summary" aria-label="Stato della verifica">
    <div :class="$style.rows">
      <p><strong>Invio della richiesta</strong><span>Verificata</span></p>
      <p>
        <span>Scoring invisibile</span><span>{{ status }}</span>
      </p>
    </div>
    <div :class="$style.progress">
      <div :class="$style.circle" aria-hidden="true">
        <svg viewBox="0 0 66 66">
          <circle cx="33" cy="33" r="31" />
          <circle
            :class="$style.arc"
            cx="33"
            cy="33"
            r="31"
            pathLength="100"
            stroke-dasharray="100"
            :stroke-dashoffset="remaining"
            transform="rotate(-90 33 33)"
          />
        </svg>
        <span>{{ check.percentage }}</span>
      </div>
      <div :class="$style.linear">
        <strong>{{ check.completed }}/12</strong>
        <progress :value="check.completed" max="12" aria-label="Banche verificate" />
      </div>
      <p :class="$style.message" role="status">{{ message }}</p>
    </div>
  </section>
  <ul :class="$style.banks" aria-label="Banche partner">
    <BankCard v-for="bank in banks" :key="bank.name" v-bind="bank" />
  </ul>
</template>
<style module lang="scss" src="./styles/index.module.scss"></style>
