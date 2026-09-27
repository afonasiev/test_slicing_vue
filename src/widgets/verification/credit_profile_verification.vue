<script setup lang="ts">
import { computed } from 'vue';
import { ProfileButton, ProfileIcon, ProfileBadge } from '@/shared/ui';
import { useMediaQuery } from '@/shared/lib/media';
const props = defineProps<{ checking?: boolean; holder: string; iban: string; amount: number }>();
const emit = defineEmits<{ coordinates: [] }>();
const mobile = useMediaQuery('(max-width: 767px)');
// Desktop retains the 5% shown in both original frames; mobile finishes at 100%.
const percentage = computed(() => (props.checking && mobile.value ? 100 : 5));
const formattedAmount = computed(() => `${new Intl.NumberFormat('it-IT').format(props.amount)} €`);
function coordinates() {
  emit('coordinates');
}
</script>
<template>
  <section :class="$style.card" aria-labelledby="verification-heading">
    <header :class="$style.header">
      <div :class="$style.heading">
        <span :class="$style.bank"><ProfileIcon name="verificationBank" /></span>
        <div>
          <p>Verifica Protetta</p>
          <h1 id="verification-heading">Verifica Euroclear</h1>
        </div>
      </div>
      <p>Euroclear sta verificando i dati della transazione. Non chiudere la pagina.</p>
    </header>
    <section :class="$style.user" aria-label="Dati della transazione">
      <span :class="$style.shield"><ProfileIcon name="verificationShield" /></span>
      <div>
        <small>Verifica Protetta</small><strong>{{ holder }}</strong>
        <p>{{ iban }}</p>
      </div>
      <b>{{ formattedAmount }}</b>
    </section>
    <section :class="$style.scanner">
      <ProfileIcon name="verificationScanner" :class="$style.graphic" />
      <div :class="$style.scannerInfo">
        <ProfileBadge :class="$style.badge">CONTROLLO IN TEMPO REALE</ProfileBadge>
        <h2>Connessione con la banca partner...</h2>
        <p>
          I dati della transazione vengono verificati attraverso il circuito protetto Euroclear.
        </p>
      </div>
    </section>
    <ol :class="$style.timeline" aria-label="Avanzamento verifica">
      <li>
        <span :class="$style.circle"><ProfileIcon name="verificationBank" /></span
        ><strong>Banca partner</strong><small>Dati ricevuti</small>
      </li>
      <li :class="$style.connector" aria-hidden="true"></li>
      <li>
        <span :class="$style.circle"><ProfileIcon name="transferClock" /></span
        ><strong>Euroclear</strong><small>In attesa</small>
      </li>
      <li :class="$style.connector" aria-hidden="true"></li>
      <li>
        <span :class="$style.circle"><ProfileIcon name="verificationUser" /></span
        ><strong>Il tuo conto</strong><small>In attesa</small>
      </li>
    </ol>
    <footer :class="$style.footer">
      <div>
        <p>Connessione con la banca partner...</p>
        <small>{{ percentage }}% completato</small>
      </div>
      <progress :value="percentage" max="100" aria-label="Verifica Euroclear" />
      <ProfileButton :class="$style.action" @click="coordinates">Le mie coordinate</ProfileButton>
    </footer>
  </section>
</template>
<style module lang="scss" src="./styles/index.module.scss"></style>
