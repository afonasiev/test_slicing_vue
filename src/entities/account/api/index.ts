import type { AccountService } from '../types';
// Local presentation adapter. No credentials are stored or sent over the network.
export const accountService: AccountService = {
  async enter(email) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      throw new Error('Inserisci un indirizzo email valido.');
    }
    return { email: email.trim() };
  },
};
