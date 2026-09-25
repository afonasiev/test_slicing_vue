<script setup lang="ts">
import { computed } from 'vue';
import { ProfileLogo, ProfileImage } from '@/shared/ui';
import content from '../model/content.json';
const props = withDefaults(
  defineProps<{ name?: string; email?: string; iban?: string; signature?: string }>(),
  {
    name: 'ERDF RFDC',
    email: 'ikoei@09gmail.com',
    iban: 'IT00 •••• •••• •••• ••0 000',
    signature: '',
  },
);
const fields = computed(() => [
  ['Nome e cognome del Prenditore', props.name],
  ['Indirizzo email', props.email],
  ['Tipo di documento d’identità', 'Passaporto'],
  ['Numero del documento', 'AB1234567'],
  ['IBAN per accredito', props.iban],
]);
const columns = ['N.', 'Data', 'Rata Totale', 'Quota Capitale', 'Quota Interessi', 'Saldo Residuo'];
</script>
<template>
  <article :class="$style.document" aria-label="Contratto di credito al consumo">
    <header :class="$style.header">
      <ProfileLogo />
      <h2>CONTRATTO DI CREDITO AL CONSUMO</h2>
      <p>ai sensi del D.Lgs. 141/2010 – Credito ai Consumatori</p>
    </header>
    <div :class="$style.metadata">
      <p>Milano, il <strong>24/08/2026</strong></p>
      <p>N. Contratto: <strong>VLR-2026-00847</strong></p>
    </div>
    <section :class="$style.intro">
      <h3>Tra i sottoscritti</h3>
      <p>{{ content.introduction }}</p>
    </section>
    <dl :class="$style.fields">
      <div v-for="field in fields" :key="field[0]">
        <dt>{{ field[0] }}</dt>
        <dd>{{ field[1] }}</dd>
      </div>
    </dl>
    <section :class="$style.finance">
      <h3>Condizioni Finanziarie</h3>
      <div :class="$style.amounts">
        <p>Importo Erogato<strong>12 000,00 €</strong></p>
        <p>Rata Mensile<strong>147,65 €</strong></p>
        <p>Durata<strong>22 mesi</strong></p>
      </div>
      <p>TAN: 3,8% — Tasso Annuo Nominale fisso per tutta la durata</p>
    </section>
    <p :class="$style.purpose"><strong>Finalità del credito:</strong> Prestito personale</p>
    <section :class="$style.schedule">
      <h3>Piano di Ammortamento</h3>
      <table>
        <thead>
          <tr>
            <th v-for="column in columns" :key="column" scope="col">{{ column }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in content.rows" :key="row[0]">
            <td v-for="(cell, index) in row" :key="index">{{ cell }}</td>
          </tr>
        </tbody>
      </table>
    </section>
    <section v-for="section in content.sections" :key="section.title" :class="$style.clause">
      <h3>{{ section.title }}</h3>
      <p v-for="paragraph in section.paragraphs" :key="paragraph">{{ paragraph }}</p>
    </section>
    <footer :class="$style.signatures">
      <div><span :class="$style.signature" />Firma del Prestatore</div>
      <div>
        <span :class="$style.signature"
          ><ProfileImage
            v-if="signature"
            :src="signature"
            alt="Firma del Prenditore"
            :width="280"
            :height="100" /></span
        >Firma del Prenditore
      </div>
    </footer>
  </article>
</template>
<style module lang="scss" src="./styles/index.module.scss"></style>
