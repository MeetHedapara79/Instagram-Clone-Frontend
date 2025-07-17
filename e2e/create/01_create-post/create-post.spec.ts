import { test, expect } from '@playwright/test';

test.describe('Create Post Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/posts/create', async (route) => {
      const json = {
        message: 'Post created successfully',
        data: {
          id: 'post123',
          content: 'url',
          caption: 'caption',
          location: 'location',
        },
      };
      await route.fulfill({ status: 201, body: JSON.stringify(json) });
    });

    await page.route('**/user/tagUser', async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ message: 'Tagged successfully' }),
      });
    });

    await page.route('**/user/search?**', async (route) => {
      const url = new URL(route.request().url());
      const query = url.searchParams.get('query');
      const result =
        query === 'john' ? [{ id: 'user123', username: 'john_doe' }] : [];
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ data: result, message: 'success' }),
      });
    });

    await page.goto('/home/create');
  });

  const filePath = 'e2e/assets/test-image.jpeg';

  test('should show drag and drop UI on create page', async ({ page }) => {
    await expect(page.getByText('Create new post')).toBeVisible();
    await expect(page.getByText('Drag photos and videos here')).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Select From Computer' })
    ).toBeVisible();
  });

  test('should upload an image and show preview', async ({ page }) => {
    await page.getByTestId('file-input').setInputFiles(filePath);
    await expect(page.getByTestId('media-preview')).toBeVisible();
    await expect(page.getByTestId('next-create-model')).toBeVisible();
  });

  test('should open side panel on Next and allow caption & location input', async ({
    page,
  }) => {
    await page.locator('input[type="file"]').setInputFiles(filePath);
    await page.getByTestId('next-create-model').click();
    await expect(page.getByPlaceholder('Write a caption...')).toBeVisible();
    await expect(page.getByPlaceholder('Add Location')).toBeVisible();
  });

  test('should tag user by clicking on image and selecting user', async ({
    page,
  }) => {
    await page.getByTestId('file-input').setInputFiles(filePath);
    await page.getByTestId('next-create-model').click();

    await page.getByTestId('media-preview').click(); // Triggers tag box
    await page.locator('input[formControlName="clickText"]').fill('john');

    const tagOption = page.getByText('john_doe');
    await expect(tagOption).toBeVisible();
    await tagOption.click();
  });

  test('should submit the post and navigate to profile', async ({ page }) => {
    await page.locator('input[type="file"]').setInputFiles(filePath);
    await page.getByTestId('next-create-model').click();

    await page.fill(
      'textarea[placeholder="Write a caption..."]',
      'A test caption'
    );
    await page.fill('input[placeholder="Add Location"]', 'NYC');

    await page.getByTestId('share-create-model').click();
    await expect(page).toHaveURL(/\/home\/profile$/);
  });

  test('should cancel post creation and reset the form', async ({ page }) => {
    await page.getByTestId('file-input').setInputFiles(filePath);
    await page.getByRole('button', { name: 'Cancel' }).click();

    await expect(page.getByTestId('media-preview')).toHaveCount(0);
    await expect(page.getByText('Drag photos and videos here')).toBeVisible();
  });
});
