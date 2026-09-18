<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref } from 'vue';
import { buildA11yAttrs, resolveIconComponent } from './code';
import type { IconName, IconProps } from './types';
const props = withDefaults(defineProps<IconProps>(), { decorative: true });
const mobileNames: Partial<Record<IconName, IconName>> = {
  check: 'mobileCheck',
  upload: 'mobileUpload',
  pen: 'mobilePen',
  copy: 'mobileCopy',
  shield: 'mobileShield',
  chevron: 'mobileChevron',
  simulation: 'mobileSimulation',
  checkSmall: 'mobileCheckSmall',
  approved: 'mobileApproved',
  account: 'mobileAccount',
  uploadLarge: 'mobileUploadLarge',
  arrow: 'mobileArrow',
  penLarge: 'mobilePenLarge',
  arrowMuted: 'mobileArrowMuted',
  logoFull: 'mobileLogoFull',
};
const query = typeof window === 'undefined' ? undefined : window.matchMedia('(max-width: 767px)');
const mobile = ref(query?.matches ?? false);
function updateViewport() {
  mobile.value = query?.matches ?? false;
}
onMounted(() => {
  updateViewport();
  query?.addEventListener('change', updateViewport);
});
onBeforeUnmount(() => query?.removeEventListener('change', updateViewport));
const component = computed(() =>
  resolveIconComponent(mobile.value ? mobileNames[props.name] || props.name : props.name),
);
const a11y = computed(() => buildA11yAttrs(props));
</script>
<template>
  <span data-profile-icon :class="$style.icon" v-bind="a11y" :title="title">
    <component :is="component" aria-hidden="true" focusable="false" width="16" height="16" />
  </span>
</template>
<style module lang="scss">
.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  flex: none;
}
.icon svg {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
