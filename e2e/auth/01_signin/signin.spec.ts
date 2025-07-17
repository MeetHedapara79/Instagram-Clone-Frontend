import { test, expect } from '@playwright/test';
import { environment } from '../../../src/environments/environment';

test.describe.serial('Signin Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should render logo and login form', async ({ page }) => {
    await expect(page.getByPlaceholder('Phone number, username or email address')).toBeVisible();
    await expect(page.getByPlaceholder('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Log in' })).toBeVisible();
  });

  test('should toggle password visibility', async ({ page }) => {
    const passwordInput = page.getByPlaceholder('Password');
    const toggleButton = page.locator('button').filter({ has: page.locator('i.fa-eye-slash') });
    
    await passwordInput.fill('test123');
    await toggleButton.click();
    
    await expect(passwordInput).toHaveAttribute('type', 'text');
  });

  test('should navigate to forgot password and register page', async ({ page }) => {
    await page.getByRole('link', { name: 'Forgotten your password?' }).click();
    await expect(page).toHaveURL('/forgotpassword');

    await page.goto('/');
    await page.getByRole('link', { name: 'Sign up' }).click();
    await expect(page).toHaveURL('/register');
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('/');
    await page.getByPlaceholder('Phone number, username or email address').fill('meet.hedapara');
    await page.getByPlaceholder('Password').fill('Meet@1234');
    await page.getByRole('button', { name: 'Log in' }).click();

    await expect(page).toHaveURL('/home/homePage');
  });

  test('should show error on failed login', async ({ page }) => {
    await page.route('**/auth/signin', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Invalid username or password' }),
      });
    });
  
    await page.goto(`${environment.appUrl}`);
  
    await page.getByPlaceholder('Phone number, username or email address').fill('invalid');
    await page.getByPlaceholder('Password').fill('wrongpass');
    await page.getByRole('button', { name: 'Log in' }).click();
  
    await expect(page.getByText('Invalid username or password')).toBeVisible();
  });
  
});
