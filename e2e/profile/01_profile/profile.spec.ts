import { test, expect } from '@playwright/test';

const defaultUser = {
  id: 'user123',
  username: 'john_doe',
  email: 'john@example.com',
  profilePic: null,
  followers: null,
  following: null,
  bio: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  password: '',
  email_phone: '',
  recoveryCode: null,
};

const defaultPosts = [
  {
    _id: 'post1',
    content: 'https://example.com/image.jpg',
    likes: 10,
    comments: 5,
  },
  {
    _id: 'post2',
    content: 'https://example.com/video.mp4',
    likes: 15,
    comments: 3,
  },
];

test.describe('Profile Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/user/getOneUserById/**', async (route) => {
      route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({ data: defaultUser, message: 'Success' }),
      });
    });

    await page.route('**/posts/getPosts/**', async (route) => {
      route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify(defaultPosts),
      });
    });

    await page.route('**/user/followingList/**', async (route) => {
      route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            { id: 'u1', username: 'alice', profilePic: null },
            { id: 'u2', username: 'bob', profilePic: null },
          ],
          message: 'Success',
        }),
      });
    });

    await page.route('**/user/followerList/**', async (route) => {
      route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            { id: 'u3', username: 'carol', profilePic: null },
          ],
          message: 'Success',
        }),
      });
    });

    await page.goto('/home/profile');
  });

  test('should display user info and posts', async ({ page }) => {
    await expect(page.getByText('john_doe')).toBeVisible();
    await expect(page.getByText('2 posts')).toBeVisible();
    await expect(page.getByText('1 followers')).toBeVisible();
    await expect(page.getByText('2 following')).toBeVisible();
  });

  test('should navigate to TAGGED tab', async ({ page }) => {
    await page.getByText('TAGGED').click();
    await expect(page).toHaveURL(/.*\/home\/profile\/tag/);
  });

  test('should handle video and image post types', async ({ page }) => {
    const video = page.locator('video');
    const image = page.locator('img[alt="Post"]');
    await expect(video).toHaveCount(1);
    await expect(image).toHaveCount(1);
  });
});