<script setup lang="ts">
import { useId } from 'vue';
const svgId = useId();
</script>
<template>
  <svg
    preserveAspectRatio="none"
    overflow="visible"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g :clip-path="'url(#' + svgId + '-clip0_0_212)'">
      <path
        d="M15 7.61112C15.0026 8.63771 14.7628 9.65038 14.3 10.5667C13.7512 11.6647 12.9076 12.5883 11.8635 13.2339C10.8195 13.8795 9.61636 14.2218 8.38888 14.2222C7.36229 14.2249 6.34964 13.9851 5.43333 13.5222L1 15L2.47778 10.5667C2.01494 9.65038 1.7751 8.63771 1.77778 7.61112C1.77825 6.38363 2.12047 5.18048 2.76611 4.13647C3.41175 3.09246 4.3353 2.24882 5.43333 1.70002C6.34964 1.23719 7.36229 0.997347 8.38888 1.00002H8.77777C10.3989 1.08948 11.9301 1.77375 13.0782 2.92182C14.2262 4.0699 14.9105 5.6011 15 7.22223V7.61112Z"
        stroke="white"
        stroke-width="1.27273"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>
    <defs>
      <clipPath :id="svgId + '-clip0_0_212'">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
</template>
