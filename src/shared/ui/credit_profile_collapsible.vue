<script setup lang="ts">
import { useId } from 'vue';
const expanded = defineModel<boolean>({ default: true });
const contentId = useId();
function toggle() {
  expanded.value = !expanded.value;
}
</script>
<template>
  <section>
    <slot name="header" :expanded="expanded" :toggle="toggle" :content-id="contentId" />
    <div
      :id="contentId"
      :class="[$style.panel, expanded && $style.expanded]"
      :inert="!expanded"
      :aria-hidden="!expanded"
    >
      <div :class="$style.inner"><slot /></div>
    </div>
  </section>
</template>
<style module lang="scss">
.panel {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  visibility: hidden;
  transition:
    grid-template-rows 180ms ease,
    opacity 180ms ease,
    visibility 180ms;
}
.expanded {
  grid-template-rows: 1fr;
  opacity: 1;
  visibility: visible;
}
.inner {
  min-height: 0;
  overflow: hidden;
}
@media (prefers-reduced-motion: reduce) {
  .panel {
    transition: none;
  }
}
</style>
