import { describe, test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter as Router } from 'react-router-dom'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    title: 'Component testing with react-testing-library',
    author: 'Matti Luukkainen',
    url: 'https://reactpatterns.com/',
    likes: 5,
    user: {
      username: 'root',
      name: 'Superuser'
    }
  }

  const user = {
    username: 'root',
    name: 'Superuser'
  }

  test('renders title and author, but does not render url or likes by default', () => {
    const { container } = render(
      <Router>
        <Blog blog={blog} user={user} />
      </Router>
    )

    const summaryDiv = container.querySelector('.blog-summary')
    expect(summaryDiv).toHaveTextContent('Component testing with react-testing-library')
    expect(summaryDiv).toHaveTextContent('Matti Luukkainen')

    const detailsDiv = container.querySelector('.blog-details')
    expect(detailsDiv).toBeNull()
  })

  test('renders url and likes when the view button has been clicked', async () => {
    const { container } = render(
      <Router>
        <Blog blog={blog} user={user} />
      </Router>
    )

    const userInstance = userEvent.setup()
    const button = screen.getByText('view')
    await userInstance.click(button)

    const detailsDiv = container.querySelector('.blog-details')
    expect(detailsDiv).not.toBeNull()
    expect(detailsDiv).toHaveTextContent('https://reactpatterns.com/')
    expect(detailsDiv).toHaveTextContent('likes 5')
  })

  test('if the like button is clicked twice, the event handler is called twice', async () => {
    const mockHandler = vi.fn()
    render(
      <Router>
        <Blog blog={blog} user={user} updateLikes={mockHandler} />
      </Router>
    )

    const userInstance = userEvent.setup()

    const viewButton = screen.getByText('view')
    await userInstance.click(viewButton)

    const likeButton = screen.getByText('like')
    await userInstance.click(likeButton)
    await userInstance.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})