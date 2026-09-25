import { onMounted, onBeforeUnmount, ref } from 'vue';
export function useMediaQuery(query: string) {
  const media = window.matchMedia(query);
  const matches = ref(media.matches);
  function update() {
    matches.value = media.matches;
  }
  onMounted(() => media.addEventListener('change', update));
  onBeforeUnmount(() => media.removeEventListener('change', update));
  return matches;
}
