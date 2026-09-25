<script setup lang="ts">
import { ProfileImage } from '@/shared/ui';
defineProps<{ name: string; logo: string; status: 'verified' | 'checking' | 'waiting' }>();
const labels = { verified: 'Verificata', checking: 'Verificando', waiting: 'In attesa' };
</script>
<template>
  <li :data-bank="name" :class="[$style.card, $style[status]]">
    <ProfileImage :src="logo" :alt="name" :width="81" :height="62" :class="$style.logo" />
    <div :class="$style.info">
      <h2>{{ name }}</h2>
      <p>{{ labels[status] }}</p>
    </div>
  </li>
</template>
<style module lang="scss">
@use './styles/logos/index.scss';
.card {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  height: 70px;
  padding: 3px 7px;
  background: white;
  border: 1px solid var(--accent);
  border-radius: 12px;
}
.logo {
  width: 81px;
  height: 62px;
}
.logo img {
  object-fit: contain;
}
.info {
  min-width: 0;
  letter-spacing: 0.04em;
}
.info h2 {
  font-size: 16px;
  font-weight: 500;
  line-height: 19px;
  color: #424242;
}
.info p {
  font-size: 14px;
  font-weight: 300;
  line-height: 17px;
  margin-top: 2px;
  color: #747474;
}
.checking {
  border: 2px dashed var(--accent);
}
.waiting {
  border-color: #a0a0a0;
}
.waiting .info {
  opacity: 0.57;
}
@media (max-width: 767px) {
  .card {
    height: 80px;
    padding: 9px;
    flex-direction: column;
    gap: 6px;
    text-align: center;
  }
  .logo {
    width: 100%;
    height: 28px;
  }
  .info {
    width: 100%;
    letter-spacing: 0;
  }
  .info h2 {
    font-size: 13px;
    font-weight: 600;
    line-height: 16px;
  }
  .info p {
    font-size: 11px;
    font-weight: 400;
    line-height: 13px;
    margin-top: 1px;
  }
  .waiting {
    border-color: #e9e9e9;
  }
}
</style>
