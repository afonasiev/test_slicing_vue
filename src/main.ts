import './app/styles/index.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { CreditProfileApp, router } from './app';

const app = createApp(CreditProfileApp);

app.use(createPinia());
app.use(router);

app.mount('#app');
