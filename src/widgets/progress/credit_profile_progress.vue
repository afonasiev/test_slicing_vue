<script setup lang="ts">
import { steps } from '@/entities/profile';
import { ProfileButton, ProfileIcon } from '@/shared/ui';
const emit = defineEmits<{ navigate: [destination: string] }>();
function documents() {
  emit('navigate', 'documents');
}
</script>
<template>
  <section :class="$style.progress" aria-label="Avanzamento della richiesta">
    <div :class="$style.heading"><strong>Passo 4 di 5</strong><span>3 / 5 completati</span></div>
    <ol :class="$style.steps">
      <li v-for="step in steps" :key="step.id" :class="[$style.step, $style[step.status]]">
        <ProfileButton
          v-if="step.status === 'current'"
          variant="plain"
          :class="$style.circle"
          aria-label="Documenti"
          @click="documents"
        >
          <ProfileIcon name="upload" />
        </ProfileButton>
        <span v-else :class="$style.circle">
          <ProfileIcon v-if="step.status === 'completed'" name="check" />
          <ProfileIcon v-else name="pen" />
        </span>
        <span :class="$style.label">{{ step.short }}</span>
      </li>
    </ol>
  </section>
</template>
<style module lang="scss">
.progress {
  padding: 20px 24px;
  border: 0;
  outline: 1px solid #e2edf0;
  outline-offset: -1px;
  border-radius: 16px;
  background: white;
  box-shadow: 0 2px 4px #1a23320f;
  height: 130px;
}
.heading {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  line-height: 16px;
  strong {
    font-weight: 700;
  }
  span {
    color: var(--muted);
    font-weight: 500;
  }
}
.steps {
  position: relative;
  list-style: none;
  margin: 16px 0 0;
  padding: 0;
  display: flex;
  justify-content: space-between;
  &::before {
    content: '';
    position: absolute;
    left: 54px;
    right: 54px;
    top: 17px;
    height: 2px;
    background: linear-gradient(to right, var(--accent) 75%, #d4d4d8 75%);
  }
}
.step {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 108px;
  flex: none;
  gap: 8px;
}
.circle {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--accent);
  position: relative;
  z-index: 1;
}
.label {
  font-size: 11px;
  line-height: 14px;
  font-weight: 600;
  color: var(--accent);
}
.current {
  .circle {
    border: 2px solid var(--accent);
    background: var(--tint);
  }
  &::after {
    background: #d4d4d8;
  }
}
.pending {
  .circle {
    border: 2px solid #d4d4d8;
    background: #f4f4f5;
  }
  .label {
    color: var(--faint);
    font-weight: 500;
  }
}
@media (max-width: 767px) {
  .progress {
    padding: 16px;
    height: 104px;
  }
  .steps {
    margin-top: 12px;
    &::before {
      left: 14px;
      right: 14px;
      top: 21px;
    }
  }
  .step {
    width: auto;
    gap: 4px;
    background: white;
  }
  .circle {
    width: 28px;
    height: 28px;
    [data-profile-icon] {
      width: 28px;
      height: 28px;
    }
  }
  .current .circle,
  .pending .circle {
    border: 0;
  }
  .label {
    font-size: 10px;
    line-height: 12px;
  }
}
</style>
