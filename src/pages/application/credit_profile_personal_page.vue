<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { useRouter } from 'vue-router';
import { ApplicationShell, ApplicationNavigation } from '@/widgets/application-shell';
import { PersonalForm } from '@/features/personal-form';
const router = useRouter();
const form = useTemplateRef('form');
function back() {
  void router.push({ name: 'amount' });
}
async function next() {
  if (await form.value?.save()) {
    void router.push({ name: 'check' });
  }
}
</script>
<template>
  <ApplicationShell>
    <main :class="$style.content">
      <PersonalForm ref="form"
        ><ApplicationNavigation :class="$style.navigation" @back="back" @next="next"
      /></PersonalForm>
    </main>
  </ApplicationShell>
</template>
<style module lang="scss">
.content {
  max-width: 1317px;
  padding: 48px 100px 80px;
  margin: auto;
}
.message {
  margin-top: 24px;
}
@media (max-width: 1199px) {
  .content {
    padding-inline: 24px;
  }
}
@media (max-width: 767px) {
  .content {
    padding: 24px 16px 48px;
  }
  .navigation button {
    height: 50px;
  }
}
</style>
