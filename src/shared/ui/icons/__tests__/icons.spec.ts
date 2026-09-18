import { describe, expect, it } from 'vitest';
import { buildA11yAttrs, resolveIconComponent } from '../code';

describe('async icons', () => {
  it('caches a component loader instead of recreating it on each render', () => {
    expect(resolveIconComponent('check')).toBe(resolveIconComponent('check'));
  });
  it('hides decorative icons and names meaningful ones', () => {
    expect(buildA11yAttrs({ name: 'check' })).toEqual({ 'aria-hidden': 'true' });
    expect(buildA11yAttrs({ name: 'check', decorative: false, ariaLabel: 'Completato' })).toEqual({
      role: 'img',
      'aria-label': 'Completato',
    });
  });
});
