import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { ApplicationData } from '../types';
import { initial, createApplicationService } from '../api';
export const useApplicationStore = defineStore('application', () => {
  const service = createApplicationService();
  const application = ref({ ...initial });
  async function update(data: Partial<ApplicationData>) {
    application.value = await service.update(data);
  }
  async function reset() {
    application.value = await service.update({ ...initial });
  }
  return { application, update, reset };
});
