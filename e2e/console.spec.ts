import { test, expect } from '@playwright/test';

test('modal routes and tabs have no browser console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error' || message.text().includes('[Vue')) errors.push(message.text());
  });
  await page.goto('./unknown-page');
  await expect(page).toHaveURL(/\/$/);
  await page.goto('./auth/register');
  for (let index = 0; index < 3; index++) {
    await expect(
      page.getByRole('navigation', { name: 'Accesso account' }).getByRole('link').first(),
    ).toHaveText('Crea account');
    await page.getByRole('dialog').getByRole('link', { name: 'Accedi', exact: true }).click();
    await page.getByRole('dialog').getByRole('link', { name: 'Crea account', exact: true }).click();
  }
  await page.getByRole('button', { name: '◈ Меню', exact: true }).click();
  await page.getByRole('link', { name: 'Профиль', exact: true }).click();
  for (const scenario of [
    'profile-default-name',
    'profile-default-email',
    'profile-default-password',
  ]) {
    await page.locator(`[data-scenario="${scenario}"]`).click();
    await expect(page.getByRole('dialog')).toBeVisible();
  }
  await page.getByRole('button', { name: 'Сбросить', exact: true }).click();
  await page.getByRole('link', { name: 'Регистрация', exact: true }).click();
  await page.getByRole('button', { name: 'Сбросить', exact: true }).click();
  await page.getByRole('button', { name: '× Закрыть', exact: true }).click();
  await page.getByRole('dialog').getByRole('link', { name: 'Accedi', exact: true }).click();
  await page.goBack();
  await page.goForward();
  await page.keyboard.press('Escape');
  expect(errors).toEqual([]);
});
