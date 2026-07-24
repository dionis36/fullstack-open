import { describe, test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NotificationContextProvider } from '../context/NotificationContext'
import { UserContextProvider } from '../context/UserContext'
import BlogForm from './BlogForm'
import blogService from '../services/blogs'

const queryClient = new QueryClient()

const renderWithProviders = (ui) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <NotificationContextProvider>
        <UserContextProvider>
          <BrowserRouter>{ui}</BrowserRouter>
        </UserContextProvider>
      </NotificationContextProvider>
    </QueryClientProvider>
  )
}

vi.mock('../services/blogs', () => ({
  default: {
    create: vi.fn(),
    getAll: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    setToken: vi.fn()
  }
}))

describe('<BlogForm />', () => {
  test('calls createBlog with right details when a new blog is created', async () => {
    const userInstance = userEvent.setup()

    renderWithProviders(<BlogForm />)

    const titleInput = screen.getByPlaceholderText('write title here')
    const authorInput = screen.getByPlaceholderText('write author here')
    const urlInput = screen.getByPlaceholderText('write url here')
    const sendButton = screen.getByText('create')

    await userInstance.type(titleInput, 'Testing React Forms')
    await userInstance.type(authorInput, 'Test Author')
    await userInstance.type(urlInput, 'http://testurl.com')
    await userInstance.click(sendButton)

    expect(blogService.create.mock.calls).toHaveLength(1)
    expect(blogService.create.mock.calls[0][0].title).toBe(
      'Testing React Forms'
    )
    expect(blogService.create.mock.calls[0][0].author).toBe('Test Author')
    expect(blogService.create.mock.calls[0][0].url).toBe('http://testurl.com')
  })
})
