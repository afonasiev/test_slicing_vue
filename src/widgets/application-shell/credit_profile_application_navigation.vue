<script setup lang="ts">
import { ProfileButton, ProfileIcon } from '@/shared/ui';
defineProps<{ nextLabel?: string }>();
const emit = defineEmits<{ back: []; next: [] }>();
function back() {
  emit('back');
}
function next() {
  emit('next');
}
</script>
<template>
  <div :class="$style.navigation">
    <ProfileButton :class="$style.button" @click="back"
      ><ProfileIcon name="back" :class="$style.back" />Indietro</ProfileButton
    >
    <ProfileButton variant="primary" :class="$style.button" @click="next"
      >{{ nextLabel ?? 'Continua' }}<ProfileIcon name="next"
    /></ProfileButton>
  </div>
</template>
<style module lang="scss">
.navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
}
.button {
  width: 294px;
  height: 60px;
  border-radius: 12px;
  font-size: 24px;
  font-weight: 500;
  gap: 12px;
}
.button [data-profile-icon] {
  width: 24px;
  height: 24px;
}
.back {
  transform: rotate(180deg);
}
.button:last-child {
  box-shadow: 0 4px 11.6px #0004;
}
@media (max-width: 767px) {
  .button {
    width: auto;
    flex: 1;
    height: 44px;
    font-size: 16px;
    font-weight: 600;
    gap: 8px;
    padding: 10px;
  }
}
</style>
