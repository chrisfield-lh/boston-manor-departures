// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');

const FILE_URL = `file://${path.resolve(__dirname, '../index.html')}`;

// Give the page time to load API data
const API_TIMEOUT = 15_000;

test.describe('Map section', () => {
  test('map section is visible on load', async ({ page }) => {
    await page.goto(FILE_URL);
    await expect(page.locator('#stop-map')).toBeVisible();
  });

  test('map canvas is rendered by Leaflet', async ({ page }) => {
    await page.goto(FILE_URL);
    // Leaflet injects a pane structure once initialised
    await expect(page.locator('#stop-map .leaflet-map-pane')).toBeAttached({ timeout: 5_000 });
  });

  test('tube marker is on the map', async ({ page }) => {
    await page.goto(FILE_URL);
    // The tube marker SVG circle uses fill #7aabff
    await expect(page.locator('#stop-map svg circle[fill="#7aabff"]').first()).toBeVisible({ timeout: 5_000 });
  });

  test('bus markers are on the map', async ({ page }) => {
    await page.goto(FILE_URL);
    // Bus markers use fill #ff8a80; expect at least 2 (Stop U + Stop N)
    const busMarkers = page.locator('#stop-map svg circle[fill="#ff8a80"]');
    await expect(busMarkers).toHaveCount(2, { timeout: 10_000 });
  });
});

test.describe('Tube departure board', () => {
  test('tube section heading is visible', async ({ page }) => {
    await page.goto(FILE_URL);
    await expect(page.locator('.mode-pill.tube').first()).toBeVisible();
  });

  test('tube board loads at least one departure row', async ({ page }) => {
    await page.goto(FILE_URL);
    await expect(
      page.locator('#tube-grid .tube-row').first()
    ).toBeVisible({ timeout: API_TIMEOUT });
  });
});

test.describe('Bus departure boards', () => {
  test('Stop U section heading is visible', async ({ page }) => {
    await page.goto(FILE_URL);
    await expect(page.getByText('Stop U', { exact: false })).toBeVisible();
  });

  test('Stop N section heading is visible', async ({ page }) => {
    await page.goto(FILE_URL);
    await expect(page.getByText('Stop N', { exact: false })).toBeVisible();
  });

  test('Stop U board loads at least one departure row', async ({ page }) => {
    await page.goto(FILE_URL);
    // Find the board whose header contains the 'U' indicator badge
    const stopUBoard = page.locator('#bus-grid .board').filter({ hasText: /\bU\b/ }).first();
    await expect(stopUBoard.locator('.bus-row').first()).toBeVisible({ timeout: API_TIMEOUT });
  });

  test('Stop N board loads at least one departure row', async ({ page }) => {
    await page.goto(FILE_URL);
    // Find the board whose header contains the 'N' indicator badge
    const stopNBoard = page.locator('#bus-grid .board').filter({ hasText: /\bN\b/ }).first();
    await expect(stopNBoard.locator('.bus-row').first()).toBeVisible({ timeout: API_TIMEOUT });
  });
});

test.describe('Auto-refresh', () => {
  test('last-updated timestamp is shown', async ({ page }) => {
    await page.goto(FILE_URL);
    await expect(page.locator('#last-updated')).toBeVisible({ timeout: API_TIMEOUT });
  });

  test('last-updated timestamp changes after refresh interval', async ({ page }) => {
    await page.goto(FILE_URL);
    const firstTimestamp = await page.locator('#last-updated').textContent({ timeout: API_TIMEOUT });
    // Wait for next auto-refresh (30s in app) — we trigger it manually via JS
    await page.evaluate(() => window.refresh && window.refresh());
    await page.waitForTimeout(2_000);
    const secondTimestamp = await page.locator('#last-updated').textContent();
    expect(secondTimestamp).not.toBe(firstTimestamp);
  });
});
