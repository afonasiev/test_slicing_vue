<script setup lang="ts">
import { ref, computed } from 'vue';
import ProfileField from './credit_profile_field.vue';
import ProfileButton from './credit_profile_button.vue';
import { ProfileIcon } from './icons';
defineProps<{ label: string; autocomplete?: string; invalid?: boolean }>();
const value = defineModel<string>({ required: true });
const visible = ref(false);
const type = computed(() => (visible.value ? 'text' : 'password'));
const action = computed(() => (visible.value ? 'Nascondi password' : 'Mostra password'));
function toggle() {
  visible.value = !visible.value;
}
</script>
<template>
  <div :class="$style.wrapper">
    <ProfileField
      v-model="value"
      :label="label"
      :type="type"
      :autocomplete="autocomplete"
      :invalid="invalid"
      required
    />
    <ProfileButton
      :class="$style.toggle"
      variant="plain"
      :aria-label="action"
      :aria-pressed="visible"
      @click="toggle"
      ><ProfileIcon name="eye"
    /></ProfileButton>
  </div>
</template>
<style module lang="scss">
.wrapper {
  position: relative;
}
.wrapper input {
  padding-right: 52px;
}
.toggle {
  position: absolute;
  bottom: 9px;
  right: 12px;
  width: 32px;
  height: 32px;
}
.toggle [data-profile-icon] {
  width: 100%;
  height: 100%;
}
@media (max-width: 767px) {
  .toggle {
    width: 20px;
    height: 20px;
    bottom: 11px;
  }
}
</style>
