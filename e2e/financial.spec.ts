import { test, expect } from '@playwright/test';

test('withdrawal validates IBAN and opens commission coordinates with history', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.goto('./withdrawal');
  await page.getByRole('button', { name: 'Vai alla commissione' }).click();
  await expect(page.getByRole('alert')).toContainText('IBAN valido');
  await expect(page.getByLabel('IBAN', { exact: true })).toBeFocused();
  await page.getByRole('button', { name: 'Carta Trasferimento su carta' }).click();
  await expect(page.getByRole('status')).toContainText('non è disponibile');
  await page.getByRole('button', { name: 'IBAN Bonifico bancario' }).click();
  await page.getByLabel('IBAN', { exact: true }).fill('IT60X0542811101000000123456');
  await page.getByRole('button', { name: 'Vai alla commissione' }).click();
  await expect(page.getByRole('dialog')).toHaveAccessibleName('Commissione da versare');
  await expect(
    page.getByRole('button', { name: 'Indietro', exact: true }).locator('svg path'),
  ).toHaveCount(1);
  await page.getByRole('button', { name: 'Vai alle coordinate' }).click();
  await expect(page).toHaveURL(/overlay=coordinates/);
  await expect(page.getByRole('dialog')).toHaveAccessibleName('Coordinate di pagamento');
  await page.getByRole('button', { name: 'Conferma pagamento' }).click();
  await expect(page.getByRole('status')).toContainText('Nessun pagamento');
  await page.reload();
  await expect(page.getByRole('dialog')).toHaveAccessibleName('Coordinate di pagamento');
  await page.goBack();
  await expect(page.getByRole('dialog')).toHaveAccessibleName('Commissione da versare');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  expect(errors).toEqual([]);
});

for (const width of [320, 390, 768, 1440, 1920]) {
  for (const path of ['withdrawal', 'commission', 'commission?overlay=coordinates']) {
    test(`${path} financial layout ${width}`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: width === 390 ? 1620 : 1204 });
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
      await page.addStyleTag({ content: '[data-demo-panel] { visibility: hidden; }' });
      await page.screenshot({
        path: `output/playwright/financial/${testInfo.project.name}/${path.replace(/[?=]/g, '-')}-${width}.png`,
        fullPage: true,
      });
    });
  }
}

for (const width of [390, 1440]) {
  test(`withdrawal matches Figma card dimensions ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1620 });
    await page.goto('./withdrawal');
    await page.evaluate(() => document.fonts.ready);
    const card = await page
      .getByRole('heading', { name: 'Importo da ricevere' })
      .locator('..')
      .boundingBox();
    expect(card).not.toBeNull();
    expect(card!.width).toBe(width === 390 ? 358 : 792);
    expect(Math.abs(card!.height - (width === 390 ? 745 : 811))).toBeLessThanOrEqual(2);
    expect(Math.abs(card!.y - (width === 390 ? 256 : 353))).toBeLessThanOrEqual(2);
  });
}
