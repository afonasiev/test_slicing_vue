<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref } from 'vue';
import { RouterView, useRoute, useRouter } from 'vue-router';
import { useApplicationStore, useBankCheckStore } from '@/entities/application';
import { usePaymentStore } from '@/entities/payment';
import { useContractStore } from '@/entities/contract';
import { useProfileStore } from '@/entities/profile';
import { DemoPanel } from '@/widgets/demo-panel';
import { demoPages, scenarios } from './demo';
const route = useRoute();
const router = useRouter();
const check = useBankCheckStore();
const revision = ref(0);
const portal = ref<Element | string>('body');
const currentPage = computed(() => String(route.name ?? 'home'));
const currentState = computed(() =>
  String(
    route.query.state ??
      scenarios.find((item) => item.page === currentPage.value)?.state ??
      'default',
  ),
);
const currentOverlay = computed(() => String(route.query.overlay ?? ''));
let observer: MutationObserver | undefined;
onMounted(() => {
  // Native modal dialogs make the rest of the document inert. Keep the service
  // tools in the active top-layer dialog so they remain keyboard-accessible.
  observer = new MutationObserver(() => {
    const dialogs = document.querySelectorAll('dialog[open]');
    const target = dialogs.item(dialogs.length - 1) ?? 'body';
    if (portal.value !== target) portal.value = target;
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['open'],
  });
});
onBeforeUnmount(() => observer?.disconnect());
function select() {
  check.pause();
}
async function reset() {
  await Promise.all([useApplicationStore().reset(), useProfileStore().reset()]);
  check.pause();
  check.reset();
  useContractStore().reset();
  usePaymentStore().reset();
  revision.value++;
  void router.replace({ name: currentPage.value });
}
function simulate() {
  check.toggle();
}
</script>
<template>
  <RouterView :key="revision" />
  <Teleport :to="portal">
    <DemoPanel
      :pages="demoPages"
      :current-page="currentPage"
      :current-state="currentState"
      :current-overlay="currentOverlay"
      :running="check.running"
      @select="select"
      @reset="reset"
      @simulate="simulate"
    />
  </Teleport>
</template>
