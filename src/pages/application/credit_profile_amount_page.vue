<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { useRouter } from 'vue-router';
import { ApplicationShell, ApplicationNavigation } from '@/widgets/application-shell';
import { LoanAmount } from '@/features/loan-amount';
const router = useRouter();
const form = useTemplateRef('form');
function back() {
  void router.push('/');
}
async function next() {
  if (await form.value?.save()) void router.push('/application/personal-data');
}
</script>
<template>
  <ApplicationShell
    ><main :class="$style.content">
      <LoanAmount ref="form" /><ApplicationNavigation
        :class="$style.navigation"
        @back="back"
        @next="next"
      /></main
  ></ApplicationShell>
</template>
<style module lang="scss">
.content {
  max-width: 1440px;
  margin: auto;
  padding: 51px 100px 70px;
}
.navigation {
  margin-top: 123px;
}
@media (max-width: 1199px) {
  .content {
    padding-inline: 24px;
  }
}
@media (max-width: 767px) {
  .content {
    padding: 24px 20px 32px;
  }
  .navigation {
    margin-top: 28px;
  }
}
</style>
