import { test, expect, type Page } from '@playwright/test';

// Helper function to wait for the game UI to fully load
async function waitForGameLoad(page: Page) {
  // Wait for the title to appear with a shorter timeout
  await page.locator('text=Coloris').first().waitFor({ timeout: 5000 });
}

test.describe('Coloris Game', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app with a navigation timeout
    await page.goto('/', { timeout: 10000 });
    await waitForGameLoad(page);
  });

  test('should load the game correctly', async ({ page }) => {
    // Check if the game title is visible
    await expect(page.locator('text=Coloris').first()).toBeVisible();
    
    // Check if Start Game button exists
    await expect(page.getByRole('button', { name: /Start Game/i })).toBeVisible();
  });

  test('should start a new game when clicking on "Start Game"', async ({ page }) => {
    // Find and click the Start Game button
    const startButton = page.getByRole('button', { name: /Start Game/i });
    await expect(startButton).toBeVisible();
    await startButton.click();
    
    // After clicking Start Game, the game grid should appear
    // Let's check for game elements that should appear after starting
    await expect(page.locator('text=Score')).toBeVisible();
    
    // Game should be running now, so there should be a grid visible
    const gridElement = page.locator('div').filter({ hasText: /Score/ }).first();
    await expect(gridElement).toBeVisible();
  });
});
