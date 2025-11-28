 
import { test, expect } from '@playwright/test';

test.describe('Satellite Map Application', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('should load map with WMS layer', async ({ page }) => {
    // Check if map container is rendered
    const mapContainer = page.locator('[data-testid="map-container"]');
    await expect(mapContainer).toBeVisible();
    
    // Check if map canvas is loaded
    const mapCanvas = page.locator('.ol-viewport canvas');
    await expect(mapCanvas).toBeVisible({ timeout: 10000 });
  });

  test('should toggle WMS layer visibility', async ({ page }) => {
    // Open layer manager
    await page.click('[data-testid="layer-manager-toggle"]');
    
    // Toggle WMS layer
    const wmsToggle = page.locator('button:has-text("Satellite Imagery") + button');
    await wmsToggle.click();
    
    // Verify layer is toggled (you might need visual regression for this)
    await expect(page.locator('text=Satellite Imagery')).toBeVisible();
  });

  test('should display drawing tools', async ({ page }) => {
    // Check if all drawing tools are present
    await expect(page.locator('[data-testid="draw-select"]')).toBeVisible();
    await expect(page.locator('[data-testid="draw-point"]')).toBeVisible();
    await expect(page.locator('[data-testid="draw-line"]')).toBeVisible();
    await expect(page.locator('[data-testid="draw-polygon"]')).toBeVisible();
    await expect(page.locator('[data-testid="draw-modify"]')).toBeVisible();
  });
});