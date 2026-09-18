<script setup lang="ts">
withDefaults(defineProps<{ variant?: 'soft' | 'white' | 'notification'; label?: string }>(), {
  variant: 'soft',
});
</script>
<template>
  <span :class="[$style.badge, $style[variant]]" :aria-label="label"><slot /></span>
</template>
<style module lang="scss">
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  font-weight: 600;
}
.soft {
  color: var(--accent);
  background: var(--tint);
  border-radius: 99px;
  padding: 4px 12px;
  font-size: 12px;
}
.white {
  color: var(--accent);
  background: white;
  border-radius: 12px;
  padding: 3px 10px;
  font-size: 11px;
}
.notification {
  color: white;
  background: #ef4444;
  border: 2px solid white;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  font-size: 11px;
}
</style>
