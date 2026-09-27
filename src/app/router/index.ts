import { createRouter, createWebHistory } from 'vue-router';
import { routeManifest } from '@/shared/config';
import { normalizeScenario } from '../demo';

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/cabinet').then((module) => module.HomePage),
      meta: { section: 'home' },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/pages/profile').then((module) => module.CreditProfilePage),
      meta: { section: 'profile' },
    },
    {
      path: '/application/amount',
      name: 'amount',
      component: () => import('@/pages/application').then((module) => module.AmountPage),
      meta: { section: 'application' },
    },
    {
      path: '/application/personal-data',
      name: 'personal',
      component: () => import('@/pages/application').then((module) => module.PersonalPage),
      meta: { section: 'application' },
    },
    {
      path: '/application/check',
      name: 'check',
      component: () => import('@/pages/application').then((module) => module.CheckPage),
      meta: { section: 'application' },
    },
    {
      path: '/application/approved',
      name: 'approved',
      component: () => import('@/pages/application').then((module) => module.ApprovedPage),
      meta: { section: 'application' },
    },
    ...(['register', 'login'] as const).map((name) => ({
      path: `/auth/${name}`,
      name,
      component: () => import('@/pages/application').then((module) => module.ApprovedPage),
      meta: { section: 'application' },
    })),
    {
      path: '/documents',
      name: 'documents',
      component: () => import('@/pages/cabinet').then((module) => module.DocumentsPage),
      meta: { section: 'documents' },
    },
    {
      path: '/documents/iban',
      name: 'iban',
      component: () => import('@/pages/cabinet').then((module) => module.IbanPage),
      meta: { section: 'documents' },
    },
    {
      path: '/contract',
      name: 'contract',
      component: () => import('@/pages/cabinet').then((module) => module.ContractPage),
      meta: { section: 'documents' },
    },
    {
      path: '/withdrawal',
      name: 'withdrawal',
      component: () => import('@/pages/cabinet').then((module) => module.WithdrawalPage),
      meta: { section: 'home' },
    },
    {
      path: '/commission',
      name: 'commission',
      component: () => import('@/pages/cabinet').then((module) => module.CommissionPage),
      meta: { section: 'home' },
    },
    {
      path: '/transfer',
      name: 'transfer',
      component: () => import('@/pages/cabinet').then((module) => module.TransferPage),
      meta: { section: 'home' },
    },
    {
      path: '/certificate',
      name: 'certificate',
      component: () => import('@/pages/cabinet').then((module) => module.CertificatePage),
      meta: { section: 'home' },
    },
    {
      path: '/verification',
      name: 'verification',
      component: () => import('@/pages/cabinet').then((module) => module.VerificationPage),
      meta: { section: 'home' },
    },
    {
      path: '/assistance',
      name: 'assistance',
      component: () => import('@/pages/cabinet').then((module) => module.HomePage),
      meta: { section: 'home' },
    },
    { path: '/:pathMatch(.*)*', redirect: { name: 'home', params: {} } },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.path === from.path) return false;
    return { top: 0 };
  },
});
router.beforeEach((to) => {
  const query = normalizeScenario(String(to.name), to.query.state, to.query.overlay);
  if (JSON.stringify(query) !== JSON.stringify(to.query))
    return { path: to.path, query, replace: true };
});

router.afterEach((to) => {
  document.title = `Avanti — ${routeManifest.find((page) => page.id === to.name)?.title ?? 'Home'}`;
});
