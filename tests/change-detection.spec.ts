import { test, expect } from '@playwright/test';

test.describe('Change Detection Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('should open change detection panel', async ({ page }) => {
    // Open change detection panel
    await page.click('button:has-text("Change Detection")');
    
    // Check if panel opens with form elements
    await expect(page.locator('text=Change Detection Analysis')).toBeVisible();
    await expect(page.locator('input[type="date"]').first()).toBeVisible();
    await expect(page.locator('input[type="date"]').nth(1)).toBeVisible();
    await expect(page.locator('button:has-text("Detect Changes")')).toBeVisible();
  });

  test('should show error for invalid dates', async ({ page }) => {
    // Open change detection panel
    await page.click('button:has-text("Change Detection")');
    
    // Set invalid dates (after date before before date)
    await page.fill('input[type="date"]:first-of-type', '2024-01-01');
    await page.fill('input[type="date"]:last-of-type', '2023-01-01');
    
    // Try to run analysis
    await page.click('button:has-text("Detect Changes")');
    
    // Should show error (backend validation)
    await expect(page.locator('text=Failed to perform change detection')).toBeVisible({ timeout: 10000 });
  });
}); 
