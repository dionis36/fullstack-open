import { useRef } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { Navbar, Nav, Container, Button } from 'react-bootstrap'

import { useBlogs } from './hooks/useBlogs'
import { useUserValue, useUserDispatch } from './context/UserContext'
import { removeUser } from './services/persistentUser'

import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Users from './components/Users'
import UserView from './components/UserView'
import BlogView from './components/BlogView'
import ErrorBoundary from './components/ErrorBoundary'

const App = () => {
  const user = useUserValue()
  const userDispatch = useUserDispatch()
  const blogFormRef = useRef()

  const { data: blogs = [], isLoading } = useBlogs()

  const handleLogout = () => {
    removeUser()
    userDispatch({ type: 'CLEAR_USER' })
  }

  if (!user) {
    return (
      <Container className="mt-5" style={{ maxWidth: 420 }}>
        <h2 className="mb-4">Log in to application</h2>
        <Notification />
        <LoginForm />
      </Container>
    )
  }

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <Container>
      <Navbar
        collapseOnSelect
        expand="lg"
        bg="dark"
        variant="dark"
        className="px-3 mb-4 rounded mt-3"
      >
        <Navbar.Brand as={Link} to="/">
          BlogApp
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              blogs
            </Nav.Link>
            <Nav.Link as={Link} to="/users">
              users
            </Nav.Link>
          </Nav>
          <Nav>
            <span className="navbar-text me-3">
              <strong>{user.name || user.username}</strong> logged in
            </span>
            <Button variant="outline-light" size="sm" onClick={handleLogout}>
              logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <h2>Blog Application</h2>
      <Notification />

      <ErrorBoundary>
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <Togglable buttonLabel="new blog" ref={blogFormRef}>
                  <BlogForm toggleRef={blogFormRef} />
                </Togglable>
                <div className="mt-4">
                  {isLoading && <div>Loading blogs...</div>}
                  {sortedBlogs.map((b) => (
                    <div
                      key={b.id}
                      className="p-3 mb-2 border rounded bg-light"
                    >
                      <Link
                        to={`/blogs/${b.id}`}
                        style={{ textDecoration: 'none', fontWeight: 'bold' }}
                      >
                        {b.title} — {b.author}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            }
          />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<UserView />} />
          <Route path="/blogs/:id" element={<BlogView />} />
          <Route
            path="*"
            element={
              <div className="mt-4 text-center">
                <h2>404 - Page Not Found</h2>
                <p>The page you are looking for does not exist.</p>
              </div>
            }
          />
        </Routes>
      </ErrorBoundary>
    </Container>
  )
}

export default App
