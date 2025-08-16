import { test, expect } from '@playwright/test';
import { gotoApp, dragSidebarItemToCanvas } from './helpers';

// Verifies drag-and-drop from sidebar to canvas using data-testid selectors
// Relies on: src/components/sidebar/ComponentItem.tsx and src/components/canvas/SVGCanvas.tsx test IDs

test.describe('Drag and Drop', () => {
  test('can drag a component from sidebar to canvas', async ({ page }) => {
    await gotoApp(page);

    // Prefer a simple component id that exists in src/data/components.ts
    const id = 'button';
    const { group, componentId } = await dragSidebarItemToCanvas(page, id, { x: 300, y: 220 });

    await expect(group).toBeVisible();
    await expect(group).toHaveAttribute('data-component-type', id);
    await expect(group).toHaveAttribute('data-component-id', componentId);

    // Ensure the canvas-components group is present
    await expect(page.locator('[data-testid="canvas-components"]')).toBeVisible();
  });
});
