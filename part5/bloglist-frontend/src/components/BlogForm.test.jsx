import { describe, test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  test('calls createBlog with right details when a new blog is created', async () => {
    const createBlog = vi.fn()
    const user = userEvent.setup()

    render(<BlogForm createBlog={createBlog} />)

    const titleInput = screen.getByPlaceholderText('write title here')
    const authorInput = screen.getByPlaceholderText('write author here')
    const urlInput = screen.getByPlaceholderText('write url here')
    const sendButton = screen.getByText('create')

    await user.type(titleInput, 'Testing React Forms')
    await user.type(authorInput, 'Test Author')
    await user.type(urlInput, 'http://testurl.com')
    await user.click(sendButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('Testing React Forms')
    expect(createBlog.mock.calls[0][0].author).toBe('Test Author')
    expect(createBlog.mock.calls[0][0].url).toBe('http://testurl.com')
  })
})