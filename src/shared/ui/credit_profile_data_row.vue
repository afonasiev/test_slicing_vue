<script setup lang="ts">
defineProps<{ label: string; value: string }>();
</script>
<template>
  <div :class="$style.row">
    <dt>{{ label }}</dt>
    <dd>{{ value }}</dd>
  </div>
</template>
<style module lang="scss">
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 16px;
  dt {
    color: var(--muted);
    font-size: 12px;
  }
  dd {
    font-size: 13px;
    font-weight: 600;
    text-align: right;
    overflow-wrap: anywhere;
    min-width: 0;
  }
  @media (max-width: 767px) {
    dt {
      font-size: 13px;
    }
  }
}
</style>
