<script setup lang="ts">
import { computed } from 'vue';
import { ProfileButton, ProfileIcon } from '@/shared/ui';
const props = withDefaults(
  defineProps<{
    interrupted?: boolean;
    certificate?: boolean;
    compact?: boolean;
    percentage?: number;
    amount?: number;
  }>(),
  { percentage: 1, amount: 8300 },
);
const emit = defineEmits<{ action: [] }>();
const title = computed(() =>
  props.certificate
    ? 'Ottenimento del certificato CPI'
    : props.interrupted
      ? 'Trasferimento interrotto'
      : 'Trasferimento fondi',
);
const description = computed(() =>
  props.certificate
    ? 'Stiamo richiedendo e preparando il certificato CPI. Durata stimata: circa 5 minuti. Puoi aprire i documenti in parallelo.'
    : props.interrupted
      ? 'Si è verificato un problema durante il trasferimento dei fondi dalla banca partner a Avanti. Nessun importo è stato accreditato.'
      : 'I fondi passano dalla banca partner a Avanti e poi al tuo dispositivo. Non chiudere la pagina.',
);
const formattedAmount = computed(() => new Intl.NumberFormat('it-IT').format(props.amount));
const completion = computed(() => Math.max(5, props.percentage));
const certificateTime = computed(() => {
  const remaining = Math.round((100 - completion.value) * 3);
  return `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, '0')}`;
});
const progress = computed(() => (props.interrupted ? 100 : props.percentage));
const time = computed(() => {
  const seconds = Math.round((418 * (100 - props.percentage)) / 99);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
});
function action() {
  emit('action');
}
</script>
<template>
  <section
    :class="[
      $style.card,
      interrupted && $style.interrupted,
      certificate && $style.certificate,
      compact && $style.compact,
    ]"
    aria-label="Trasferimento fondi"
  >
    <header :class="$style.header">
      <span :class="$style.bank"
        ><ProfileIcon :name="certificate ? 'certificateProgressShield' : 'transferBank'"
      /></span>
      <div>
        <p>
          {{
            certificate
              ? 'Certificato CPI'
              : interrupted
                ? 'BONIFICO INTERROTTO'
                : 'Bonifico in corso'
          }}
        </p>
        <h1>{{ title }}</h1>
      </div>
    </header>
    <p :class="$style.description">{{ description }}</p>
    <div :class="$style.inner">
      <p :class="$style.caption">
        {{
          certificate
            ? 'Stato del certificato'
            : interrupted
              ? 'STATO DEL TRASFERIMENTO'
              : 'Bonifico in uscita'
        }}
      </p>
      <ol :class="$style.flow">
        <li>
          <span :class="$style.done"><ProfileIcon name="transferCheck" /></span
          ><strong>{{ certificate ? 'Richiesta inviata' : 'Banca partner' }}</strong
          ><small>Completato</small>
        </li>
        <li>
          <span :class="interrupted ? $style.error : $style.active"
            ><ProfileIcon
              :name="
                interrupted
                  ? 'transferError'
                  : certificate
                    ? 'certificateProgressActive'
                    : 'transferLogo'
              " /></span
          ><strong>{{ certificate ? 'In elaborazione' : 'Avanti' }}</strong
          ><small>{{
            certificate ? 'In corso' : interrupted ? 'Interrotto' : 'In elaborazione'
          }}</small>
        </li>
        <li>
          <span :class="$style.waiting"
            ><ProfileIcon
              :name="certificate ? 'certificateProgressShield' : 'transferBank'" /></span
          ><strong>{{ certificate ? 'Certificato pronto' : 'Il tuo conto' }}</strong
          ><small>In attesa</small>
        </li>
      </ol>
      <p v-if="interrupted" :class="$style.warning">
        <ProfileIcon name="transferInfo" />Il trasferimento non è andato a buon fine. I fondi sono
        ancora presso la banca partner.
      </p>
      <div :class="$style.summary">
        <strong v-if="certificate" :class="$style.completion">{{ completion }}% completato</strong>
        <div v-else :class="$style.amount">
          <strong>{{ formattedAmount }} €</strong
          ><span>{{ interrupted ? 'Importo' : 'Importo in trasferimento' }}</span>
        </div>
        <span v-if="certificate" :class="$style.timer">Restano circa {{ certificateTime }}</span>
        <span v-else :class="$style.timer"
          ><ProfileIcon name="transferClock" />Tempo stimato {{ interrupted ? '—' : time }}</span
        >
      </div>
      <div :class="$style.progress">
        <progress :value="progress" max="100" aria-label="Progresso trasferimento" /><span
          >{{ progress }}%</span
        >
      </div>
    </div>
    <p v-if="certificate" :class="$style.notice">
      <span aria-hidden="true">i</span>Il certificato CPI verrà emesso automaticamente. Ti
      avviseremo quando sarà pronto.
    </p>
    <ProfileButton v-else :class="$style.action" @click="action">{{
      interrupted ? 'Mostra dettagli' : 'Le mie coordinate'
    }}</ProfileButton>
  </section>
</template>
<style module lang="scss" src="./styles/index.module.scss"></style>
