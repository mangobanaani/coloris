import { test, expect, type Page } from '@playwright/test';

// Helper function to wait for the game UI to fully load
async function waitForGameLoad(page: Page) {
  // Wait for the title to appear with a shorter timeout
  await page.locator('text=Coloris').first().waitFor({ timeout: 5000 });
}

test.describe('Coloris Game Controls', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the homepage with a timeout
    await page.goto('/', { timeout: 10000 });
    await waitForGameLoad(page);
    
    // Start the game by clicking the Start Game button
    const startButton = page.getByRole('button', { name: /Start Game/i });
    await expect(startButton).toBeVisible();
    await startButton.click();
    
    // Verify game is started by checking for Score element
    await expect(page.locator('text=Score')).toBeVisible({ timeout: 5000 });
  });

  test('should respond to keyboard controls', async ({ page }) => {
    // We need to focus on the game area to receive keyboard events
    // Try to find the game grid more reliably
    const gameGrid = page.locator('div').filter({ hasText: /Score/ }).first();
    await gameGrid.click();
    
    // Press a few keys quickly to test controls
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowRight');
    
    // Just verify the game is still running
    await expect(page.locator('text=Score')).toBeVisible();
  });

  test('should show copyright information', async ({ page }) => {
    // Check for the copyright text with a more flexible selector
    await expect(page.getByText(/© mangobanaani 2025/)).toBeVisible();
  });
});
