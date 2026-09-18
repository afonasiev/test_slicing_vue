import { test, expect } from '@playwright/test';

test('profile interactions, OTP and keyboard-accessible dialogs', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  const edit = page.getByRole('button', { name: 'Modifica nome' });
  await edit.click();
  await page.getByLabel('Nome', { exact: true }).fill('');
  await page.getByRole('button', { name: 'Salva', exact: true }).click();
  await expect(page.getByRole('alert')).toHaveText('Inserisci il nome.');
  await page.getByLabel('Nome', { exact: true }).fill('Giulia Bianchi');
  await page.getByRole('button', { name: 'Salva', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(edit).toBeFocused();
  await expect(page.getByText('Giulia Bianchi', { exact: true })).toHaveCount(3);

  await page.getByRole('button', { name: 'Cambia password' }).click();
  await page.getByLabel('Nuova password', { exact: true }).fill('short');
  await page.getByLabel('Conferma password', { exact: true }).fill('short');
  await page.getByRole('button', { name: 'Salva', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('8 caratteri');
  await page.getByLabel('Nuova password', { exact: true }).fill('password123');
  await page.getByRole('button', { name: 'Salva', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('non coincidono');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);

  await page.getByRole('button', { name: 'CONFERMA', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('6 cifre');
  await expect(page.getByLabel('Cifra 1', { exact: true })).toBeFocused();
  await page.getByLabel('Cifra 1', { exact: true }).fill('111111');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('alert')).toContainText('Codice non valido');
  await expect(page.getByLabel('Cifra 1', { exact: true })).toBeFocused();
  await page.getByRole('button', { name: 'CONFERMA', exact: true }).click();
  await expect(page.getByLabel('Cifra 1', { exact: true })).toBeFocused();
  await page.getByLabel('Cifra 1', { exact: true }).evaluate((input) => {
    const event = new Event('paste', { bubbles: true, cancelable: true });
    Object.defineProperty(event, 'clipboardData', { value: { getData: () => '123456' } });
    input.dispatchEvent(event);
  });
  await page.keyboard.press('Enter');
  await expect(page.getByText('Email verificata con successo.')).toBeVisible();
  await expect(page.getByText('3 / 5 completati')).toHaveCount(2);

  await page.getByRole('button', { name: 'Cambia email' }).click();
  await page.getByLabel('Email', { exact: true }).fill('invalid');
  await page.getByRole('button', { name: 'Salva', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('email valido');
  await page.getByLabel('Email', { exact: true }).fill('giulia@example.com');
  await page.getByRole('button', { name: 'Salva', exact: true }).click();
  await expect(page.getByText('giulia@example.com', { exact: true })).toHaveCount(2);
  await expect(page.getByText('Non verificata', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Copia IBAN' }).click();
  await expect(page.getByText('IBAN non disponibile.')).toBeVisible();
  const toggle = page.getByRole('button', { name: 'Mostra o nascondi gli step' });
  await toggle.click();
  await expect(page.getByText('Simulazione completata')).toBeHidden();
  await toggle.click();
  await expect(page.getByText('Simulazione completata')).toBeVisible();
  expect(errors).toEqual([]);
});

test('resend cooldown and OTP editing', async ({ page }) => {
  await page.clock.install();
  await page.goto('/');
  await page.getByRole('button', { name: 'Invia di nuovo', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Invia di nuovo (30s)' })).toBeDisabled();
  await page.clock.runFor(30_000);
  await expect(page.getByRole('button', { name: 'Invia di nuovo', exact: true })).toBeEnabled();
  await page.getByLabel('Cifra 1', { exact: true }).fill('1');
  await expect(page.getByLabel('Cifra 2', { exact: true })).toBeFocused();
  await page.keyboard.press('Backspace');
  await expect(page.getByLabel('Cifra 1', { exact: true })).toBeFocused();
  await expect(page.getByLabel('Cifra 1', { exact: true })).toHaveValue('');
});

for (const width of [320, 375, 390, 768, 1024, 1440, 1920]) {
  test(`responsive layout ${width}`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: width === 390 ? 1687 : 1212 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole('main')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    const imagesLoaded = await page
      .locator('img')
      .evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 0));
    expect(imagesLoaded).toBe(true);
    await page.screenshot({
      path: `output/playwright/${testInfo.project.name}/profile-${width}.png`,
      fullPage: true,
      scale: 'css',
    });
  });
}

test('links, SVG accessibility and backdrop dismissal', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Avanti — Home' })).toHaveAttribute('href', '/');
  await expect(
    page.getByRole('navigation', { name: 'Percorso di navigazione' }).getByRole('link'),
  ).toHaveCount(2);
  await expect(
    page.getByRole('navigation', { name: 'Navigazione principale' }).first().getByRole('link'),
  ).toHaveCount(3);
  await page.getByRole('link', { name: 'Documenti', exact: true }).click();
  await expect(page).not.toHaveURL(/#$/);
  await expect(page.getByRole('img', { name: 'Marco Rossi' })).toHaveAttribute('width', '40');
  await expect
    .poll(async () =>
      page
        .locator('[data-profile-icon]')
        .evaluateAll((nodes) => nodes.every((node) => node.querySelector('svg'))),
    )
    .toBe(true);
  const edit = page.getByRole('button', { name: 'Modifica nome' });
  await edit.click();
  await page.getByRole('dialog').getByRole('heading').click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.mouse.click(5, 5);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(edit).toBeFocused();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const toggle = page.getByRole('button', { name: 'Mostra o nascondi gli step' });
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByRole('button', { name: 'Vai ai documenti' })).toBeHidden();
});

test('production assets, throttled cooldown and scroll locking', async ({ page, request }) => {
  await page.clock.install();
  await page.goto('/');
  const faviconHref = await page.locator('link[rel="icon"]').getAttribute('href');
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', /favicon\.svg$/);
  const favicon = await request.get(faviconHref!);
  expect(favicon.ok()).toBe(true);
  const svg = await favicon.text();
  expect(svg).toContain('<svg');
  expect(svg).not.toContain('<text');
  await page.getByRole('button', { name: 'Invia di nuovo', exact: true }).click();
  await page.clock.fastForward(60_000);
  await expect(page.getByRole('button', { name: 'Invia di nuovo', exact: true })).toBeEnabled();
  await page.getByRole('button', { name: 'Modifica nome' }).click();
  await expect(page.locator('html')).toHaveClass(/profile-dialog-open/);
  await page.keyboard.press('Escape');
  await expect(page.locator('html')).not.toHaveClass(/profile-dialog-open/);
});
