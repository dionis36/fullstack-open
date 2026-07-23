import { useState, useEffect, useRef } from 'react'
import { Routes, Route, useMatch, useNavigate } from 'react-router-dom'
import Notification from './components/Notification'
import Navigation from './components/Navigation'
import BlogList from './components/BlogList'
import BlogView from './components/BlogView'
import Users from './components/Users'
import UserView from './components/UserView'
import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'
import LoginForm from './components/LoginForm'
import { Container, Typography } from '@mui/material'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [users, setUsers] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notification, setNotification] = useState(null)

  const blogFormRef = useRef()
  const navigate = useNavigate()

  const [user, setUser] = useState(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      return user
    }
    return null
  })

  const notify = (message, type = 'info') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  useEffect(() => {
    if (user) {
      blogService.getAll().then(blogs => setBlogs(blogs))
      userService.getAll().then(users => setUsers(users))
    }
  }, [user])

  const userMatch = useMatch('/users/:id')
  const matchedUser = userMatch
    ? users.find(u => u.id === userMatch.params.id)
    : null

  const blogMatch = useMatch('/blogs/:id')
  const matchedBlog = blogMatch
    ? blogs.find(b => b.id === blogMatch.params.id)
    : null

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      notify(`Welcome back ${user.name}`)
    } catch {
      notify('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    navigate('/')
  }

  const handleCreateBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      const newBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(newBlog))
      notify(`a new blog ${newBlog.title} by ${newBlog.author} added`)
    } catch {
      notify('failed to create blog', 'error')
    }
  }

  const handleLikeBlog = async (id, blogObject) => {
    try {
      const updatedBlog = await blogService.update(id, blogObject)
      setBlogs(blogs.map(b => b.id === id ? { ...updatedBlog, user: b.user } : b))
    } catch {
      notify('failed to update likes', 'error')
    }
  }

  const handleDeleteBlog = async (id) => {
    try {
      await blogService.remove(id)
      setBlogs(blogs.filter(b => b.id !== id))
      notify('blog removed successfully')
      navigate('/')
    } catch {
      notify('failed to delete blog', 'error')
    }
  }

  const handleCommentBlog = async (id, comment) => {
    try {
      const updatedBlog = await blogService.addComment(id, comment)
      setBlogs(blogs.map(b => b.id === id ? { ...updatedBlog, user: b.user } : b))
    } catch {
      notify('failed to add comment', 'error')
    }
  }

  if (user === null) {
    return (
      <Container>
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
          notification={notification}
        />
      </Container>
    )
  }

  return (
    <Container>
      <Navigation user={user} handleLogout={handleLogout} />
      <Typography variant="h3" component="h2" gutterBottom>
        Blog App
      </Typography>
      <Notification info={notification} />

      <Routes>
        <Route
          path="/"
          element={
            <BlogList
              blogs={blogs}
              blogFormRef={blogFormRef}
              handleCreateBlog={handleCreateBlog}
              handleLikeBlog={handleLikeBlog}
              handleDeleteBlog={handleDeleteBlog}
              user={user}
            />
          }
        />
        <Route
          path="/blogs"
          element={
            <BlogList
              blogs={blogs}
              blogFormRef={blogFormRef}
              handleCreateBlog={handleCreateBlog}
              handleLikeBlog={handleLikeBlog}
              handleDeleteBlog={handleDeleteBlog}
              user={user}
            />
          }
        />
        <Route
          path="/blogs/:id"
          element={
            <BlogView
              blog={matchedBlog}
              handleLike={handleLikeBlog}
              handleDelete={handleDeleteBlog}
              handleComment={handleCommentBlog}
              currentUser={user}
            />
          }
        />
        <Route path="/users" element={<Users users={users} />} />
        <Route path="/users/:id" element={<UserView user={matchedUser} />} />
      </Routes>
    </Container>
  )
}

export default App