<script setup lang="ts">
import { computed } from 'vue';
import { ProfileImage } from '@/shared/ui';
const props = defineProps<{ name: string; email: string; avatar: string; compact?: boolean }>();
const initials = computed(() =>
  props.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join(''),
);
const size = computed(() => (props.compact ? 32 : 40));
</script>
<template>
  <div :class="[$style.user, compact && $style.compact]">
    <ProfileImage :src="avatar" :alt="name" :width="size" :height="size" :class="$style.avatar" />
    <div :class="$style.userText">
      <p>{{ compact ? initials : name }}</p>
      <span v-if="!compact">{{ email }}</span>
    </div>
  </div>
</template>
<style module lang="scss">
.user {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}
.userText {
  min-width: 0;
  p {
    font-size: 14px;
    font-weight: 600;
  }
  span {
    font-size: 12px;
    color: var(--muted);
  }
  p,
  span {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.compact {
  gap: 6px;
}
.compact .avatar {
  width: 32px;
  height: 32px;
  border: 1px solid var(--accent);
}
@media (max-width: 767px) {
  .userText span {
    display: none;
  }
  .avatar {
    width: 32px;
    height: 32px;
  }
  .userText p {
    font-size: 13px;
  }
}
@media (max-width: 374px) {
  .user {
    gap: 6px;
  }
}
</style>
