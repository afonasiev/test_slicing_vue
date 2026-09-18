import type { Profile } from './types';
import type { IconName } from '@/shared/ui';
export const initialProfile: Profile = {
  name: 'Marco Rossi',
  surname: 'Intesa Sanpaolo S.p.A.',
  email: 'ikoei@09gmail.com',
  approvedAmount: '12 000 €',
  documentType: 'Passaporto',
  documentNumber: 'AB1234567',
  iban: null,
  emailVerified: false,
};
interface Step {
  id: string;
  short: string;
  title: string;
  status: 'completed' | 'current' | 'pending';
  icon: IconName;
}
export const steps: readonly Step[] = [
  {
    id: 'simulation',
    short: 'Simul.',
    title: 'Simulazione completata',
    status: 'completed',
    icon: 'simulation',
  },
  {
    id: 'approval',
    short: 'Approv.',
    title: 'Credito approvato',
    status: 'completed',
    icon: 'approved',
  },
  {
    id: 'account',
    short: 'Account',
    title: 'Account creato',
    status: 'completed',
    icon: 'account',
  },
  {
    id: 'documents',
    short: 'Docum.',
    title: 'Documenti caricati',
    status: 'current',
    icon: 'uploadLarge',
  },
  {
    id: 'contract',
    short: 'Firma',
    title: 'Contratto firmato',
    status: 'pending',
    icon: 'penLarge',
  },
];
