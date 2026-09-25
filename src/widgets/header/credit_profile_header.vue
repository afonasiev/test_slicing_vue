<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { routePaths } from '@/shared/config';
import { useProfileStore, ProfileUser } from '@/entities/profile';
import { avatar } from '@/shared/assets';
import type { IconName } from '@/shared/ui';
import {
  ProfileButton,
  ProfileIcon,
  ProfileLink,
  ProfileBadge,
  ProfileBreadcrumbs,
  ProfileLogo,
} from '@/shared/ui';
defineProps<{ dashboard?: boolean }>();
const route = useRoute();
const router = useRouter();
const activeSection = computed(() => String(route.meta.section ?? 'home'));
const store = useProfileStore();
const profile = computed(() => store.profile);
const emit = defineEmits<{ navigate: [destination: string] }>();
const breadcrumbs = [
  { label: 'Piattaforma', to: '/' },
  { label: 'Home', to: '/' },
];
const items: { id: string; label: string; mobile: string; icon: IconName }[] = [
  { id: 'home', label: 'Home', mobile: 'Home', icon: 'home' },
  { id: 'documents', label: 'Documenti', mobile: 'Docs', icon: 'documents' },
  { id: 'profile', label: 'Profilo', mobile: 'Profilo', icon: 'profile' },
];
function navigate(event: MouseEvent) {
  const destination = (event.currentTarget as HTMLAnchorElement).dataset.destination;
  if (destination) emit('navigate', destination);
}
function assist() {
  void router.push({ path: route.path, query: { ...route.query, overlay: 'chat' } });
}
</script>
<template>
  <header :class="[$style.header, dashboard && $style.dashboard]">
    <div :class="$style.top">
      <div :class="$style.topInner">
        <ProfileLogo />
        <div v-if="dashboard" :class="$style.mobileTools">
          <ProfileButton
            variant="plain"
            aria-label="Notifiche"
            :class="$style.notifications"
            @click="assist"
            ><ProfileIcon name="bell" /><ProfileBadge variant="notification" label="4 notifiche"
              >4</ProfileBadge
            ></ProfileButton
          >
          <ProfileLink to="/profile" aria-label="Apri profilo"
            ><ProfileUser :name="profile.name" :email="profile.email" :avatar="avatar" compact
          /></ProfileLink>
        </div>
        <nav :class="$style.desktopNav" aria-label="Navigazione principale">
          <ProfileLink
            v-for="item in items"
            :key="item.id"
            :to="routePaths[item.id]"
            :class="[$style.navItem, activeSection === item.id && $style.active]"
            :data-destination="item.id"
            @navigate="navigate"
          >
            <ProfileIcon :name="item.icon" />{{ item.label }}
          </ProfileLink>
        </nav>
        <ProfileButton variant="primary" :class="$style.assist" @click="assist">
          <ProfileIcon name="chat" />ASSISTENZA<ProfileBadge
            variant="notification"
            label="4 notifiche"
            :class="$style.badge"
          >
            4
          </ProfileBadge>
        </ProfileButton>
      </div>
    </div>
    <div :class="$style.bottom">
      <ProfileUser :name="profile.name" :email="profile.email" :avatar="avatar" />
      <ProfileBreadcrumbs :items="breadcrumbs" :class="$style.breadcrumb" />
      <nav :class="$style.mobileNav" aria-label="Navigazione principale">
        <ProfileLink
          v-for="item in items"
          :key="item.id"
          :to="routePaths[item.id]"
          :class="[$style.navItem, activeSection === item.id && $style.active]"
          :data-destination="item.id"
          @navigate="navigate"
        >
          {{ item.mobile }}
        </ProfileLink>
      </nav>
    </div>
    <nav v-if="dashboard" :class="$style.bottomNavigation" aria-label="Navigazione mobile">
      <ProfileLink
        v-for="item in items"
        :key="item.id"
        :to="routePaths[item.id]"
        :class="[$style.bottomItem, activeSection === item.id && $style.current]"
        ><ProfileIcon :name="item.icon" />{{ item.label }}</ProfileLink
      >
      <ProfileButton variant="primary" :class="$style.bottomAssistance" @click="assist"
        ><ProfileIcon name="chat" />Assistenza</ProfileButton
      >
    </nav>
  </header>
</template>
<style module lang="scss" src="./styles/index.module.scss"></style>
