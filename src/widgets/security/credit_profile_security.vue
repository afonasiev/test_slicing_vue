<script setup lang="ts">
import { ProfileEmailVerification } from '@/features/verify-email';
import { ProfileButton, ProfileIcon } from '@/shared/ui';
const emit = defineEmits<{ edit: [kind: 'password' | 'email'] }>();
function password() {
  emit('edit', 'password');
}
function email() {
  emit('edit', 'email');
}
</script>
<template>
  <section :class="$style.card" aria-label="Sicurezza">
    <header :class="$style.heading">
      <span><ProfileIcon name="shield" /></span>
      <h2>Sicurezza</h2>
    </header>
    <div :class="$style.row">
      <p>Cambia la password del tuo account.</p>
      <ProfileButton @click="password">Cambia password</ProfileButton>
    </div>
    <div :class="$style.row">
      <p>Cambia l'indirizzo email del tuo account.</p>
      <ProfileButton @click="email">Cambia email</ProfileButton>
    </div>
    <ProfileEmailVerification />
  </section>
</template>
<style module lang="scss">
.card {
  background: white;
  border: 0;
  outline: 1px solid var(--border);
  outline-offset: -1px;
  border-radius: 16px;
  padding: 24px;
}
.heading {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
  span {
    width: 32px;
    height: 32px;
    display: grid;
    place-items: center;
    border-radius: 8px;
    background: var(--tint);
    [data-profile-icon] {
      width: 18px;
      height: 18px;
    }
  }
  h2 {
    font-size: 15px;
    font-weight: 600;
    line-height: 18px;
  }
}
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid var(--border);
  p {
    font-size: 13px;
    line-height: 16px;
    color: var(--muted);
  }
  button {
    width: 148px;
    height: 36px;
    flex: none;
    padding: 8px 12px;
  }
}
@media (max-width: 767px) {
  .card {
    padding: 16px;
  }
  .row {
    align-items: stretch;
    flex-direction: column;
    gap: 10px;
    button {
      width: 100%;
      height: 32px;
    }
  }
  .row:last-of-type {
    margin-bottom: 16px;
  }
}
@media (max-width: 767px) {
  .heading span [data-profile-icon] {
    width: 32px;
    height: 32px;
  }
}
</style>
