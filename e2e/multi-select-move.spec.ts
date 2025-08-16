import { test, expect } from '@playwright/test';
import { gotoApp, dragSidebarItemToCanvas, moveSelectedComponent } from './helpers';

function parseTranslate(transform: string | null) {
  if (!transform) return { x: NaN, y: NaN };
  const m = /translate\(([-0-9.]+),\s*([-0-9.]+)\)/.exec(transform);
  if (!m) return { x: NaN, y: NaN };
  return { x: Math.round(Number(m[1])), y: Math.round(Number(m[2])) };
}

test.describe('Multi-selection and group move', () => {
  test('select two components and move both together', async ({ page }) => {
    await gotoApp(page);

    // Place two different components on the canvas at distinct locations
    const { group: group1 } = await dragSidebarItemToCanvas(page, 'button', { x: 220, y: 160 });
    const { group: group2 } = await dragSidebarItemToCanvas(page, 'switch', { x: 420, y: 320 });

    const t1Before = await group1.getAttribute('transform');
    const t2Before = await group2.getAttribute('transform');
    const p1Before = parseTranslate(t1Before);
    const p2Before = parseTranslate(t2Before);

    // Select first component
    await group1.click();
    await expect(group1.locator('[data-testid="selection-border"]')).toBeVisible();

    // Ctrl-click second component to multi-select
    await group2.click({ modifiers: ['Control'] });

    // Both should now show selection borders
    await expect(group1.locator('[data-testid="selection-border"]')).toBeVisible();
    await expect(group2.locator('[data-testid="selection-border"]')).toBeVisible();

    // Move by a non-trivial delta; snapping is 20px, so expect snapped outcome
    const delta = { dx: 60, dy: 40 };
    await moveSelectedComponent(page, group1, delta);

    // Verify both moved and snapped to grid (multiples of 20)
    const t1After = await group1.getAttribute('transform');
    // Wait for second component to update via store re-render
    await expect.poll(async () => (await group2.getAttribute('transform')) || '').not.toBe(t2Before);
    const t2After = await group2.getAttribute('transform');
    expect(t1After).not.toEqual(t1Before);
    expect(t2After).not.toEqual(t2Before);

    const p1After = parseTranslate(t1After);
    const p2After = parseTranslate(t2After);

    // Grid snapping assertions
    expect(p1After.x % 20).toBe(0);
    expect(p1After.y % 20).toBe(0);
    expect(p2After.x % 20).toBe(0);
    expect(p2After.y % 20).toBe(0);

    // Sanity: both positions changed relative to before
    expect(p1After.x).not.toBe(p1Before.x);
    expect(p1After.y).not.toBe(p1Before.y);
    expect(p2After.x).not.toBe(p2Before.x);
    expect(p2After.y).not.toBe(p2Before.y);
  });
});
