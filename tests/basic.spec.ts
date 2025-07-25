import { test, expect } from '@playwright/test';

test('homepage has Coloris game', async ({ page }) => {
  // Go to the application root with a timeout
  await page.goto('/', { timeout: 10000 });
  
  // Take a screenshot for debugging regardless of success/failure
  await page.screenshot({ path: 'homepage.png', fullPage: true });
  
  // Test the page loaded properly
  await expect(page).toHaveURL('/');
  
  // Verify some basic content is visible - use multiple selectors for better reliability
  const hasTitle = await page.locator('h1, h2, h3').filter({ hasText: /Coloris/i }).count() > 0;
  expect(hasTitle, 'Expected to find a heading containing "Coloris"').toBeTruthy();
  
  // Check for basic UI elements that should always be present
  const hasButtons = await page.locator('button').count() > 0;
  expect(hasButtons, 'Expected to find at least one button on the page').toBeTruthy();
});
