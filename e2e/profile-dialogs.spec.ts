import { test, expect } from '@playwright/test';
for (const width of [390, 1440]) {
  for (const [kind, desktopHeight, mobileHeight] of [
    ['name', 515, 386],
    ['email', 451, 378],
    ['password', 655, 530],
  ] as const) {
    test(`profile ${kind} Figma geometry ${width}`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(`./profile?overlay=${kind}`);
      await page.evaluate(() => document.fonts.ready);
      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();
      const bounds = await dialog.boundingBox();
      expect(bounds?.width).toBe(width === 390 ? 350 : 524);
      expect(
        Math.abs(bounds!.height - (width === 390 ? mobileHeight : desktopHeight)),
      ).toBeLessThanOrEqual(2);
      await expect
        .poll(() =>
          page
            .locator('[data-profile-icon]')
            .evaluateAll((nodes) => nodes.every((node) => node.querySelector('svg'))),
        )
        .toBe(true);
      await dialog.screenshot({
        style: '[data-demo-panel] { visibility: hidden; }',
        path: `output/playwright/${testInfo.project.name}/dialog-${kind}-${width}.png`,
      });
    });
  }
}
