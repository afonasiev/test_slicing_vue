<script setup lang="ts">
defineProps<{ src: string; alt: string; width: number; height: number }>();
</script>
<template>
  <span :class="$style.wrapper"><img :src="src" :alt="alt" :width="width" :height="height" /></span>
</template>
<style module lang="scss">
.wrapper {
  display: inline-flex;
  flex: none;
  overflow: hidden;
}
.wrapper img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
