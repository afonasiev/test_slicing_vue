import { ref } from 'vue';
import { defineStore } from 'pinia';
import { initialProfile } from './data';
import { profileService } from '../api/mock';
import type { Profile } from './types';
export const useProfileStore = defineStore('profile', () => {
  const profile = ref<Profile>({ ...initialProfile });
  async function load() {
    profile.value = await profileService.load();
  }
  async function update(data: Partial<Pick<Profile, 'name' | 'email'>>) {
    profile.value = await profileService.update(data);
  }
  async function verify(code: string) {
    profile.value = await profileService.verifyEmail(code);
  }
  return { profile, load, update, verify };
});
