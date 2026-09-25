import { describe, expect, it } from 'vitest';
import { normalizeScenario, scenarios } from '../src/app/demo';
import inventory from '../docs/figma-inventory.json';

describe('Figma scenario registry', () => {
  it('covers every frame exactly once', () => {
    const ids = scenarios.flatMap((scenario) => Object.values(scenario.figma));
    expect(ids).toHaveLength(129);
    expect(new Set(ids).size).toBe(129);
    expect([...ids].sort()).toEqual(inventory.map((frame) => frame.id).sort());
  });
  it('normalizes unsupported state and overlays', () => {
    expect(normalizeScenario('amount', 'unknown', 'password')).toEqual({});
    expect(normalizeScenario('profile', undefined, 'name')).toEqual({ overlay: 'name' });
    expect(normalizeScenario('profile', ['default', 'other'], ['name'])).toEqual({});
  });
});
