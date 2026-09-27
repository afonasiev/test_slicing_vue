<script setup lang="ts">
import { ProfileBadge, ProfileButton, ProfileDialog } from '@/shared/ui';
const emit = defineEmits<{ close: []; confirm: [] }>();
function close() {
  emit('close');
}
function confirm() {
  emit('confirm');
}
</script>
<template>
  <ProfileDialog title="Attenzione" :dialog-class="$style.dialog" @close="close">
    <template #header="{ titleId }"
      ><ProfileBadge :class="$style.badge">Avviso</ProfileBadge>
      <h2 :id="titleId">Attenzione</h2></template
    >
    <p :class="$style.notice">
      Sono stati registrati frequenti tentativi di prelievo fondi. Sei sicuro di voler continuare?
    </p>
    <ProfileButton variant="primary" :class="$style.action" @click="confirm"
      >Continua</ProfileButton
    >
  </ProfileDialog>
</template>
<style module lang="scss">
.dialog {
  width: min(702px, calc(100% - 32px));
  padding: 24px;
  border-radius: 20px;
  h2 {
    font-size: 24px;
    line-height: 28px;
    font-weight: 600;
    margin-top: 8px;
  }
}
.badge {
  padding: 4px 10px;
  font-size: 11px;
  line-height: 13px;
  background: #fff7ed;
  color: #c28120;
}
.notice {
  padding: 16px;
  margin: 20px 0;
  background: #fff7ed;
  border-radius: 12px;
  font-size: 13px;
  line-height: 19px;
}
.action {
  width: 100%;
  min-height: 48px;
  font-size: 15px;
}
@media (max-width: 767px) {
  .dialog {
    width: min(320px, calc(100% - 32px));
  }
}
</style>
