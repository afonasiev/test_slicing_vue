import data from './scenarios.json';
import { routeManifest } from '@/shared/config';
import type { DemoPage, DemoScenario } from '@/shared/types';

export const scenarios: readonly DemoScenario[] = data;
export const demoPages: readonly DemoPage[] = routeManifest.map((page) => ({
  ...page,
  available: true,
  scenarios: scenarios.filter((scenario) => scenario.page === page.id),
}));

export function normalizeScenario(page: string, state: unknown, overlay: unknown) {
  const available = scenarios.filter((scenario) => scenario.page === page);
  const base = available.find((scenario) => scenario.state === state) ?? available[0];
  if (!base) return {};
  const result: Record<string, string> = {};
  if (base.state !== available[0]?.state) result.state = base.state;
  if (overlay === 'chat' && page !== 'assistance') result.overlay = 'chat';
  else if (
    page === 'profile' &&
    typeof overlay === 'string' &&
    ['name', 'email', 'password'].includes(overlay)
  )
    result.overlay = overlay;
  else if (
    available.some((scenario) => scenario.state === base.state && scenario.overlay === overlay)
  ) {
    if (typeof overlay === 'string') result.overlay = overlay;
  }
  return result;
}
