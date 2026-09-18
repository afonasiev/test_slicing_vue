<script setup lang="ts">
import ProfileLink from './credit_profile_link.vue';
export interface BreadcrumbItem {
  label: string;
  href?: string;
}
defineProps<{ items: readonly BreadcrumbItem[] }>();
</script>
<template>
  <nav aria-label="Percorso di navigazione" :class="$style.breadcrumbs">
    <ol>
      <li v-for="(item, index) in items" :key="item.label">
        <span v-if="index" aria-hidden="true">/</span>
        <ProfileLink
          :href="item.href"
          :aria-current="index === items.length - 1 ? 'page' : undefined"
        >
          {{ item.label }}
        </ProfileLink>
      </li>
    </ol>
  </nav>
</template>
<style module lang="scss">
.breadcrumbs ol {
  display: flex;
  align-items: center;
  gap: 8px;
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 14px;
}
.breadcrumbs li {
  display: flex;
  gap: 8px;
  color: var(--muted);
}
.breadcrumbs [aria-current] {
  color: var(--ink);
  font-weight: 600;
}
</style>
