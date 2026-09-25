import data from './scenarios.json';
import { routeManifest } from '@/shared/config';
import type { DemoPage, DemoScenario } from '@/shared/types';

export const scenarios: readonly DemoScenario[] = data;
function implemented(scenario: DemoScenario) {
  if (scenario.page === 'withdrawal') return scenario.state === 'default';
  if (scenario.page === 'commission') return scenario.state === 'legacy';
  return true;
}
export const demoPages: readonly DemoPage[] = routeManifest.map((page) => ({
  ...page,
  available: [
    'home',
    'withdrawal',
    'commission',
    'documents',
    'iban',
    'contract',
    'profile',
    'amount',
    'personal',
    'check',
    'approved',
    'register',
    'login',
  ].includes(page.id),
  scenarios: scenarios.filter((scenario) => scenario.page === page.id && implemented(scenario)),
}));

export function normalizeScenario(page: string, state: unknown, overlay: unknown) {
  const available = scenarios.filter((scenario) => scenario.page === page && implemented(scenario));
  const base = available.find((scenario) => scenario.state === state) ?? available[0];
  if (!base) return {};
  const result: Record<string, string> = {};
  if (base.state !== available[0]?.state) result.state = base.state;
  if (overlay === 'chat' && page !== 'assistance') result.overlay = 'chat';
  else if (
    available.some((scenario) => scenario.state === base.state && scenario.overlay === overlay)
  ) {
    if (typeof overlay === 'string') result.overlay = overlay;
  }
  return result;
}
