import { initialProfile } from '../model/data';
import type { ProfileService } from '../model/types';

export function createProfileService(): ProfileService {
  let profile = { ...initialProfile };
  let resendAvailableAt = 0;
  return {
    async load() {
      return { ...profile };
    },
    async update(data) {
      if (data.name !== undefined && !data.name.trim()) throw new Error('Inserisci il nome.');
      if (data.email !== undefined && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        throw new Error('Inserisci un indirizzo email valido.');
      }
      const changedEmail = data.email !== undefined && data.email !== profile.email;
      profile = {
        ...profile,
        ...data,
        emailVerified: changedEmail ? false : profile.emailVerified,
      };
      if (changedEmail) resendAvailableAt = 0;
      return { ...profile };
    },
    async changePassword(password) {
      if (password.length < 8) throw new Error('La password deve contenere almeno 8 caratteri.');
    },
    async verifyEmail(code) {
      if (code !== '123456') throw new Error('Codice non valido. Riprova.');
      profile.emailVerified = true;
      return { ...profile };
    },
    async resendCode() {
      if (Date.now() < resendAvailableAt)
        throw new Error('Attendi prima di inviare un nuovo codice.');
      resendAvailableAt = Date.now() + 30_000;
    },
  };
}
export const profileService = createProfileService();
