import { test, expect } from '@playwright/test';
import scenarios from '../src/app/demo/scenarios.json' with { type: 'json' };
import routes from '../src/shared/config/routes.json' with { type: 'json' };

for (const width of [320, 390, 1440]) {
  for (const route of routes) {
    test(`${route.id} demo states navigate without errors or overflow at ${width}px`, async ({
      page,
    }, testInfo) => {
      test.setTimeout(180_000);
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('console', (message) => {
        if (message.type() === 'error' || message.text().includes('[Vue warn]')) {
          errors.push(message.text());
        }
      });
      await page.setViewportSize({ width, height: width < 768 ? 1687 : 1212 });
      await page.goto('./assistance');
      await page.getByRole('button', { name: '◈ Меню', exact: true }).click();

      const states = scenarios.filter((scenario) => scenario.page === route.id);
      for (const scenario of states) {
        const link = page.locator(`[data-scenario="${scenario.id}"]`);
        await expect(link, scenario.id).toHaveCount(1);
        await link.click();
        await page.evaluate(() => document.fonts.ready);
        await expect
          .poll(() =>
            page
              .locator('[data-profile-icon]')
              .evaluateAll((nodes) => nodes.every((node) => node.querySelector('svg'))),
          )
          .toBe(true);
        expect(await page.evaluate(() => document.documentElement.scrollWidth), scenario.id).toBe(
          width,
        );
        expect(
          await page
            .locator('dialog[open]')
            .evaluateAll((nodes) =>
              nodes.every((node) => node.scrollWidth <= node.clientWidth + 1),
            ),
          scenario.id,
        ).toBe(true);
        expect(
          await page.locator('input, select, textarea').evaluateAll((fields) =>
            fields.filter((field) => !field.id.trim() && !field.getAttribute('name')?.trim())
              .map((field) => field.outerHTML),
          ),
          scenario.id,
        ).toEqual([]);
        expect(
          await page.locator('[id]').evaluateAll((nodes) => {
            const ids = nodes.map((node) => node.id);
            return ids.filter((id, index) => !id.trim() || ids.indexOf(id) !== index);
          }),
          scenario.id,
        ).toEqual([]);
        expect(errors, scenario.id).toEqual([]);
        // eslint-disable-next-line playwright/no-conditional-in-test -- Capture one reference browser only.
        if (testInfo.project.name === 'chromium' && width !== 320) {
          const hiddenPanel = await page.addStyleTag({
            content: '[data-demo-panel] { visibility: hidden; }',
          });
          await page.screenshot({
            path: `output/playwright/scenarios/${scenario.id}-${width}.png`,
            fullPage: true,
          });
          await hiddenPanel.evaluate((element) => element.parentNode?.removeChild(element));
        }
      }
    });
  }
}
