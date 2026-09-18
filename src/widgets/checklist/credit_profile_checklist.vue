<script setup lang="ts">
import { steps } from '@/entities/profile';
import { ProfileButton, ProfileIcon, ProfileBadge, ProfileCollapsible } from '@/shared/ui';
const emit = defineEmits<{ navigate: [destination: string] }>();
function documents() {
  emit('navigate', 'documents');
}
</script>
<template>
  <ProfileCollapsible :class="$style.card" aria-label="Checklist di verifica">
    <template #header="{ expanded, toggle, contentId }">
      <header :class="$style.heading">
        <div :class="$style.title">
          <p>Completa tutti gli step</p>
          <h2>Per il prelievo dei fondi, completa tutti gli step</h2>
        </div>
        <div :class="$style.controls">
          <ProfileBadge :class="$style.badge">3 / 5 completati</ProfileBadge>
          <ProfileButton
            variant="plain"
            :class="[$style.toggle, !expanded && $style.collapsed]"
            :aria-expanded="expanded"
            :aria-controls="contentId"
            aria-label="Mostra o nascondi gli step"
            @click="toggle"
          >
            <ProfileIcon name="chevron" />
          </ProfileButton>
        </div>
      </header>
    </template>
    <div>
      <ol :class="$style.list">
        <li v-for="step in steps" :key="step.id" :class="[$style.step, $style[step.status]]">
          <span :class="$style.stepIcon"><ProfileIcon :name="step.icon" /></span>
          <div :class="$style.text">
            <h3>{{ step.title }}</h3>
            <p v-if="step.status === 'completed'">Completato</p>
            <p v-else-if="step.status === 'current'">Step attuale • Azione richiesta</p>
            <p v-else>In attesa</p>
          </div>
          <span v-if="step.status === 'completed'" :class="$style.done">
            <ProfileIcon name="checkSmall" />
          </span>
          <ProfileButton
            v-else-if="step.status === 'current'"
            variant="plain"
            :class="$style.next"
            aria-label="Vai ai documenti"
            @click="documents"
          >
            <ProfileIcon name="arrow" />
          </ProfileButton>
          <span v-else :class="$style.waiting" aria-label="In attesa">
            <ProfileIcon name="arrowMuted" />
          </span>
        </li>
      </ol>
      <div
        :class="$style.progress"
        role="progressbar"
        aria-label="Step completati"
        :aria-valuenow="3"
        :aria-valuemin="0"
        :aria-valuemax="5"
      >
        <span v-for="step in steps" :key="step.id" :class="$style[step.status]" />
      </div>
    </div>
  </ProfileCollapsible>
</template>
<style module lang="scss" src="./styles/index.module.scss"></style>
