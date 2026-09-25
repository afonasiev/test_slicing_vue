<script setup lang="ts">
import { ref } from 'vue';
import { ProfileLogo, ProfileButton, ProfileIcon, ProfileLink } from '@/shared/ui';
defineProps<{ variant?: 'register' | 'login' }>();
const expanded = ref(false);
function toggle() {
  expanded.value = !expanded.value;
}
</script>
<template>
  <header :class="[$style.header, variant && $style[variant]]">
    <div :class="$style.inner">
      <ProfileLogo :class="$style.logo" />
      <ProfileButton
        variant="plain"
        :class="$style.menu"
        aria-label="Menu"
        :aria-expanded="expanded"
        aria-controls="application-menu"
        @click="toggle"
        ><ProfileIcon name="burger"
      /></ProfileButton>
    </div>
    <nav v-if="expanded" id="application-menu" :class="$style.links" aria-label="Navigazione">
      <ProfileLink to="/">Home</ProfileLink><ProfileLink to="/auth/login">Accedi</ProfileLink>
    </nav>
  </header>
  <slot />
</template>
<style module lang="scss">
.header {
  background: white;
  border-bottom: 2px solid var(--accent);
}
.inner {
  height: 108px;
  max-width: 1440px;
  margin: auto;
  padding: 0 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.logo {
  width: 206px;
  height: 52px;
}
.menu {
  display: none;
}
.links {
  padding: 16px 20px;
  display: flex;
  gap: 24px;
}
@media (max-width: 1199px) {
  .inner {
    padding-inline: 24px;
  }
}
@media (max-width: 767px) {
  .header {
    border-bottom-width: 1px;
  }
  .inner {
    height: 70px;
    padding-inline: 20px;
  }
  .logo {
    width: 121px;
    height: 31px;
  }
  .menu {
    display: flex;
  }
  .menu [data-profile-icon] {
    width: 40px;
    height: 40px;
  }
}
@media (max-width: 767px) {
  .register,
  .login {
    border-bottom: 0;
  }
  .register .inner {
    height: 70px;
    padding: 24px 16px 20px;
  }
  .register .logo {
    width: 90px;
    height: 26px;
  }
  .login .inner {
    height: 61px;
    padding: 16px;
  }
  .login .logo {
    width: 113px;
    height: 29px;
  }
  .register .menu,
  .login .menu {
    display: none;
  }
}
</style>
