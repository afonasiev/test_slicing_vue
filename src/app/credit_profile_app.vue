<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref } from 'vue';
import { RouterView, useRoute, useRouter } from 'vue-router';
import { useApplicationStore, useBankCheckStore } from '@/entities/application';
import { usePaymentStore, useTransferStore } from '@/entities/payment';
import { useContractStore } from '@/entities/contract';
import { useProfileStore } from '@/entities/profile';
import { AssistanceChat } from '@/widgets/assistance';
import { useAssistanceStore } from '@/entities/assistance';
import { DemoPanel } from '@/widgets/demo-panel';
import { demoPages, scenarios } from './demo';
const route = useRoute();
const router = useRouter();
const check = useBankCheckStore();
const transfer = useTransferStore();
const running = computed(() => (route.name === 'transfer' ? transfer.running : check.running));
const revision = ref(0);
const portal = document.createElement('div');
portal.dataset.demoHost = '';
document.body.append(portal);
const currentPage = computed(() => String(route.name ?? 'home'));
const currentState = computed(() =>
  String(
    route.query.state ??
      scenarios.find((item) => item.page === currentPage.value)?.state ??
      'default',
  ),
);
const chatOpen = computed(() => route.name === 'assistance' || route.query.overlay === 'chat');
function closeChat() {
  if (route.name === 'assistance') void router.push('/');
  else {
    const query = { ...route.query };
    delete query.overlay;
    void router.push({ path: route.path, query });
  }
}
const currentOverlay = computed(() => String(route.query.overlay ?? ''));
let observer: MutationObserver | undefined;
function moveServiceHost() {
  const dialogs = document.querySelectorAll('dialog[open]');
  const parent = dialogs[dialogs.length - 1] ?? document.body;
  if (portal.parentElement !== parent) parent.append(portal);
}
onMounted(() => {
  // Native modal dialogs make the rest of the document inert. Keep the service
  // tools in the active top-layer dialog so they remain keyboard-accessible.
  moveServiceHost();
  observer = new MutationObserver(moveServiceHost);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['open'],
  });
});
onBeforeUnmount(() => {
  observer?.disconnect();
  portal.remove();
});
function select() {
  transfer.pause();
  check.pause();
}
async function reset() {
  await Promise.all([useApplicationStore().reset(), useProfileStore().reset()]);
  check.pause();
  check.reset();
  useContractStore().reset();
  usePaymentStore().reset();
  useAssistanceStore().reset();
  transfer.reset();
  revision.value++;
  void router.replace({ name: currentPage.value });
}
function simulate() {
  if (route.name === 'transfer' && route.query.state !== 'interrupted') transfer.toggle();
  else if (route.name === 'check') check.toggle();
}
</script>
<template>
  <RouterView :key="revision" />
  <AssistanceChat v-if="chatOpen" @close="closeChat" />
  <Teleport :to="portal">
    <DemoPanel
      :pages="demoPages"
      :current-page="currentPage"
      :current-state="currentState"
      :current-overlay="currentOverlay"
      :running="running"
      @select="select"
      @reset="reset"
      @simulate="simulate"
    />
  </Teleport>
</template>
