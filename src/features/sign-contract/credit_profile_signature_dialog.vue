<script setup lang="ts">
import { ref, useTemplateRef, useId } from 'vue';
import { ProfileDialog, ProfileLogo, ProfileButton, ProfileIcon } from '@/shared/ui';
const emit = defineEmits<{ close: []; signed: [image: string] }>();
const canvas = useTemplateRef('canvas');
const drawn = ref(false);
const error = ref('');
const keyboardDrawing = ref(false);
const helpId = useId();
let keyboardPoint = { x: 100, y: 200 };
function keyboard(event: KeyboardEvent) {
  const context = canvas.value?.getContext('2d');
  if (!context) return;
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    keyboardDrawing.value = !keyboardDrawing.value;
    context.beginPath();
    context.moveTo(keyboardPoint.x, keyboardPoint.y);
    context.lineWidth = 4;
    context.lineCap = 'round';
    context.strokeStyle = '#1a2332';
    return;
  }
  const directions: Record<string, [number, number]> = {
    ArrowLeft: [-10, 0],
    ArrowRight: [10, 0],
    ArrowUp: [0, -10],
    ArrowDown: [0, 10],
  };
  const delta = directions[event.key];
  if (!delta) return;
  event.preventDefault();
  keyboardPoint = {
    x: Math.max(2, Math.min(950, keyboardPoint.x + delta[0])),
    y: Math.max(2, Math.min(400, keyboardPoint.y + delta[1])),
  };
  if (keyboardDrawing.value) {
    context.lineTo(keyboardPoint.x, keyboardPoint.y);
    context.stroke();
    drawn.value = true;
    error.value = '';
  } else context.moveTo(keyboardPoint.x, keyboardPoint.y);
}
function keyboardStop() {
  keyboardDrawing.value = false;
}
let pointer: number | null = null;
function close() {
  emit('close');
}
function point(event: PointerEvent) {
  const rect = canvas.value!.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) * 952) / rect.width,
    y: ((event.clientY - rect.top) * 402) / rect.height,
  };
}
function start(event: PointerEvent) {
  if (pointer !== null || event.button !== 0) return;
  keyboardDrawing.value = false;
  const context = canvas.value?.getContext('2d');
  if (!context) return;
  canvas.value!.setPointerCapture(event.pointerId);
  pointer = event.pointerId;
  const p = point(event);
  context.beginPath();
  context.moveTo(p.x, p.y);
  context.lineWidth = 4;
  context.lineCap = 'round';
  context.lineJoin = 'round';
  context.strokeStyle = '#1a2332';
}
function move(event: PointerEvent) {
  if (pointer !== event.pointerId) return;
  const p = point(event);
  const context = canvas.value?.getContext('2d');
  context?.lineTo(p.x, p.y);
  context?.stroke();
  drawn.value = true;
  error.value = '';
}
function stop(event: PointerEvent) {
  if (pointer === event.pointerId) pointer = null;
}
function clear() {
  canvas.value?.getContext('2d')?.clearRect(0, 0, 952, 402);
  drawn.value = false;
  error.value = '';
  pointer = null;
  keyboardDrawing.value = false;
  keyboardPoint = { x: 100, y: 200 };
}
function confirm() {
  if (!drawn.value || !canvas.value) {
    error.value = 'Disegna la tua firma prima di confermare.';
    canvas.value?.focus();
    return;
  }
  emit('signed', canvas.value.toDataURL('image/png'));
}
</script>
<template>
  <ProfileDialog title="Firma il contratto" :dialog-class="$style.dialog" @close="close">
    <template #header="{ titleId }"
      ><header :class="$style.header">
        <ProfileButton :class="$style.close" variant="plain" aria-label="Chiudi" @click="close"
          ><ProfileIcon name="close"
        /></ProfileButton>
        <ProfileLogo :class="$style.logo" />
        <p>Firma elettronica</p>
        <h2 :id="titleId">Firma il contratto</h2>
        <p>Disegna la tua firma nell’area sottostante:</p>
      </header></template
    >
    <div :class="$style.body">
      <div :class="$style.pad">
        <canvas
          ref="canvas"
          width="952"
          height="402"
          tabindex="0"
          aria-label="Area firma"
          :aria-describedby="helpId"
          @keydown="keyboard"
          @blur="keyboardStop"
          @pointerdown="start"
          @pointermove="move"
          @pointerup="stop"
          @pointercancel="stop"
          @lostpointercapture="stop"
        />
        <span v-if="!drawn" :class="$style.placeholder">Firma qui...</span>
      </div>
      <p :id="helpId" :class="$style.keyboardHelp">
        Disegna con il mouse o con il dito. Con la tastiera: Invio attiva o ferma il tratto, le
        frecce muovono la penna.
      </p>
      <p :class="$style.keyboardHelp" role="status">
        {{ keyboardDrawing ? 'Tratto attivo' : 'Penna sollevata' }}
      </p>
      <p v-if="error" role="alert" :class="$style.error">{{ error }}</p>
      <div :class="$style.actions">
        <ProfileButton @click="clear">Cancella</ProfileButton
        ><ProfileButton variant="primary" @click="confirm">Conferma Firma</ProfileButton>
      </div>
    </div>
  </ProfileDialog>
</template>
<style module lang="scss" src="./styles/index.module.scss"></style>
