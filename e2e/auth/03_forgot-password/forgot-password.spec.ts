import { test, expect } from '@playwright/test';

test.describe('Forgot Password Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/forgotpassword');
  });

  test('should toggle recovery code visibility', async ({ page }) => {
    const recoveryInput = page.getByPlaceholder('Recovery Code');

    const toggleButton = page
      .locator('input[placeholder="Recovery Code"]')
      .locator('..')
      .locator('button');

    await expect(recoveryInput).toHaveAttribute('type', 'password');

    await toggleButton.click();
    await expect(recoveryInput).toHaveAttribute('type', 'text');

    await toggleButton.click();
    await expect(recoveryInput).toHaveAttribute('type', 'password');
  });
  
  test('should show validation error for empty fields on blur', async ({ page }) => {
    const usernameInput = page.getByPlaceholder('Username');
    const codeInput = page.getByPlaceholder('Recovery Code');

    await usernameInput.focus();
    await codeInput.focus();
    await usernameInput.focus();
    await page.getByRole('button', { name: 'Validate' }).isDisabled();

    await expect(page.getByText('Username is required.')).toBeVisible();
    await expect(page.getByText('Please enter a valid username.')).toBeVisible();
    await expect(page.getByText('RecoveryCode is required.')).toBeVisible();
  });

  test('should navigate to resetpassword on successful form submission', async ({
    page,
  }) => {
    await page.route('**/auth/forgotPassword', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    await page.getByPlaceholder('Username').fill('forgot_user');
    await page.getByPlaceholder('Recovery Code').fill('abc123');

    const validateBtn = page.getByRole('button', { name: 'Validate' });
    await expect(validateBtn).toBeEnabled();

    await validateBtn.click();

    await expect(page).toHaveURL(/.*\/resetpassword/);
  });

  test('should show error message on invalid recovery code or username', async ({
    page,
  }) => {
    await page.route('**/auth/forgotPassword', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Invalid recovery code' }),
      });
    });

    await page.getByPlaceholder('Username').fill('forgot_user');
    await page.getByPlaceholder('Recovery Code').fill('wrongcode');

    await page.getByRole('button', { name: 'Validate' }).click();

    await expect(page.getByText('Invalid recovery code')).toBeVisible();
  });
});
