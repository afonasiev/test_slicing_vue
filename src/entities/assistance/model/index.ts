import { ref } from 'vue';
import { defineStore } from 'pinia';
export interface ChatMessage {
  id: string;
  text: string;
  own: boolean;
  time?: string;
  attachment?: { url: string; name: string; image: boolean };
}
function initial(): ChatMessage[] {
  return [
    {
      id: 'welcome',
      own: false,
      text: 'Salve. Mi chiamo Deborah, sarò la sua consulente personale dedicata.',
    },
    { id: 'offer', own: false, text: 'Se avrà domande, non esiti a scrivermi.', time: '01:51' },
    { id: 'reply', own: true, text: 'Se avrà domande, non esiti a scrivermi.', time: '01:51' },
  ];
}
export const useAssistanceStore = defineStore('assistance', () => {
  const messages = ref<ChatMessage[]>(initial());
  const draft = ref('Voglio confermare il mio pagamento');
  function send(file?: File) {
    if (!draft.value.trim() && !file) return;
    messages.value.push({
      id: crypto.randomUUID(),
      own: true,
      text: draft.value.trim(),
      time: new Intl.DateTimeFormat('it-IT', { hour: '2-digit', minute: '2-digit' }).format(
        new Date(),
      ),
      attachment: file
        ? { url: URL.createObjectURL(file), name: file.name, image: file.type.startsWith('image/') }
        : undefined,
    });
    draft.value = '';
  }
  function reset() {
    for (const item of messages.value)
      if (item.attachment) URL.revokeObjectURL(item.attachment.url);
    messages.value = initial();
    draft.value = 'Voglio confermare il mio pagamento';
  }
  return { messages, draft, send, reset };
});
