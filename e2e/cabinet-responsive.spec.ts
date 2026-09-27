import { test, expect } from '@playwright/test';

for (const width of [375, 768, 1024, 1920]) {
  test(`completed financial pages fit ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1212 });
    for (const route of [
      '?state=completed',
      '?state=certificate-ready',
      '?state=restricted',
      'withdrawal?state=certificate',
      'transfer?state=restricted',
      'transfer?state=certificate',
      'verification',
      'verification?state=checking',
      'commission?state=insurance&overlay=coordinates',
      'assistance',
    ]) {
      await page.goto(`./${route}`);
      await page.evaluate(() => document.fonts.ready);
      await expect
        .poll(() =>
          page
            .locator('[data-profile-icon]')
            .evaluateAll((nodes) => nodes.every((node) => node.querySelector('svg'))),
        )
        .toBe(true);
      expect(await page.evaluate(() => document.documentElement.scrollWidth), route).toBe(width);
      expect(
        await page
          .locator('dialog[open]')
          .evaluateAll((nodes) => nodes.every((node) => node.scrollWidth <= node.clientWidth + 1)),
        route,
      ).toBe(true);
    }
  });
}
