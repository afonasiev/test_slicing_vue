<script setup lang="ts">
import type { ChatMessage } from '@/entities/assistance';
import { ProfileImage } from '@/shared/ui';
import { avatar, consultantAvatar } from '@/shared/assets';
defineProps<{ message: ChatMessage }>();
</script>
<template>
  <article :class="[$style.message, message.own && $style.own]">
    <ProfileImage
      :src="message.own ? avatar : consultantAvatar"
      :alt="message.own ? 'Tu' : 'Deborah'"
      :width="28"
      :height="28"
      :class="$style.avatar"
    />
    <div :class="$style.bubble">
      <p v-if="message.text">{{ message.text }}</p>
      <a
        v-if="message.attachment"
        :href="message.attachment.url"
        :download="message.attachment.name"
        :class="$style.attachment"
        ><ProfileImage
          v-if="message.attachment.image"
          :src="message.attachment.url"
          :alt="message.attachment.name"
          :width="242"
          :height="160"
        />{{ message.attachment.name }}</a
      >
      <time v-if="message.time">{{ message.time }}</time>
    </div>
  </article>
</template>
<style module lang="scss" src="./styles/message/index.module.scss"></style>
