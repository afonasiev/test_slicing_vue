<script setup lang="ts">
import { ProfileIcon, ProfileLink } from '@/shared/ui';
</script>
<template>
  <section :class="$style.card" aria-label="Certificato CPI">
    <header>
      <span :class="$style.badge"><ProfileIcon name="certificateShield" /></span>
      <div>
        <p>Certificato CPI Emesso</p>
        <h2>Fondi disponibili per il prelievo</h2>
      </div>
    </header>
    <p :class="$style.description">
      La polizza assicurativa è stata emessa. I fondi sono sbloccati e disponibili per il prelievo
      immediato.
    </p>
    <p :class="$style.code">Cod. Pratica: CPI-8492-X</p>
    <ProfileLink to="/certificate" :class="$style.action">Mostra il certificato</ProfileLink>
  </section>
</template>
<style module lang="scss" src="./styles/index.module.scss"></style>
