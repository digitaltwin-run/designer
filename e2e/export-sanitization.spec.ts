import { test, expect } from '@playwright/test';
import { gotoApp, doubleClickSidebarItemToPlaceCentered } from './helpers';
import fs from 'fs/promises';

// Ensures exported SVG has no <script> tags (sanitization in SVGCanvas.exportToSVG)

test.describe('Export sanitization', () => {
  test('exported SVG contains no <script> tags', async ({ page }) => {
    await gotoApp(page);

    // Ensure at least one component exists to be embedded
    await doubleClickSidebarItemToPlaceCentered(page, 'button');

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.evaluate(() => (window as any).exportCanvasToSVG && (window as any).exportCanvasToSVG())
    ]);

    const path = await download.path();
    // Some browsers may stream only; fall back to saving to a test output path
    let content: string | null = null;
    if (path) {
      content = await fs.readFile(path, 'utf-8');
    } else {
      const saveTo = test.info().outputPath(`exported-${Date.now()}.svg`);
      await download.saveAs(saveTo);
      content = await fs.readFile(saveTo, 'utf-8');
    }

    expect(content).toBeTruthy();
    const lower = (content || '').toLowerCase();
    expect(lower.includes('<script')).toBeFalsy();
  });
});
