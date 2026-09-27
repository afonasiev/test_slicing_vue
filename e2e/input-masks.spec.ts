import { test, expect } from '@playwright/test';

test('amount rejects letters and IBAN formats typing and pasted content', async ({ page }) => {
  await page.goto('./application/amount');
  const amount = page.getByLabel('Importo del credito', { exact: true });
  await amount.fill('абв1a5!000');
  await expect(amount).toHaveValue('15000');
  await amount.fill('текст');
  await expect(amount).toHaveValue('');
  await page.goto('./withdrawal');
  const iban = page.getByLabel('IBAN', { exact: true });
  await iban.fill('it60хПриветx0542811101000000123456');
  await expect(iban).toHaveValue('IT60 X054 2811 1010 0000 0123 456');
  await iban.press('End');
  await iban.pressSequentially('abc999');
  await expect(iban).toHaveValue('IT60 X054 2811 1010 0000 0123 456');
  await iban.fill('русский');
  await expect(iban).toHaveValue('');
  await iban.fill('de89370400440532013000');
  await expect(iban).toHaveValue('DE89 3704 0044 0532 0130 00');
  await page.getByRole('button', { name: 'Vai alla commissione' }).click();
  await expect(page.getByRole('dialog')).toHaveAccessibleName('Commissione da versare');
});

test('passport preset exposes a masked document number and document menu can select it', async ({
  page,
}) => {
  await page.goto('./application/personal-data?state=document-menu');
  await page.getByRole('button', { name: 'Passaporto', exact: true }).click();
  const number = page.getByLabel('NUMERO DEL DOCUMENTO');
  await number.fill('абвab123!2232');
  await expect(number).toHaveValue('AB1232232');
  await page.goto('./application/personal-data?state=passport');
  await expect(page.getByLabel('Tipo di documento')).toHaveValue('passport');
  await expect(page.getByLabel('NUMERO DEL DOCUMENTO')).toBeVisible();
});
