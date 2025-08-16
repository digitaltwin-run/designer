import { expect, Page, Locator } from '@playwright/test';

export async function gotoApp(page: Page) {
  await page.goto('/');
  await expect(page.locator('[data-testid="canvas-svg"]')).toBeVisible();
}

export async function dragSidebarItemToCanvas(
  page: Page,
  id: string = 'button',
  targetPosition: { x: number; y: number } = { x: 300, y: 200 }
): Promise<{ group: Locator; componentId: string }> {
  const source = page.locator(`[data-testid-item="sidebar-item-${id}"]`).first();
  const fallback = page.locator('[data-testid="sidebar-item"]').first();

  const sourceLocator = (await source.count()) > 0 ? source : fallback;
  await expect(sourceLocator).toBeVisible();

  const canvas = page.locator('[data-testid="canvas-svg"]');
  await expect(canvas).toBeVisible();

  await sourceLocator.dragTo(canvas, { targetPosition });

  const compGroup = page.locator(`[data-testid="canvas-component"][data-component-type="${id}"]`).first();
  await expect(compGroup).toBeVisible();

  const componentId = (await compGroup.getAttribute('data-component-id')) || '';
  expect(componentId).not.toEqual('');

  return { group: compGroup, componentId };
}

export async function selectComponent(group: Locator) {
  await group.click();
  await expect(group.locator('[data-testid="selection-border"]')).toBeVisible();
}

export async function moveSelectedComponent(page: Page, group: Locator, delta: { dx: number; dy: number }) {
  const box = await group.boundingBox();
  if (!box) throw new Error('Bounding box not available for component group');

  const initialTransform = (await group.getAttribute('transform')) || '';

  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + delta.dx, box.y + box.height / 2 + delta.dy, { steps: 10 });
  await page.mouse.up();

  await expect.poll(async () => (await group.getAttribute('transform')) || '').not.toBe(initialTransform);

  const newTransform = (await group.getAttribute('transform')) || '';
  const m = /translate\(([-0-9.]+),\s*([-0-9.]+)\)/.exec(newTransform);
  if (m) {
    const x = Math.round(Number(m[1]));
    const y = Math.round(Number(m[2]));
    // snapToGrid is 20 by default per useAppStore.initialCanvasSettings.gridSize
    expect(x % 20).toBe(0);
    expect(y % 20).toBe(0);
  }
}

export async function resizeSelectedComponent(page: Page, componentId: string, delta: { dx: number; dy: number }) {
  const handle = page.locator(`[data-testid="resize-handle-se"][data-component-id="${componentId}"]`);
  await expect(handle).toBeVisible();

  const group = page.locator(`[data-testid="canvas-component"][data-component-id="${componentId}"]`);
  const initialW = Number((await group.getAttribute('data-component-width')) || '0');
  const initialH = Number((await group.getAttribute('data-component-height')) || '0');
  expect(initialW).toBeGreaterThan(0);
  expect(initialH).toBeGreaterThan(0);

  const box = await handle.boundingBox();
  if (!box) throw new Error('Bounding box not available for resize handle');

  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + delta.dx, box.y + box.height / 2 + delta.dy, { steps: 10 });
  await page.mouse.up();

  await expect.poll(async () => Number((await group.getAttribute('data-component-width')) || '0')).toBeGreaterThan(initialW);
  await expect.poll(async () => Number((await group.getAttribute('data-component-height')) || '0')).toBeGreaterThan(initialH);
}

// --- New helpers for double-click placement and geometry parsing ---

export async function getCanvasViewBox(page: Page): Promise<{ x: number; y: number; width: number; height: number }> {
  const vb = await page.locator('[data-testid="canvas-svg"]').getAttribute('viewBox');
  if (!vb) throw new Error('Canvas viewBox not found');
  const [x, y, width, height] = vb.split(/\s+/).map(Number);
  return { x, y, width, height };
}

export function parseTranslate(transform: string | null): { x: number; y: number } {
  if (!transform) return { x: NaN, y: NaN };
  const m = /translate\(([-0-9.]+),\s*([-0-9.]+)\)/.exec(transform);
  if (!m) return { x: NaN, y: NaN };
  return { x: Number(m[1]), y: Number(m[2]) };
}

export async function getComponentTransformAndSize(page: Page, componentId: string): Promise<{ x: number; y: number; width: number; height: number }>{
  const group = page.locator(`[data-testid="canvas-component"][data-component-id="${componentId}"]`);
  await expect(group).toBeVisible();
  const transform = await group.getAttribute('transform');
  const { x, y } = parseTranslate(transform);
  const width = Number((await group.getAttribute('data-component-width')) || '0');
  const height = Number((await group.getAttribute('data-component-height')) || '0');
  return { x, y, width, height };
}

export async function doubleClickSidebarItemToPlaceCentered(page: Page, id: string): Promise<{ group: Locator; componentId: string }>{
  // Snapshot IDs before
  const beforeIds = new Set<string>(
    await page.locator('[data-testid="canvas-component"]').evaluateAll((nodes) => nodes.map(n => (n as HTMLElement).getAttribute('data-component-id') || '').filter(Boolean))
  );

  const item = page.locator(`[data-testid-item="sidebar-item-${id}"]`).first();
  const fallback = page.locator('[data-testid="sidebar-item"]').first();
  const itemLocator = (await item.count()) > 0 ? item : fallback;
  await expect(itemLocator).toBeVisible();
  await itemLocator.dblclick();

  // Wait for a new component to appear
  const newGroup = page.locator('[data-testid="canvas-component"]').filter({ has: page.locator(':scope') });
  await expect.poll(async () => {
    const ids = await page.locator('[data-testid="canvas-component"]').evaluateAll((nodes) => nodes.map(n => (n as HTMLElement).getAttribute('data-component-id') || '').filter(Boolean));
    const newlyAdded = ids.find(id => !beforeIds.has(id));
    return newlyAdded || '';
  }).not.toBe('');

  const ids = await page.locator('[data-testid="canvas-component"]').evaluateAll((nodes) => nodes.map(n => (n as HTMLElement).getAttribute('data-component-id') || '').filter(Boolean));
  const newId = ids.find(id => !beforeIds.has(id));
  if (!newId) throw new Error('Newly placed component not found');

  const group = page.locator(`[data-testid="canvas-component"][data-component-id="${newId}"]`);
  await expect(group).toBeVisible();
  return { group, componentId: newId };
}
