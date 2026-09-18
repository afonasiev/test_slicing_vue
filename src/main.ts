import './app/styles/index.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { CreditProfileApp } from './app';

const app = createApp(CreditProfileApp);

app.use(createPinia());

app.mount('#app');
