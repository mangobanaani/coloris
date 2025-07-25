import { test, expect } from '@playwright/test';

test('capture screenshots of the game states', async ({ page }) => {
  // Go to the application root with a timeout
  await page.goto('/', { timeout: 10000 });
  
  // Wait for initial content and take screenshot of start screen
  await page.waitForSelector('text=Coloris');
  await page.screenshot({ path: 'game-start-screen.png', fullPage: true });
  
  // Click Start Game and take screenshot of active game
  const startButton = page.getByRole('button', { name: /Start Game/i });
  await expect(startButton).toBeVisible();
  await startButton.click();
  
  // Wait for game to be active
  await page.waitForSelector('text=Score');
  await page.waitForTimeout(500); // Extra wait for the game to render fully
  
  // Take screenshot of active game
  await page.screenshot({ path: 'game-active.png', fullPage: true });
  
  // Always pass this test - we're just generating screenshots
  expect(true).toBeTruthy();
});
