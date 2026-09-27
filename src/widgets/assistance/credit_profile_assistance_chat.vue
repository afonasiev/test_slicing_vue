<script setup lang="ts">
import { nextTick, ref, useTemplateRef } from 'vue';
import { useAssistanceStore } from '@/entities/assistance';
import { ProfileButton, ProfileDialog, ProfileImage, ProfileIcon } from '@/shared/ui';
import { consultantAvatar } from '@/shared/assets';
import ChatMessage from './credit_profile_chat_message.vue';
const emit = defineEmits<{ close: [] }>();
const chat = useAssistanceStore();
const list = useTemplateRef('list');
const input = useTemplateRef('input');
const fileInput = useTemplateRef('fileInput');
const file = ref<File>();
const status = ref('');
function close() {
  emit('close');
}
function attach() {
  fileInput.value?.click();
}
function selectFile(event: Event) {
  const target = event.target as HTMLInputElement;
  const selected = target.files?.[0];
  target.value = '';
  if (!selected) return;
  if (selected.size > 20 * 1024 * 1024) {
    status.value = 'Il file deve essere inferiore a 20 MB.';
    return;
  }
  file.value = selected;
  status.value = `Allegato: ${selected.name}`;
  input.value?.focus();
}
async function send() {
  if (!chat.draft.trim() && !file.value) return;
  chat.send(file.value);
  file.value = undefined;
  status.value = 'Messaggio aggiunto alla conversazione demo.';
  await nextTick();
  list.value?.scrollTo({ top: list.value.scrollHeight });
  input.value?.focus();
}
</script>
<template>
  <ProfileDialog
    title="Assistenza — Schierano Deborah"
    :dialog-class="$style.dialog"
    @close="close"
  >
    <template #header
      ><header :class="$style.header">
        <span :class="$style.avatar"
          ><ProfileImage
            :src="consultantAvatar"
            alt="Schierano Deborah, consulente"
            :width="48"
            :height="48"
        /></span>
        <div>
          <h1>Schierano Deborah</h1>
          <p>Online <span>·</span> Risponde in ~30 sec</p>
        </div>
        <ProfileButton variant="plain" aria-label="Chiudi chat" :class="$style.close" @click="close"
          ><ProfileIcon name="chatClose"
        /></ProfileButton></header
    ></template>
    <section
      ref="list"
      :class="$style.messages"
      aria-label="Messaggi"
      role="log"
      aria-live="polite"
    >
      <p :class="$style.date"><span>29 agosto</span></p>
      <ChatMessage v-for="message in chat.messages" :key="message.id" :message="message" />
    </section>
    <p v-if="status" :class="$style.status" role="status">{{ status }}</p>
    <form :class="$style.composer" @submit.prevent="send">
      <input
        ref="fileInput"
        type="file"
        name="chat-attachment"
        :class="$style.hidden"
        aria-label="Allega un file"
        @change="selectFile"
      /><ProfileButton
        variant="plain"
        aria-label="Allega un file"
        :class="$style.attach"
        @click="attach"
        ><ProfileIcon name="chatAttachment" /></ProfileButton
      ><input
        ref="input"
        type="text"
        name="chat-message"
        v-model="chat.draft"
        aria-label="Messaggio"
        placeholder="Scrivi un messaggio…"
        autocomplete="off"
      /><ProfileButton
        type="submit"
        variant="primary"
        aria-label="Invia messaggio"
        :class="$style.send"
        ><ProfileIcon name="chatSend"
      /></ProfileButton>
    </form>
  </ProfileDialog>
</template>
<style module lang="scss" src="./styles/index.module.scss"></style>
