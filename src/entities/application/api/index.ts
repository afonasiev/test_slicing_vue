import type { ApplicationData, ApplicationService } from '../types';
export const initial: ApplicationData = {
  amount: 12000,
  months: 22,
  firstName: '',
  lastName: '',
  gender: 'male',
  documentType: '',
  documentNumber: '',
};
export function createApplicationService(): ApplicationService {
  let data = { ...initial };
  return {
    async load() {
      return { ...data };
    },
    async update(update) {
      data = { ...data, ...update };
      return { ...data };
    },
  };
}
