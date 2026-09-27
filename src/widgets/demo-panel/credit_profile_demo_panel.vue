<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';
import { pageTitle, scenarioTitle } from './code';
import type { DemoPage, DemoScenario } from '@/shared/types';
import { ProfileButton, ProfileLink } from '@/shared/ui';

const props = defineProps<{
  pages: readonly DemoPage[];
  currentPage: string;
  currentState: string;
  currentOverlay: string;
  running: boolean;
}>();
const emit = defineEmits<{ select: [scenario: DemoScenario]; reset: []; simulate: [] }>();
const simulationAvailable = computed(
  () =>
    props.currentPage === 'check' ||
    (props.currentPage === 'transfer' && props.currentState !== 'interrupted'),
);
const expanded = ref(false);
const search = ref('');
const message = ref('');
const toggleButton = useTemplateRef<InstanceType<typeof ProfileButton>>('toggleButton');
const filtered = computed(() =>
  props.pages.filter((page) =>
    `${pageTitle(page.id)} ${page.path} ${page.scenarios.map((scenario) => scenarioTitle(scenario.state, scenario.overlay)).join(' ')}`
      .toLowerCase()
      .includes(search.value.toLowerCase()),
  ),
);
function toggle() {
  expanded.value = !expanded.value;
}
function escape(event: KeyboardEvent) {
  if (!expanded.value || event.key !== 'Escape') return;
  event.preventDefault();
  event.stopPropagation();
  expanded.value = false;
  (toggleButton.value?.$el as HTMLButtonElement | undefined)?.focus();
}
function select(event: MouseEvent) {
  const id = (event.currentTarget as HTMLElement).dataset.scenario;
  const scenario = props.pages.flatMap((page) => page.scenarios).find((item) => item.id === id);
  if (scenario) emit('select', scenario);
}
function reset() {
  emit('reset');
}
function simulate() {
  emit('simulate');
}
async function copy() {
  try {
    await navigator.clipboard.writeText(location.href);
    message.value = 'Ссылка скопирована';
  } catch {
    message.value = 'Скопируйте ссылку из адресной строки';
  }
}
function scenarioUrl(page: DemoPage, scenario: DemoScenario) {
  const query = new URLSearchParams({ state: scenario.state });
  if (scenario.overlay) query.set('overlay', scenario.overlay);
  return `${page.path}?${query}`;
}
</script>

<template>
  <aside
    lang="ru"
    :class="$style.panel"
    aria-label="Сервисное меню"
    data-demo-panel
    @keydown="escape"
  >
    <ProfileButton
      ref="toggleButton"
      :class="$style.toggle"
      :aria-expanded="expanded"
      aria-controls="demo-scenarios"
      @click="toggle"
      >{{ expanded ? '× Закрыть' : '◈ Меню' }}</ProfileButton
    >
    <section v-if="expanded" id="demo-scenarios" :class="$style.content">
      <header>
        <strong>Avanti · Сценарии</strong>
        <p>Локальный просмотр · без реальных операций</p>
      </header>
      <label :class="$style.search"
        >Поиск страницы или состояния<input v-model="search" type="search" name="scenario-search"
      /></label>
      <p v-if="!filtered.length" role="status">Ничего не найдено</p>
      <div :class="$style.actions">
        <ProfileButton @click="copy">Копировать ссылку</ProfileButton>
        <ProfileButton @click="reset">Сбросить</ProfileButton>
        <ProfileButton
          :aria-pressed="running"
          :disabled="!simulationAvailable"
          title="Локальная симуляция проверки банков и перевода"
          @click="simulate"
          >{{ running ? 'Пауза' : 'Запустить' }}</ProfileButton
        >
      </div>
      <p role="status">{{ message }}</p>
      <nav aria-label="Страницы и демонстрационные состояния">
        <section v-for="page in filtered" :key="page.id" :class="$style.page">
          <ProfileLink v-if="page.available" :to="page.path" :class="$style.pageLink">{{
            pageTitle(page.id)
          }}</ProfileLink>
          <p v-else :class="$style.pageLink">{{ pageTitle(page.id) }} · в разработке</p>
          <div v-if="page.available" :class="$style.states">
            <ProfileLink
              v-for="scenario in page.scenarios"
              :key="scenario.id"
              :to="scenarioUrl(page, scenario)"
              :data-scenario="scenario.id"
              :class="[
                $style.state,
                currentPage === page.id &&
                  currentState === scenario.state &&
                  currentOverlay === (scenario.overlay ?? '') &&
                  $style.active,
              ]"
              @navigate="select"
              >{{ scenarioTitle(scenario.state, scenario.overlay) }}</ProfileLink
            >
          </div>
        </section>
      </nav>
    </section>
  </aside>
</template>
<style module lang="scss" src="./styles/index.module.scss"></style>
