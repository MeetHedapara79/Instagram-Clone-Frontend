import { test, expect } from '@playwright/test';

test.describe('Reset Password Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/resetpassword');
  });

  test('should toggle new password visibility', async ({ page }) => {
    const passwordInput = page.getByPlaceholder('New Password');
    const toggleButton = page
      .locator('input[placeholder="New Password"]')
      .locator('..')
      .locator('button');

    await expect(passwordInput).toHaveAttribute('type', 'password');

    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'text');

    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should show validation errors for empty fields on blur', async ({ page }) => {
    const usernameInput = page.getByPlaceholder('Username');
    const passwordInput = page.getByPlaceholder('New Password');

    await usernameInput.focus();
    await passwordInput.focus();
    await usernameInput.focus();

    await expect(page.getByText('Username is required.')).toBeVisible();
    await expect(page.getByText('Please enter a valid username.')).toBeVisible();
    await expect(page.getByText('Password is required.')).toBeVisible();
  });

  test('should show recovery modal on successful form submission', async ({ page }) => {
    await page.route('**/auth/resetPassword', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    await page.getByPlaceholder('Username').fill('reset_user');
    await page.getByPlaceholder('New Password').fill('newStrongPwd123');

    const resetBtn = page.getByRole('button', { name: 'Reset Password' });
    await expect(resetBtn).toBeEnabled();
    await resetBtn.click();

    await expect(page.getByRole('heading', { name: 'Recovery Code' })).toBeVisible();
    await expect(page.getByText(/Please save this code/)).toBeVisible();
  });

  test('should show error message on reset failure', async ({ page }) => {
    await page.route('**/auth/resetPassword', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Invalid username or password' }),
      });
    });

    await page.getByPlaceholder('Username').fill('reset_user');
    await page.getByPlaceholder('New Password').fill('badpass');

    const resetBtn = page.getByRole('button', { name: 'Reset Password' });
    await resetBtn.click();

    await expect(page.getByText('Invalid username or password')).toBeVisible();
  });

  test('should enable "Continue to Login" only after downloading code', async ({ page }) => {
    await page.route('**/auth/resetPassword', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    await page.getByPlaceholder('Username').fill('reset_user');
    await page.getByPlaceholder('New Password').fill('securePass123');

    await page.getByRole('button', { name: 'Reset Password' }).click();

    const continueButton = page.getByRole('button', { name: 'Yes, Continue to Login' });
    await expect(continueButton).toBeDisabled();

    await page.getByRole('button', { name: 'Download Code' }).click();

    await expect(continueButton).toBeEnabled();
  });
});
