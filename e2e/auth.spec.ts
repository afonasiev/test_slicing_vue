import { test, expect } from '@playwright/test';

test('registration validates passwords, supports visibility and updates the profile', async ({
  page,
}) => {
  await page.goto('./application/approved');
  await page.getByRole('button', { name: 'Finalizza la mia richiesta' }).click();
  await expect(page).toHaveURL(/\/auth\/register$/);
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('INDIRIZZO EMAIL', { exact: true }).fill('mario@example.com');
  await dialog.getByLabel('PASSWORD', { exact: true }).fill('short');
  await dialog.getByLabel('CONFERMA PASSWORD', { exact: true }).fill('different');
  await dialog.getByRole('button', { name: 'Crea account e accedi' }).click();
  await expect(dialog.getByRole('alert')).toContainText('8 caratteri');
  await expect(dialog.getByLabel('PASSWORD', { exact: true })).toBeFocused();
  await dialog.getByLabel('PASSWORD', { exact: true }).fill('DemoPass123');
  await dialog.getByRole('button', { name: 'Crea account e accedi' }).click();
  await expect(dialog.getByRole('alert')).toContainText('non coincidono');
  await dialog.getByRole('button', { name: 'Mostra password', exact: true }).first().click();
  await expect(dialog.getByLabel('PASSWORD', { exact: true })).toHaveAttribute('type', 'text');
  await dialog.getByLabel('CONFERMA PASSWORD', { exact: true }).fill('DemoPass123');
  await dialog.getByRole('button', { name: 'Crea account e accedi' }).click();
  await expect(page.getByRole('main', { name: 'Home Avanti' })).toBeVisible();
  await page.getByRole('link', { name: 'Profilo', exact: true }).first().click();
  await expect(page.getByText('mario@example.com').first()).toBeVisible();
});

test('auth routes support tabs, Escape, backdrop and direct entry', async ({ page }) => {
  await page.goto('./auth/register');
  await page.getByRole('dialog').getByRole('link', { name: 'Accedi', exact: true }).click();
  await expect(page).toHaveURL(/\/auth\/login$/);
  await expect(page.getByLabel('CONFERMA PASSWORD', { exact: true })).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page).toHaveURL(/\/application\/approved$/);
  await page.goBack();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.mouse.click(5, 5);
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

for (const route of ['register', 'login']) {
  for (const width of [320, 390, 768, 1440]) {
    test(`${route} auth layout ${width}`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: width < 768 ? 844 : 1001 });
      await page.goto(`./auth/${route}`);
      await page.evaluate(() => document.fonts.ready);
      await expect
        .poll(async () =>
          page
            .locator('[data-profile-icon]')
            .evaluateAll((nodes) => nodes.every((node) => node.querySelector('svg'))),
        )
        .toBe(true);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
      const dialog = page.getByRole('dialog');
      expect(await dialog.evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true);
      await page.screenshot({
        path: `output/playwright/${testInfo.project.name}/${route}-${width}.png`,
        fullPage: true,
        style: '[data-demo-panel] { visibility: hidden; }',
      });
    });
  }
}
