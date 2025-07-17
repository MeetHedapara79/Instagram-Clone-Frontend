import { test, expect } from '@playwright/test';

test.describe('Search Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/user/search?query=ali', async (route) => {
      route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: 'user1',
              username: 'alice',
              profilePic: 'https://example.com/alice.jpg'
            }
          ],
          message: 'Users found'
        })
      });
    });

    await page.route('**/user/search?query=bob', async (route) => {
      route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: 'user2',
              username: 'bob',
              profilePic: 'https://example.com/bob.jpg'
            }
          ],
          message: 'Users found'
        })
      });
    });

    await page.goto('/home/homePage');
    await page.getByText('Search').click();
    await expect(page.getByTestId('search-name')).toBeVisible();
  });

  test('should search for users and display results', async ({ page }) => {
    const input = page.locator('input[placeholder="Search..."]');
    await input.fill('ali');
    await page.waitForTimeout(600);
    await expect(page.getByText('alice')).toBeVisible();
  });

  test('should navigate to profile on user click', async ({ page }) => {
    const input = page.locator('input[placeholder="Search..."]');
    await input.fill('bob');
    await page.waitForTimeout(600);
    await page.getByText('bob').click();
    await expect(page).toHaveURL(/.*\/home\/profile\/user2/);
  });

  test('should close the drawer on close button click', async ({ page }) => {
    await page.getByRole('button', { name: /×/ }).click();
    await expect(page.getByTestId('search-drawer')).toHaveCount(0);
  });

  test('should not show results for empty input', async ({ page }) => {
    const input = page.locator('input[placeholder="Search..."]');
    await input.fill('');
    await page.waitForTimeout(600);
    await expect(page.getByTestId('search-result-list')).toHaveCount(0);
  });
});
