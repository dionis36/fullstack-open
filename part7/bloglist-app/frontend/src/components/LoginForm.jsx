import { Form, Button } from 'react-bootstrap'
import { useField } from '../hooks/useField'
import loginService from '../services/login'
import { useUserDispatch } from '../context/UserContext'
import { useNotify } from '../context/NotificationContext'
import { saveUser } from '../services/persistentUser'
import blogService from '../services/blogs'

const LoginForm = () => {
  // eslint-disable-next-line no-unused-vars
  const { reset: resetUsername, ...username } = useField('text')
  // eslint-disable-next-line no-unused-vars
  const { reset: resetPassword, ...password } = useField('password')

  const userDispatch = useUserDispatch()
  const notify = useNotify()

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username: username.value,
        password: password.value
      })
      saveUser(user)
      blogService.setToken(user.token)
      userDispatch({ type: 'SET_USER', payload: user })
      notify(`Welcome back ${user.name}`)
    } catch {
      notify('Wrong username or password', true)
    }
  }

  return (
    <Form
      onSubmit={handleSubmit}
      className="border p-4 rounded bg-light shadow-sm"
    >
      <Form.Group className="mb-3" controlId="username">
        <Form.Label>Username</Form.Label>
        <Form.Control {...username} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control {...password} />
      </Form.Group>

      <Button variant="primary" type="submit" className="w-100 mt-2">
        Login
      </Button>
    </Form>
  )
}

export default LoginForm
