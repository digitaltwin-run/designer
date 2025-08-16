import { test, expect } from '@playwright/test';
import { gotoApp, doubleClickSidebarItemToPlaceCentered, getCanvasViewBox, getComponentTransformAndSize, selectComponent } from './helpers';

// Verifies bottom-right resize uses SVG-coordinate deltas with zoom and continues
// when cursor leaves the handle area (window-level listeners).

function approx(a: number, b: number, tol = 2) {
  expect(Math.abs(a - b)).toBeLessThanOrEqual(tol);
}

test.describe('Resize bottom-right with zoom (SVG-coordinate deltas)', () => {
  test('resize scales by viewBox/rect ratio and persists outside handle', async ({ page }) => {
    await gotoApp(page);

    // Place a component by double-clicking from sidebar
    const { group, componentId } = await doubleClickSidebarItemToPlaceCentered(page, 'button');

    // Select it to show resize handles
    await selectComponent(group);

    // Capture initial size
    let { width: w0, height: h0 } = await getComponentTransformAndSize(page, componentId);
    expect(w0).toBeGreaterThan(0);
    expect(h0).toBeGreaterThan(0);

    const canvas = page.locator('[data-testid="canvas-svg"]');
    const beforeVB = await getCanvasViewBox(page);
    const beforeRect = await canvas.boundingBox();
    if (!beforeRect) throw new Error('Canvas bounding box not available');

    // Zoom in to change viewBox scale
    await page.evaluate(() => (window as any).zoomIn && (window as any).zoomIn());
    await page.evaluate(() => (window as any).zoomIn && (window as any).zoomIn());

    // Wait for viewBox to update
    await expect.poll(async () => (await canvas.getAttribute('viewBox')) || '').not.toBe(`${beforeVB.x} ${beforeVB.y} ${beforeVB.width} ${beforeVB.height}`);

    const afterVB = await getCanvasViewBox(page);
    const afterRect = await canvas.boundingBox();
    if (!afterRect) throw new Error('Canvas bounding box not available');

    const scaleX = afterVB.width / afterRect.width;
    const scaleY = afterVB.height / afterRect.height;

    // Perform resize by a pixel delta; expect SVG size delta ~ pixelDelta * scale
    const dx = 60;
    const dy = 40;

    // Manually resize using mouse to also test persistence when moving outside handle area
    const handle = page.locator(`[data-testid="resize-handle-se"][data-component-id="${componentId}"]`);
    await expect(handle).toBeVisible();
    const hbox = await handle.boundingBox();
    if (!hbox) throw new Error('Resize handle bounding box not available');

    await page.mouse.move(hbox.x + hbox.width / 2, hbox.y + hbox.height / 2);
    await page.mouse.down();

    // Move first within canvas
    await page.mouse.move(hbox.x + hbox.width / 2 + dx, hbox.y + hbox.height / 2 + dy, { steps: 10 });

    // Then move far outside canvas area to ensure window listeners keep resizing
    await page.mouse.move(hbox.x + hbox.width / 2 + dx + 3000, hbox.y + hbox.height / 2 + dy + 3000, { steps: 5 });

    // And back to near the original dx/dy before releasing, so final delta is predictable
    await page.mouse.move(hbox.x + hbox.width / 2 + dx + 2, hbox.y + hbox.height / 2 + dy + 2, { steps: 5 });

    await page.mouse.up();

    // Ensure DOM/store update has applied before measuring
    await expect.poll(async () => (await getComponentTransformAndSize(page, componentId)).width).toBeGreaterThan(w0);
    await expect.poll(async () => (await getComponentTransformAndSize(page, componentId)).height).toBeGreaterThan(h0);

    const { width: w1, height: h1 } = await getComponentTransformAndSize(page, componentId);

    // Expected deltas in SVG units
    const expDw = dx * scaleX;
    const expDh = dy * scaleY;

    // Allow small numerical tolerances
    approx(w1 - w0, expDw, 3);
    approx(h1 - h0, expDh, 3);
  });
});
