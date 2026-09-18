<script setup lang="ts">
import { ProfileImage } from '@/shared/ui';
defineProps<{ name: string; email: string; avatar: string }>();
</script>
<template>
  <div :class="$style.user">
    <ProfileImage :src="avatar" :alt="name" :width="40" :height="40" :class="$style.avatar" />
    <div :class="$style.userText">
      <p>{{ name }}</p>
      <span>{{ email }}</span>
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
