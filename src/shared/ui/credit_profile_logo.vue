<script setup lang="ts">
import { ProfileIcon } from './icons';
import ProfileLink from './credit_profile_link.vue';
</script>
<template>
  <ProfileLink to="/" :class="$style.logo" aria-label="Avanti — Home">
    <ProfileIcon name="logoFull" />
  </ProfileLink>
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
