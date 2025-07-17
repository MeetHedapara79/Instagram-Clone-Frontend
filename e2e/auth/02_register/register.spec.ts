import { test, expect } from '@playwright/test';

test.describe.serial('Register Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register');
  });
 
  test('should toggle password visibility', async ({ page }) => {
    const passwordInput = page.getByPlaceholder('Password');
    const toggleButton = page.locator('button').filter({ has: page.locator('i.fa-eye-slash') });
    
    await passwordInput.fill('test123');
    await toggleButton.click();
    
    await expect(passwordInput).toHaveAttribute('type', 'text');
  });

  test('should show validation error for invalid phone/email and username', async ({
    page,
  }) => {
    await page.getByTestId('emailphone').fill('invalid');
    await page.getByPlaceholder('Username').fill('   ');
    await page.getByPlaceholder('Password').fill('123456');

    expect(page.getByTestId('signUpBtn')).toBeDisabled();

    await expect(
      page.getByText(/Please enter a valid email or phone number/i)
    ).toBeVisible();
    await expect(
      page.getByText(/Please enter a valid username/i)
    ).toBeVisible();
  });

  test('should show recovery modal on successful registration', async ({
    page,
  }) => {
    await page
      .getByPlaceholder('Phone number or email address')
      .fill('user@example.com');
    await page.getByPlaceholder('Username').fill('playtest_user');
    await page.getByPlaceholder('Password').fill('validPass123');

    await page.route('**/auth/register', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    await page.getByRole('button', { name: 'Sign Up' }).click();

    await expect(page.getByText('Recovery Code')).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Download Code' })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Yes, Continue to Login' })
    ).toBeDisabled();
  });

  test('should enable Continue button only after Download', async ({
    page,
  }) => {
    await page
      .getByPlaceholder('Phone number or email address')
      .fill('user@example.com');
    await page.getByPlaceholder('Username').fill('playtest_user');
    await page.getByPlaceholder('Password').fill('validPass123');

    await page.route('**/auth/register', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    await page.getByRole('button', { name: 'Sign Up' }).click();

    const downloadBtn = page.getByRole('button', { name: 'Download Code' });
    const continueBtn = page.getByRole('button', {
      name: 'Yes, Continue to Login',
    });

    await expect(downloadBtn).toBeVisible();
    await expect(continueBtn).toBeDisabled();

    await downloadBtn.click(); 
    await expect(continueBtn).toBeEnabled();

    await continueBtn.click();
    await expect(page).toHaveURL('/');
  });

  test('should show error message on failed registration', async ({ page }) => {
    await page
      .getByPlaceholder('Phone number or email address')
      .fill('user@example.com');
    await page.getByPlaceholder('Username').fill('playtest_user');
    await page.getByPlaceholder('Password').fill('validPass123');

    await page.route('**/auth/register', (route) => {
      route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Username already exists' }),
      });
    });

    await page.getByRole('button', { name: 'Sign Up' }).click();

    await expect(page.getByText('Username already exists')).toBeVisible();
  });

  test('should navigate to login page', async ({ page }) => {
    await page.getByRole('link', { name: 'Log In' }).click();
    await expect(page).toHaveURL('/');
  });
});
