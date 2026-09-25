<script setup lang="ts">
import { onMounted, onBeforeUnmount, nextTick, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { routePaths } from '@/shared/config';
import { ProfileHeader } from '@/widgets/header';
import { ProfileProgress } from '@/widgets/progress';
import { ProfilePersonalData } from '@/widgets/personal-data';
import { ProfileSecurity } from '@/widgets/security';
import { ProfileChecklist } from '@/widgets/checklist';
import { ProfileEditDialog, type ProfileEditKind } from '@/features/edit-profile';
import { useProfileStore } from '@/entities/profile';
const route = useRoute();
const router = useRouter();
const store = useProfileStore();
const editKind = ref<ProfileEditKind | null>(null);
watch(
  () => route.query.overlay,
  (value) => {
    editKind.value = value === 'name' || value === 'email' || value === 'password' ? value : null;
  },
  { immediate: true },
);
const status = ref('');
let statusTimer: ReturnType<typeof setTimeout> | undefined;
onBeforeUnmount(() => clearTimeout(statusTimer));
onMounted(async () => {
  try {
    await store.load();
  } catch {
    status.value = 'Impossibile caricare il profilo. Ricarica la pagina.';
  }
});
function editName() {
  edit('name');
}
function edit(kind: ProfileEditKind) {
  void router.push({ path: route.path, query: { ...route.query, overlay: kind } });
}
function close() {
  const query = { ...route.query };
  delete query.overlay;
  void router.replace({ path: route.path, query });
}
async function saved(message: string) {
  close();
  clearTimeout(statusTimer);
  status.value = '';
  await nextTick();
  status.value = message;
  statusTimer = setTimeout(() => {
    status.value = '';
  }, 5000);
}
function navigate(destination: string) {
  void router.push(routePaths[destination] ?? '/');
}
</script>
<template>
  <ProfileHeader />
  <main :class="$style.layout" aria-label="Profilo Avanti">
    <div :class="$style.left">
      <ProfileProgress @navigate="navigate" />
      <ProfilePersonalData @edit="editName" />
      <ProfileSecurity @edit="edit" />
    </div>
    <aside :class="$style.right" aria-label="Riepilogo richiesta">
      <ProfilePersonalData compact :class="$style.summary" />
      <ProfileChecklist @navigate="navigate" />
    </aside>
  </main>
  <p :class="$style.status" role="status">{{ status }}</p>
  <ProfileEditDialog
    v-if="editKind"
    :key="editKind"
    :kind="editKind"
    @close="close"
    @saved="saved"
  />
</template>
<style module lang="scss">
.layout {
  max-width: 1440px;
  margin: auto;
  padding: 0 72px 40px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 464px;
  gap: 40px;
}
.left,
.right {
  display: flex;
  flex-direction: column;
  gap: 32px;
  min-width: 0;
}
.status {
  position: fixed;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 8px;
  background: var(--ink);
  color: white;
  font-size: 13px;
  padding: 12px 20px;
  max-width: calc(100vw - 32px);
  overflow-wrap: anywhere;
  &:empty {
    display: none;
  }
}
@media (max-width: 1199px) {
  .layout {
    grid-template-columns: minmax(0, 1fr);
    padding-inline: 24px;
    gap: 32px;
  }
  .summary {
    display: none;
  }
}
@media (max-width: 767px) {
  .layout {
    padding-inline: 16px;
    gap: 20px;
  }
  .left,
  .right {
    gap: 20px;
  }
}
</style>
