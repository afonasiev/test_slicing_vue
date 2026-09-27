<script setup lang="ts">
import { ref } from 'vue';
import { ProfileButton, ProfileIcon, ProfileImage } from '@/shared/ui';
import { certificatePolicy } from '@/shared/assets';
const emit = defineEmits<{ close: [] }>();
const enlarged = ref(false);
function zoom() {
  enlarged.value = !enlarged.value;
}
function close() {
  emit('close');
}
</script>
<template>
  <section :class="$style.viewer" aria-label="Certificato CPI">
    <header :class="$style.header">
      <span :class="$style.badge"><ProfileIcon name="certificateShield" /></span>
      <div :class="$style.titles">
        <p>Certificato CPI <span>·</span> Documento disponibile</p>
        <h1>Certificato generato</h1>
        <small>Intestatario · kya ky</small>
      </div>
      <ProfileButton
        variant="plain"
        aria-label="Chiudi certificato"
        :class="$style.close"
        @click="close"
        ><ProfileIcon name="certificateClose"
      /></ProfileButton>
    </header>
    <div :class="$style.body">
      <div :class="$style.controls">
        <span>Pagina 1 di 1</span
        ><ProfileButton variant="plain" :aria-pressed="enlarged" @click="zoom"
          ><ProfileIcon name="certificateZoom" />{{
            enlarged ? 'Riduci' : 'Ingrandisci'
          }}</ProfileButton
        >
      </div>
      <div
        :class="[$style.document, enlarged && $style.enlarged]"
        tabindex="0"
        aria-label="Anteprima del certificato CPI"
      >
        <ProfileImage
          :src="certificatePolicy"
          alt="Certificato CPI: documento della polizza assicurativa"
          :width="875"
          :height="1238"
          :class="$style.image"
        />
      </div>
    </div>
    <footer :class="$style.footer">
      <span><ProfileIcon name="certificateLock" />Documento protetto</span
      ><ProfileButton variant="primary" @click="close">Chiudi</ProfileButton>
    </footer>
  </section>
</template>
<style module lang="scss" src="./styles/viewer/index.module.scss"></style>
