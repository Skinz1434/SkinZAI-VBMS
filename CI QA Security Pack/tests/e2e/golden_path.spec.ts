import { test, expect } from '@playwright/test';

test('golden path', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page.getByText('Dashboard')).toBeVisible();
});
