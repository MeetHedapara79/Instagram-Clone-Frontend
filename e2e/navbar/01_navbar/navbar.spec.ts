import { test, expect } from '@playwright/test';
import { environment } from '../../../src/environments/environment';

const BASE_URL = `${environment.appUrl}`;

test.describe('Navbar Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/auth/logout', route => {
      route.fulfill({ status: 200, body: '{}' });
    });

    await page.goto(`${BASE_URL}/home/homePage`);
  });

  test('should navigate to Home page', async ({ page }) => {
    await page.getByText('Home').click();
    await expect(page).toHaveURL(/.*\/home\/homePage/);
  });

  test('should toggle Search drawer', async ({ page }) => {
    await expect(page.getByTestId('search-drawer')).toHaveCount(0);
    await page.getByText('Search').click();
    await expect(page.getByTestId('search-drawer')).toHaveCount(1);
    await page.mouse.click(1000, 1000);
    await expect(page.getByTestId('search-drawer')).toHaveCount(0);
  });
  

  test('should navigate to Reels page', async ({ page }) => {
    await page.getByText('Reels').click();
    await expect(page).toHaveURL(/.*\/home\/reels/);
  });

  test('should navigate to Messages page', async ({ page }) => {
    await page.getByText('Messages').click();
    await expect(page).toHaveURL(/.*\/home\/message/);
  });

  test('should navigate to Notifications page', async ({ page }) => {
    await page.getByText('Notifications').click();
    await expect(page).toHaveURL(/.*\/home\/notification/);
  });

  test('should navigate to Create page', async ({ page }) => {
    await page.getByText('Create').click();
    await expect(page).toHaveURL(/.*\/home\/create/);
  });

  test('should navigate to Profile page', async ({ page }) => {
    await page.getByText('Profile').click();
    await expect(page).toHaveURL(/.*\/home\/profile/);
  });

  test('should call logout API and redirect to login', async ({ page }) => {
    const [request] = await Promise.all([
      page.waitForRequest('**/auth/logout'),
      page.getByText('Log Out').click()
    ]);

    expect(request.url()).toContain('/auth/logout');
    await expect(page).toHaveURL(`${BASE_URL}/`);
  });
});