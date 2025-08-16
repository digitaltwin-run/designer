import { test, expect } from '@playwright/test';
import { gotoApp, getCanvasViewBox, doubleClickSidebarItemToPlaceCentered, getComponentTransformAndSize } from './helpers';

// Verifies that double-clicking a sidebar item places the component centered in the
// currently visible SVG canvas area, using the viewBox and grid snapping logic.
// Relevant code: `placeComponentAtCanvasCenter()` in `src/components/canvas/SVGCanvas.tsx`

const GRID = 20; // per initial canvas settings
const DEFAULT_SIZE = 80; // gridSize * 4

function snapToGrid(v: number) {
  return Math.round(v / GRID) * GRID;
}

function expectedCenteredTopLeft(vb: { x: number; y: number; width: number; height: number }) {
  const centerX = vb.x + vb.width / 2;
  const centerY = vb.y + vb.height / 2;
  return {
    x: snapToGrid(centerX - DEFAULT_SIZE / 2),
    y: snapToGrid(centerY - DEFAULT_SIZE / 2)
  };
}

test.describe('Double-click Placement', () => {
  test('places centered at visible area (default view)', async ({ page }) => {
    await gotoApp(page);

    const id = 'button';
    const { componentId } = await doubleClickSidebarItemToPlaceCentered(page, id);

    const vb = await getCanvasViewBox(page);
    const expected = expectedCenteredTopLeft(vb);

    const { x, y, width, height } = await getComponentTransformAndSize(page, componentId);
    expect(width).toBeGreaterThan(0);
    expect(height).toBeGreaterThan(0);
    expect(Math.round(x)).toBe(expected.x);
    expect(Math.round(y)).toBe(expected.y);
  });

  test('places centered at visible area after panning', async ({ page }) => {
    await gotoApp(page);

    // Pan the canvas using right mouse button drag
    const canvas = page.locator('[data-testid="canvas-svg"]');
    const box = await canvas.boundingBox();
    if (!box) throw new Error('Canvas bounding box not available');

    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down({ button: 'right' });
    await page.mouse.move(box.x + box.width / 2 + 120, box.y + box.height / 2 + 80, { steps: 10 });
    await page.mouse.up({ button: 'right' });

    // Ensure viewBox changed
    await expect.poll(async () => (await canvas.getAttribute('viewBox')) || '').not.toBe('0 0 1200 800');

    const id = 'button';
    const { componentId } = await doubleClickSidebarItemToPlaceCentered(page, id);

    const vb = await getCanvasViewBox(page);
    const expected = expectedCenteredTopLeft(vb);

    const { x, y } = await getComponentTransformAndSize(page, componentId);
    expect(Math.round(x)).toBe(expected.x);
    expect(Math.round(y)).toBe(expected.y);
  });
});
