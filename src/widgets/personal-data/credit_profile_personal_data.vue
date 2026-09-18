<script setup lang="ts">
import { computed, ref } from 'vue';
import { useProfileStore } from '@/entities/profile';
import { ProfileButton, ProfileDataRow, ProfileIcon } from '@/shared/ui';
const props = defineProps<{ compact?: boolean }>();
const emit = defineEmits<{ edit: [] }>();
const store = useProfileStore();
const message = ref('');
const rows = computed(() => {
  const data = store.profile;
  const all = [
    { id: 'surname', label: 'Cognome', value: data.surname },
    { id: 'name', label: 'Nome', value: data.name },
    { id: 'email', label: 'Email', value: data.email },
    { id: 'amount', label: 'Importo approvato', value: data.approvedAmount },
    { id: 'type', label: 'Tipo di documento', value: data.documentType },
    { id: 'number', label: 'Tipo di documento', value: data.documentNumber },
  ];
  return props.compact ? all.slice(0, 2) : all;
});
function edit() {
  emit('edit');
}
async function copy() {
  if (!store.profile.iban) {
    message.value = 'IBAN non disponibile.';
    return;
  }
  try {
    await navigator.clipboard.writeText(store.profile.iban);
    message.value = 'IBAN copiato.';
  } catch {
    message.value = 'Impossibile copiare. Seleziona e copia il codice IBAN.';
  }
}
</script>
<template>
  <section :class="[$style.card, compact && $style.compact]" aria-label="Dati personali">
    <header :class="$style.heading">
      <h2>Dati personali</h2>
      <ProfileButton v-if="!compact" :class="$style.edit" @click="edit">
        Modifica nome
      </ProfileButton>
    </header>
    <dl :class="$style.data">
      <ProfileDataRow v-for="row in rows" :key="row.id" :label="row.label" :value="row.value" />
      <div v-if="!compact" :class="$style.iban">
        <dt>IBAN</dt>
        <dd>
          <span>{{ store.profile.iban || '-' }}</span>
          <ProfileButton variant="plain" aria-label="Copia IBAN" @click="copy">
            <ProfileIcon name="copy" />
          </ProfileButton>
        </dd>
      </div>
    </dl>
    <p v-if="message" :class="$style.message" role="status">{{ message }}</p>
  </section>
</template>
<style module lang="scss">
.card {
  padding: 24px;
  background: white;
  border: 0;
  outline: 1px solid var(--border);
  outline-offset: -1px;
  border-radius: 16px;
}
.heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
  h2 {
    font-size: 15px;
    font-weight: 600;
    line-height: 18px;
  }
}
.edit {
  width: 146px;
  height: 37px;
  font-weight: 500;
  font-size: 14px;
  color: var(--ink);
  border-width: 1px;
  padding: 10px 12px;
}
.data {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.iban {
  display: flex;
  flex-direction: column;
  gap: 6px;
  dt {
    color: var(--muted);
    font-size: 12px;
    line-height: 15px;
  }
  dd {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    background: var(--background);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 11px;
    min-height: 40px;
    font-size: 13px;
    font-weight: 600;
    overflow-wrap: anywhere;
  }
  button {
    flex: none;
    [data-profile-icon] {
      width: 14px;
      height: 14px;
    }
  }
}
.compact {
  min-height: 131px;
  .data {
    gap: 12px;
  }
}
.message {
  margin-top: 10px;
  font-size: 12px;
  color: var(--accent);
}
@media (max-width: 767px) {
  .card {
    padding: 16px;
  }
  .edit {
    width: auto;
    height: 31px;
    font-size: 12px;
    padding: 8px 12px;
  }
  .data {
    gap: 12px;
  }
  .iban {
    dt {
      font-size: 13px;
      line-height: 16px;
    }
    dd {
      min-height: 36px;
      padding: 9px;
    }
  }
}
@media (max-width: 767px) {
  .iban button [data-profile-icon] {
    width: 16px;
    height: 16px;
  }
}
</style>
