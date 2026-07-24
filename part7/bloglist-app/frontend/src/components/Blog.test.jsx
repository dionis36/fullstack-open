import { describe, test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NotificationContextProvider } from '../context/NotificationContext'
import { UserContextProvider } from '../context/UserContext'
import Blog from './Blog'
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
    update: vi.fn(),
    remove: vi.fn(),
    getAll: vi.fn(),
    create: vi.fn(),
    setToken: vi.fn()
  }
}))

describe('<Blog />', () => {
  const blog = {
    id: '123',
    title: 'Component testing with react-testing-library',
    author: 'Matti Luukkainen',
    url: 'https://reactpatterns.com/',
    likes: 5,
    user: {
      id: 'userId123',
      username: 'root',
      name: 'Superuser'
    }
  }

  test('renders title and author, but does not render url or likes by default', () => {
    renderWithProviders(<Blog blog={blog} />)

    const titleAndAuthor = screen.getByText(
      /Component testing with react-testing-library/
    )
    expect(titleAndAuthor).toBeInTheDocument()

    const url = screen.queryByText('https://reactpatterns.com/')
    expect(url).toBeNull()
  })

  test('renders url and likes when the view button has been clicked', async () => {
    renderWithProviders(<Blog blog={blog} />)

    const userInstance = userEvent.setup()
    const button = screen.getByText('view')
    await userInstance.click(button)

    const url = screen.getByText('https://reactpatterns.com/')
    expect(url).toBeInTheDocument()

    const likes = screen.getByText(/likes 5/)
    expect(likes).toBeInTheDocument()
  })

  test('if the like button is clicked twice, the event handler is called twice', async () => {
    renderWithProviders(<Blog blog={blog} />)

    const userInstance = userEvent.setup()

    const viewButton = screen.getByText('view')
    await userInstance.click(viewButton)

    const likeButton = screen.getByText('like')
    await userInstance.click(likeButton)
    await userInstance.click(likeButton)

    expect(blogService.update.mock.calls).toHaveLength(2)
  })
})
