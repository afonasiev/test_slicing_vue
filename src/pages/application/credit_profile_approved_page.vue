<script setup lang="ts">
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { AuthDialog } from '@/features/auth';
import { useProfileStore } from '@/entities/profile';
import { ApplicationShell } from '@/widgets/application-shell';
import { useApplicationStore } from '@/entities/application';
import { ProfileButton, ProfileImage, ProfileIcon } from '@/shared/ui';
import { approvedCards } from '@/shared/assets';
const router = useRouter();
const store = useApplicationStore();
const route = useRoute();
const authMode = computed(() =>
  route.name === 'register' ? 'register' : route.name === 'login' ? 'login' : null,
);
const shellVariant = computed(() => authMode.value ?? undefined);
const terms = computed(() =>
  authMode.value
    ? 'Rata mensile: 147,65 € · Durata: 62 mesi · Tasso fisso al 3,8%'
    : 'Rata mensile: 147,65 €\nDurata: 62 mesi\nTasso fisso al 3,8%',
);
const amount = computed(
  () =>
    `${new Intl.NumberFormat('fr-FR').format(store.application.amount).replaceAll('\u202f', ' ')}€`,
);
function next() {
  void router.push({ name: 'register' });
}
function close() {
  void router.push({ name: 'approved' });
}
async function authenticated(email: string) {
  const name = `${store.application.firstName} ${store.application.lastName}`.trim();
  await useProfileStore().update(name ? { email, name } : { email });
  void router.push({ name: 'home' });
}
</script>
<template>
  <ApplicationShell :variant="shellVariant">
    <main :class="[$style.content, authMode && $style[authMode]]">
      <header :class="$style.heading">
        <h1>Il tuo credito è approvato</h1>
        <p>
          Le banche partner hanno confermato la disponibilità dei fondi al tasso sociale del 3,8%.
        </p>
      </header>
      <div :class="$style.offer">
        <section :class="$style.card" aria-label="Offerta approvata">
          <p>Importo approvato</p>
          <strong>{{ amount }}</strong>
          <p :class="$style.terms">{{ terms }}</p>
        </section>
        <p :class="$style.notice">
          <ProfileIcon name="info" />L'offerta resta riservata per 24 ore, poi il fascicolo torna in
          coda.
        </p>
        <ProfileButton variant="primary" :class="$style.button" @click="next"
          >Finalizza la mia richiesta</ProfileButton
        >
      </div>
      <ProfileImage
        :src="approvedCards"
        alt="Tre carte di credito Avanti"
        :width="584"
        :height="550"
        :class="$style.illustration"
      />
    </main>
  </ApplicationShell>
  <AuthDialog v-if="authMode" :mode="authMode" @close="close" @authenticated="authenticated" />
</template>
<style module lang="scss" src="./styles/approved/index.module.scss"></style>
