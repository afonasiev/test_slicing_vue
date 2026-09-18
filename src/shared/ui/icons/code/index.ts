// Adapted from test_orbitto/src/shared/ui/icons/helpers.
// A single lazy glob preserves separate SVG chunks; no eager map in the entry bundle.
import { defineAsyncComponent, type Component } from 'vue';
import type { IconName, IconProps } from '../types';
const modules = import.meta.glob<{ default: Component }>('../svgs/*.vue');
const cache = new Map<IconName, Component>();
export function resolveIconComponent(name: IconName): Component {
  const cached = cache.get(name);
  if (cached) return cached;
  const loader = modules[`../svgs/credit_profile_icon_${name}.vue`];
  if (!loader) throw new Error(`Unknown icon: ${name}`);
  const component = defineAsyncComponent({
    loader,
    onError(_error, retry, fail, attempts) {
      if (attempts < 3) retry();
      else fail();
    },
  });
  cache.set(name, component);
  return component;
}
export function buildA11yAttrs(props: IconProps) {
  return props.decorative !== false
    ? { 'aria-hidden': 'true' as const }
    : {
        role: 'img',
        'aria-label': props.ariaLabel || props.title || props.name,
      };
}
