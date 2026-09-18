<script setup lang="ts">
import { ProfileIcon } from './icons';
const homeUrl = import.meta.env.BASE_URL;
</script>
<template>
  <a :href="homeUrl" :class="$style.logo" aria-label="Avanti — Home">
    <ProfileIcon name="logoFull" />
  </a>
</template>
<style module lang="scss">
.logo {
  display: inline-flex;
  flex: none;
  width: 152px;
  height: 39px;
}
.logo [data-profile-icon] {
  width: 100%;
  height: 100%;
}
@media (max-width: 767px) {
  .logo {
    width: 104px;
    height: 29px;
  }
}
</style>
