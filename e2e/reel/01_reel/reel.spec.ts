import { test, expect } from '@playwright/test';

const mockReels = [
  {
    id: 'reel1',
    content: 'https://example.com/reel1.mp4',
    caption: 'A fun reel',
    likes: 10,
    user: {
      id: 'user1',
      username: 'john_doe',
      profilePic: 'https://example.com/profile.jpg'
    }
  },
  {
    id: 'reel2',
    content: 'https://example.com/reel2.webm',
    caption: 'Another reel',
    likes: 5,
    user: {
      id: 'user2',
      username: 'jane_doe',
      profilePic: ''
    }
  }
];

const likeData = [
  { postId: 'reel1', userId: 'user1' },
  { postId: 'reel2', userId: 'user1' }
];

const authToken = 'mockAuthToken';

test.describe('Reels Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().addCookies([
      {
        name: 'authToken',
        value: authToken,
        domain: 'localhost',
        path: '/',
        httpOnly: false,
        secure: false,
      }
    ]);

    await page.route('**/posts/getPostsOfFollowing', async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ data: mockReels, message: 'success' })
      });
    });

    await page.route('**/posts/likeDataList', async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ data: likeData, message: 'success' })
      });
    });

    await page.route('**/posts/toggleLike', async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ data: true, message: 'Liked successfully' })
      });
    });

    await page.goto('/home/reels');
  });

  test('should render reels if available', async ({ page }) => {
    await expect(page.getByText('A fun reel')).toBeVisible();
    await expect(page.getByText('john_doe')).toBeVisible();
  });

  test('should show default message if no reels available', async ({ page }) => {
    await page.route('**/posts/getPostsOfFollowing', async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ data: [], message: 'success' })
      });
    });
    await page.reload();
    await expect(page.getByText('Reels are not available right now')).toBeVisible();
  });

  test('should open likes modal on like count click', async ({ page }) => {
    await page.getByText('10').click();
    await expect(page.locator('app-likes')).toBeVisible();
  });

  test('should toggle like on like button click', async ({ page }) => {
    const likeButton = page.locator('button:has(i.fa-heart)').first();
    await likeButton.click();
    await expect(likeButton.locator('i')).toHaveClass(/fa-heart/);
  });

  test('should open comment modal on comment icon click', async ({ page }) => {
    await page.locator('i.far.fa-comment').first().click();
    await expect(page.locator('app-comment')).toBeVisible();
  });

  test('should open share modal on share icon click', async ({ page }) => {
    await page.locator('i.fa-square-up-right').first().click();
    await expect(page.locator('app-share')).toBeVisible();
  });
});
