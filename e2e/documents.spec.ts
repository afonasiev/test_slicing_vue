import { test, expect } from '@playwright/test';

test('document upload, IBAN confirmation and signature work locally', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('./documents');
  await page.getByLabel('Passaporto', { exact: false }).check();
  await page
    .getByLabel('Foto del documento', { exact: true })
    .setInputFiles({ name: 'invalid.txt', mimeType: 'text/plain', buffer: Buffer.from('invalid') });
  await expect(page.getByRole('alert')).toContainText('JPG');
  await page
    .getByLabel('Foto del documento', { exact: true })
    .setInputFiles('src/shared/assets/icons/avatar.png');
  await expect(
    page.getByRole('img', { name: 'Anteprima del documento selezionato' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Carica il documento', exact: true }).click();
  await expect(page).toHaveURL(/state=success/);
  await page.getByRole('link', { name: 'Continua — IBAN' }).click();
  await page.getByRole('button', { name: 'Continua', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('IBAN valido');
  await page.getByLabel('IBAN', { exact: true }).fill('IT60 X054 2811 1010 0000 0123 456');
  await page.getByRole('button', { name: 'Continua', exact: true }).click();
  await expect(page).toHaveURL(/state=verification/);
  await page.getByRole('button', { name: 'Conferma', exact: true }).click();
  await expect(page).toHaveURL(/\/contract$/);
  await page.getByRole('button', { name: 'Firma il contratto', exact: true }).click();
  await page.getByRole('button', { name: 'Conferma Firma', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Disegna');
  const canvas = page.locator('canvas');
  const box = (await canvas.boundingBox())!;
  await page.mouse.move(box.x + 30, box.y + 60);
  await page.mouse.down();
  await page.mouse.move(box.x + 90, box.y + 100, { steps: 8 });
  await page.mouse.move(box.x + 140, box.y + 30, { steps: 8 });
  await page.mouse.up();
  await page.getByRole('button', { name: 'Conferma Firma', exact: true }).click();
  await expect(page.getByText('Contratto firmato con successo.')).toBeVisible();
  await expect(page.getByRole('img', { name: 'Firma del Prenditore' })).toBeVisible();
  expect(errors).toEqual([]);
});

for (const width of [320, 390, 768, 1440, 1920]) {
  for (const path of [
    'documents',
    'documents?state=error',
    'documents?state=success',
    'documents/iban',
    'contract',
    'contract?overlay=signature',
  ]) {
    test(`${path} responsive ${width}`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 1000 });
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.goto(`./${path}`);
      await page.evaluate(() => document.fonts.ready);
      await expect
        .poll(() =>
          page
            .locator('[data-profile-icon]')
            .evaluateAll((nodes) => nodes.every((node) => node.querySelector('svg'))),
        )
        .toBe(true);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
      expect(
        await page
          .locator('dialog')
          .evaluateAll((nodes) => nodes.every((node) => node.scrollWidth <= node.clientWidth)),
      ).toBe(true);
      await page.screenshot({
        path: `output/playwright/documents/${testInfo.project.name}/${path.replace(/[/?=]/g, '-')}-${width}.png`,
        fullPage: true,
        style: '[data-demo-panel] { visibility: hidden; }',
      });
      expect(errors).toEqual([]);
    });
  }
}

test('signature supports keyboard drawing, clearing and confirmation', async ({ page }) => {
  await page.goto('./contract?overlay=signature');
  const canvas = page.getByLabel('Area firma', { exact: true });
  await canvas.focus();
  await canvas.press('Enter');
  await canvas.press('ArrowRight');
  await canvas.press('ArrowDown');
  await canvas.press('Enter');
  await page.getByRole('button', { name: 'Cancella', exact: true }).click();
  await page.getByRole('button', { name: 'Conferma Firma', exact: true }).click();
  await expect(page.getByRole('alert')).toBeVisible();
  await expect(canvas).toBeFocused();
  await canvas.press('Enter');
  await canvas.press('ArrowRight');
  await canvas.press('ArrowDown');
  await canvas.press('Enter');
  await page.getByRole('button', { name: 'Conferma Firma', exact: true }).click();
  await expect(page.getByText('Contratto firmato con successo.')).toBeVisible();
});
