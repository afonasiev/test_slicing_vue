import { test, expect } from '@playwright/test';

test('application routes preserve draft and browser history', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('./application/amount');
  await page.getByLabel('Importo del credito', { exact: true }).fill('15000');
  await page.getByRole('button', { name: 'Continua' }).click();
  await expect(page).toHaveURL(/\/application\/personal-data$/);
  await page.getByLabel('Cognome', { exact: true }).fill('Rossi');
  await page.getByLabel('Nome', { exact: true }).fill('Marco');
  await page.getByLabel('Tipo di documento').selectOption('passport');
  await page.getByRole('button', { name: 'Donna', exact: true }).click();
  await page.getByRole('button', { name: 'Continua' }).click();
  await expect(page).toHaveURL(/\/application\/check$/);
  await page.goBack();
  await page.goBack();
  await expect(page.getByLabel('Importo del credito', { exact: true })).toHaveValue('15.000');
  await page.goForward();
  await expect(page.getByLabel('Nome', { exact: true })).toHaveValue('Marco');
  await expect(page.getByRole('button', { name: 'Donna', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  expect(errors).toEqual([]);
});

test('direct history URL, refresh and query normalization', async ({ page }) => {
  await page.goto('./application/personal-data/?state=invalid&overlay=invalid&unknown=1');
  await expect(page).toHaveURL(/\/application\/personal-data\/$/);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Dicci chi sei' })).toBeVisible();
  await page.goto('./unrecognized');
  await expect(page.getByRole('main', { name: 'Home Avanti' })).toBeVisible();
});

test('service panel remains usable inside a product dialog', async ({ page }) => {
  await page.goto('./profile');
  await page.getByRole('button', { name: 'Modifica nome' }).click();
  await page.getByRole('button', { name: '◈ Меню', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('searchbox').focus();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('searchbox')).toHaveCount(0);
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

for (const route of ['amount', 'personal-data', 'check', 'approved']) {
  for (const width of [320, 375, 390, 768, 1024, 1440, 1920]) {
    const height =
      route === 'approved'
        ? width < 768
          ? 653
          : 1001
        : route === 'check'
          ? width < 768
            ? 1136
            : 920
          : route === 'amount'
            ? 920
            : 1116;

    test(`${route} layout ${width}`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height });
      await page.goto(`./application/${route}`);
      await page.evaluate(() => document.fonts.ready);
      await expect
        .poll(async () =>
          page
            .locator('[data-profile-icon]')
            .evaluateAll((nodes) => nodes.every((node) => node.querySelector('svg'))),
        )
        .toBe(true);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
      await page.screenshot({
        path: `output/playwright/${testInfo.project.name}/${route}-${width}.png`,
        fullPage: true,
        style: '[data-demo-panel] { visibility: hidden; }',
      });
    });
  }
}

test('demo reset clears saved application data', async ({ page }) => {
  await page.goto('./application/amount');
  await page.getByLabel('Importo del credito', { exact: true }).fill('15000');
  await page.getByRole('button', { name: 'Continua' }).click();
  await page.getByRole('button', { name: 'Indietro' }).click();
  await expect(page.getByLabel('Importo del credito', { exact: true })).toHaveValue('15.000');
  await page.getByRole('button', { name: '◈ Меню', exact: true }).click();
  await page.getByRole('button', { name: 'Сбросить', exact: true }).click();
  await expect(page.getByLabel('Importo del credito', { exact: true })).toHaveValue('12.000');
});

for (const width of [320, 390, 768, 1440]) {
  test(`home shell ${width}`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 1212 });
    await page.goto('./');
    await page.evaluate(() => document.fonts.ready);
    await expect
      .poll(async () =>
        page
          .locator('[data-profile-icon]')
          .evaluateAll((nodes) => nodes.every((node) => node.querySelector('svg'))),
      )
      .toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    await page.screenshot({
      path: `output/playwright/${testInfo.project.name}/home-${width}.png`,
      fullPage: true,
      style: '[data-demo-panel] { visibility: hidden; }',
    });
  });
}
