<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch, useTemplateRef, nextTick } from 'vue';
import { profileService, useProfileStore } from '@/entities/profile';
import { ProfileButton, ProfileBadge } from '@/shared/ui';
import ProfileOtpInput from './credit_profile_otp_input.vue';
const store = useProfileStore();
const otp = useTemplateRef('otp');
const code = ref('');
const error = ref('');
const notice = ref('');
const busy = ref(false);
const seconds = ref(0);
let resendAvailableAt = 0;
function updateCountdown() {
  seconds.value = Math.max(0, Math.ceil((resendAvailableAt - Date.now()) / 1000));
  if (!seconds.value) clearInterval(timer);
}
let timer: ReturnType<typeof setInterval> | undefined;
const resendText = computed(() =>
  seconds.value ? `Invia di nuovo (${seconds.value}s)` : 'Invia di nuovo',
);
function reset() {
  code.value = '';
  error.value = '';
  notice.value = '';
  seconds.value = 0;
  resendAvailableAt = 0;
  clearInterval(timer);
}
watch(() => store.profile.email, reset);
watch(code, () => {
  error.value = '';
});
onMounted(() => document.addEventListener('visibilitychange', updateCountdown));
onBeforeUnmount(() => {
  clearInterval(timer);
  document.removeEventListener('visibilitychange', updateCountdown);
});
async function verify() {
  if (busy.value) return;
  if (!/^\d{6}$/.test(code.value)) {
    error.value = 'Inserisci tutte le 6 cifre.';
    await nextTick();
    otp.value?.focusFirst();
    return;
  }
  busy.value = true;
  error.value = '';
  notice.value = '';
  try {
    await store.verify(code.value);
    notice.value = 'Email verificata con successo.';
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Verifica non riuscita. Riprova.';
    await nextTick();
    otp.value?.focusFirst();
  } finally {
    busy.value = false;
  }
}
async function resend() {
  if (seconds.value || busy.value) return;
  busy.value = true;
  try {
    await profileService.resendCode();
    code.value = '';
    error.value = '';
    notice.value = 'Codice inviato (modalità demo).';
    resendAvailableAt = Date.now() + 30_000;
    updateCountdown();
    timer = setInterval(updateCountdown, 1000);
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Invio non riuscito. Riprova.';
  } finally {
    busy.value = false;
  }
}
</script>
<template>
  <section :class="$style.verification" aria-label="Verifica email">
    <header :class="$style.heading">
      <h3><span :class="$style.question">?</span>Verifica email</h3>
      <ProfileBadge variant="white" :class="$style.badge">
        {{ store.profile.emailVerified ? 'Verificata' : 'Non verificata' }}
      </ProfileBadge>
    </header>
    <form v-if="!store.profile.emailVerified" :class="$style.form" @submit.prevent="verify">
      <div :class="$style.content">
        <p :class="$style.description">
          Verifica il tuo indirizzo email per proteggere il tuo account.
        </p>
        <p :class="$style.instruction">Inserisci il codice a 6 cifre inviato alla tua email:</p>
        <ProfileOtpInput ref="otp" v-model="code" :invalid="!!error" />
      </div>
      <div :class="$style.actions">
        <ProfileButton type="submit" variant="primary" :class="$style.confirm" :disabled="busy">
          CONFERMA
        </ProfileButton>
        <div :class="$style.resend">
          <p>Non hai ricevuto il codice?</p>
          <ProfileButton
            variant="plain"
            :class="$style.link"
            :disabled="seconds > 0 || busy"
            @click="resend"
          >
            {{ resendText }}
          </ProfileButton>
        </div>
      </div>
    </form>
    <p v-if="error" :class="$style.error" role="alert">{{ error }}</p>
    <p v-if="notice" :class="$style.notice" role="status">{{ notice }}</p>
  </section>
</template>
<style module lang="scss">
.verification {
  padding: 16px;
  border-radius: 10px;
  background: var(--tint);
}
.heading {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  h3 {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    line-height: 16px;
  }
}
.question {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: var(--accent);
  background: white;
  font-size: 11px;
  font-weight: 700;
}
.badge {
  font-size: 11px;
  line-height: 13px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 12px;
  color: var(--accent);
  background: white;
  white-space: nowrap;
}
.form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.content {
  font-size: 13px;
  line-height: 16px;
}
.description {
  color: var(--muted);
  margin-bottom: 20px;
}
.instruction {
  margin-bottom: 10px;
}
.actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
.confirm {
  width: 160px;
  height: 36px;
  font-size: 16px;
  line-height: 20px;
  font-weight: 500;
}
.resend {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  font-size: 13px;
  line-height: 16px;
  color: var(--muted);
}
.link {
  font-size: 13px;
  line-height: 16px;
  font-weight: 600;
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 2px;
}
.error,
.notice {
  margin-top: 12px;
  font-size: 12px;
  line-height: 16px;
}
.error {
  color: #b42318;
}
.notice {
  color: var(--accent);
}
@media (max-width: 767px) {
  .verification {
    padding: 14px;
  }
  .heading {
    justify-content: space-between;
    margin-bottom: 18px;
    gap: 6px;
  }
  .content {
    font-size: 12px;
    line-height: 15px;
  }
  .actions {
    flex-direction: column;
    gap: 10px;
  }
  .confirm {
    width: 100%;
    font-size: 14px;
  }
  .resend {
    align-items: center;
    gap: 2px;
    font-size: 12px;
    line-height: 15px;
  }
  .link {
    font-size: 12px;
    line-height: 15px;
  }
}
</style>
