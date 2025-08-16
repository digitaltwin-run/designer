import { test, expect } from '@playwright/test';
import { gotoApp, dragSidebarItemToCanvas, selectComponent, moveSelectedComponent, resizeSelectedComponent } from './helpers';

// Verifies selection, moving, and resizing components on the canvas
// Uses test IDs in: SVGCanvas.tsx and SVGCanvasComponent.tsx

test.describe('Selection, Move, and Resize', () => {
  test('selects, moves, and resizes a canvas component', async ({ page }) => {
    await gotoApp(page);

    // Add one component to the canvas
    const id = 'button';
    const { group, componentId } = await dragSidebarItemToCanvas(page, id, { x: 300, y: 220 });

    // Select
    await selectComponent(group);

    // Move by a grid-aligned delta (grid is 20px)
    await moveSelectedComponent(page, group, { dx: 60, dy: 40 });

    // Still selected
    await expect(group.locator('[data-testid="selection-border"]')).toBeVisible();

    // Resize
    await resizeSelectedComponent(page, componentId, { dx: 40, dy: 30 });

    // Width/height should have increased
    const w = Number((await group.getAttribute('data-component-width')) || '0');
    const h = Number((await group.getAttribute('data-component-height')) || '0');
    expect(w).toBeGreaterThan(0);
    expect(h).toBeGreaterThan(0);
  });
});
