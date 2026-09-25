<script setup lang="ts">
import { RouterLink, type RouteLocationRaw } from 'vue-router';
withDefaults(defineProps<{ href?: string; to?: RouteLocationRaw }>(), { href: '#' });
const emit = defineEmits<{ navigate: [event: MouseEvent] }>();
function navigate(event: MouseEvent) {
  if ((event.currentTarget as HTMLAnchorElement).getAttribute('href') === '#')
    event.preventDefault();
  emit('navigate', event);
}
</script>
<template>
  <RouterLink v-if="to" :to="to" :class="$style.link" @click="navigate"><slot /></RouterLink>
  <a v-else :href="href" :class="$style.link" @click="navigate"><slot /></a>
</template>
<style module lang="scss">
.link {
  display: inline-flex;
  align-items: center;
  color: inherit;
  text-decoration: none;
}
.link:hover {
  filter: brightness(0.95);
}
</style>
