const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Superuser',
        username: 'root',
        password: 'secret'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByLabel('Username')).toBeVisible()
    await expect(page.getByLabel('Password')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByRole('textbox', { name: 'Username' }).fill('root')
      await page.getByRole('textbox', { name: 'Password' }).fill('secret')
      await page.getByRole('button', { name: 'Login' }).click()

      await expect(page.getByText('Superuser logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByRole('textbox', { name: 'Username' }).fill('root')
      await page.getByRole('textbox', { name: 'Password' }).fill('wrong')
      await page.getByRole('button', { name: 'Login' }).click()

      await expect(page.getByText('Wrong username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('textbox', { name: 'Username' }).fill('root')
      await page.getByRole('textbox', { name: 'Password' }).fill('secret')
      await page.getByRole('button', { name: 'Login' }).click()
      await expect(page.getByText('Superuser logged in')).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page
        .getByPlaceholder('write title here')
        .fill('Playwright testing is smooth')
      await page.getByPlaceholder('write author here').fill('Tester')
      await page
        .getByPlaceholder('write url here')
        .fill('http://playwright.dev')
      await page.getByRole('button', { name: 'create' }).click()

      await expect(
        page.getByText('Playwright testing is smooth — Tester')
      ).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByPlaceholder('write title here').fill('Likable Blog')
      await page.getByPlaceholder('write author here').fill('Tester')
      await page.getByPlaceholder('write url here').fill('http://likable.com')
      await page.getByRole('button', { name: 'create' }).click()

      await page.getByRole('link', { name: 'Likable Blog — Tester' }).click()

      await expect(page.getByText('0 likes')).toBeVisible()
      await page.getByRole('button', { name: 'Like' }).click()
      await expect(page.getByText('1 likes')).toBeVisible()
    })

    test('user who created a blog can delete it', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByPlaceholder('write title here').fill('Blog to delete')
      await page.getByPlaceholder('write author here').fill('Tester')
      await page.getByPlaceholder('write url here').fill('http://delete.com')
      await page.getByRole('button', { name: 'create' }).click()

      await page.getByRole('link', { name: 'Blog to delete — Tester' }).click()

      page.on('dialog', (dialog) => dialog.accept())

      await page.getByRole('button', { name: 'remove' }).click()

      await expect(page.getByText('Blog to delete — Tester')).not.toBeVisible()
    })

    test('blogs are ordered according to likes descending', async ({
      page
    }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page
        .getByPlaceholder('write title here')
        .fill('First Blog - Few Likes')
      await page.getByPlaceholder('write author here').fill('Author 1')
      await page.getByPlaceholder('write url here').fill('http://blog1.com')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(
        page.getByText('First Blog - Few Likes — Author 1')
      ).toBeVisible()

      await page.getByRole('button', { name: 'new blog' }).click()
      await page
        .getByPlaceholder('write title here')
        .fill('Second Blog - Most Likes')
      await page.getByPlaceholder('write author here').fill('Author 2')
      await page.getByPlaceholder('write url here').fill('http://blog2.com')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(
        page.getByText('Second Blog - Most Likes — Author 2')
      ).toBeVisible()

      await page
        .getByRole('link', { name: 'Second Blog - Most Likes — Author 2' })
        .click()
      const likeBtn = page.getByRole('button', { name: 'Like' })
      await likeBtn.click()
      await expect(page.getByText('1 likes')).toBeVisible()
      await likeBtn.click()
      await expect(page.getByText('2 likes')).toBeVisible()

      await page.getByRole('link', { name: 'blogs', exact: true }).click()

      const allBlogs = page.locator('.p-3.mb-2.border.rounded.bg-light')
      await expect(allBlogs.first()).toContainText(
        'Second Blog - Most Likes — Author 2'
      )
    })
  })
})
