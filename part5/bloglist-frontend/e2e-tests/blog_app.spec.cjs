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
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByRole('textbox').first().fill('root')
      await page.getByRole('textbox').last().fill('secret')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Superuser logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByRole('textbox').first().fill('root')
      await page.getByRole('textbox').last().fill('wrong')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('textbox').first().fill('root')
      await page.getByRole('textbox').last().fill('secret')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByPlaceholder('write title here').fill('Playwright testing is smooth')
      await page.getByPlaceholder('write author here').fill('Tester')
      await page.getByPlaceholder('write url here').fill('http://playwright.dev')
      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByText('Playwright testing is smooth Tester')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByPlaceholder('write title here').fill('Likable Blog')
      await page.getByPlaceholder('write author here').fill('Tester')
      await page.getByPlaceholder('write url here').fill('http://likable.com')
      await page.getByRole('button', { name: 'create' }).click()

      const blogCard = page.locator('.blog').filter({ hasText: 'Likable Blog' })
      await blogCard.getByRole('button', { name: 'view' }).click()
      await blogCard.getByRole('button', { name: 'like' }).click()

      await expect(blogCard.getByText('likes 1')).toBeVisible()
    })

    test('user who created a blog can delete it', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByPlaceholder('write title here').fill('Blog to delete')
      await page.getByPlaceholder('write author here').fill('Tester')
      await page.getByPlaceholder('write url here').fill('http://delete.com')
      await page.getByRole('button', { name: 'create' }).click()

      const blogCard = page.locator('.blog').filter({ hasText: 'Blog to delete' })

      await blogCard.getByRole('button', { name: 'view' }).click()

      page.on('dialog', dialog => dialog.accept())

      await blogCard.getByRole('button', { name: 'remove' }).click()

      await expect(blogCard).not.toBeVisible()
    })

    test('blogs are ordered according to likes descending', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByPlaceholder('write title here').fill('First Blog - Few Likes')
      await page.getByPlaceholder('write author here').fill('Author 1')
      await page.getByPlaceholder('write url here').fill('http://blog1.com')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(page.getByText('First Blog - Few Likes Author 1')).toBeVisible()

      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByPlaceholder('write title here').fill('Second Blog - Most Likes')
      await page.getByPlaceholder('write author here').fill('Author 2')
      await page.getByPlaceholder('write url here').fill('http://blog2.com')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(page.getByText('Second Blog - Most Likes Author 2')).toBeVisible()

      const secondBlog = page.locator('.blog').filter({ hasText: 'Second Blog - Most Likes' })
      await secondBlog.getByRole('button', { name: 'view' }).click()

      const likeBtn = secondBlog.getByRole('button', { name: 'like' })
      await likeBtn.click()
      await expect(secondBlog.getByText('likes 1')).toBeVisible()

      await likeBtn.click()
      await expect(secondBlog.getByText('likes 2')).toBeVisible()

      const firstBlogInList = page.locator('.blog').first()
      await expect(firstBlogInList).toContainText('Second Blog - Most Likes')
    })
  })
})