// Rebuild the local demo PDF from the same Vue document used on the page.
// Start Vite on 127.0.0.1:5190 before running this script.
import { chromium } from '@playwright/test';
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto('http://127.0.0.1:5190/contract');
  await page.evaluate(() => document.fonts.ready);
  await page.locator('article[aria-label="Contratto di credito al consumo"] svg').first().waitFor();
  await page.addStyleTag({ content: `
    @media print {
      body > * { display: none; }
      body > #contract-print { display: block; }
      #contract-print article { width: 900px; border: 0; }
      #contract-print tr, #contract-print section { break-inside: avoid; }
    }
  ` });
  await page.evaluate(() => {
    const container = document.createElement('div');
    container.id = 'contract-print';
    container.append(document.querySelector('article[aria-label="Contratto di credito al consumo"]').cloneNode(true));
    document.body.append(container);
  });
  await page.pdf({ path: 'src/shared/assets/contract-demo.pdf', format: 'A4', printBackground: true, scale: 0.78, margin: { top: '12mm', bottom: '12mm', left: '10mm', right: '10mm' } });
} finally { await browser.close(); }
