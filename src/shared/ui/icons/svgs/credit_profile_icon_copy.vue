<script setup lang="ts">
import { useId } from 'vue';
const svgId = useId();
</script>
<template>
  <svg
    preserveAspectRatio="none"
    overflow="visible"
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g :clip-path="'url(#' + svgId + '-clip0_0_186)'">
      <path
        d="M2.33296 9.33352C1.69124 9.33352 1.1662 8.80848 1.1662 8.16676V2.33296C1.1662 1.69124 1.69124 1.1662 2.33296 1.1662H8.16676C8.80848 1.1662 9.33352 1.69124 9.33352 2.33296M5.83324 4.66648H11.667C12.3114 4.66648 12.8338 5.18886 12.8338 5.83324V11.667C12.8338 12.3114 12.3114 12.8338 11.667 12.8338H5.83324C5.18886 12.8338 4.66648 12.3114 4.66648 11.667V5.83324C4.66648 5.18886 5.18886 4.66648 5.83324 4.66648Z"
        stroke="#2491AA"
        stroke-width="2"
        stroke-linecap="round"
      />
    </g>
    <defs>
      <clipPath :id="svgId + '-clip0_0_186'">
        <rect width="14" height="14" fill="white" />
      </clipPath>
    </defs>
  </svg>
</template>
