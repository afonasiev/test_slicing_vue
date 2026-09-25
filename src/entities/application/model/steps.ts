import type { IconName } from '@/shared/ui';
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
export function getSteps(completed: number): readonly Step[] {
  return steps.map((step, index) => ({
    ...step,
    status: index < completed ? 'completed' : index === completed ? 'current' : 'pending',
  }));
}
