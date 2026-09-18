<script setup lang="ts">
import { computed } from 'vue';
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
const store = useProfileStore();
const profile = computed(() => store.profile);
const emit = defineEmits<{ navigate: [destination: string] }>();
const breadcrumbs = [
  { label: 'Piattaforma', href: '#' },
  { label: 'Home', href: '#' },
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
  emit('navigate', 'assistance');
}
</script>
<template>
  <header :class="$style.header">
    <div :class="$style.top">
      <div :class="$style.topInner">
        <ProfileLogo />
        <nav :class="$style.desktopNav" aria-label="Navigazione principale">
          <ProfileLink
            v-for="item in items"
            :key="item.id"
            href="#"
            :class="[$style.navItem, $style[item.id]]"
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
          href="#"
          :class="[$style.navItem, $style[item.id]]"
          :data-destination="item.id"
          @navigate="navigate"
          >{{ item.mobile }}</ProfileLink
        >
      </nav>
    </div>
  </header>
</template>
<style module lang="scss" src="./styles/index.module.scss"></style>
