import { useParams } from 'react-router-dom'
import { useUsers } from '../hooks/useUsers'
import { ListGroup, Spinner } from 'react-bootstrap'

const UserView = () => {
  const { id } = useParams()
  const { data: users = [], isLoading } = useUsers()

  if (isLoading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    )

  const user = users.find((u) => u.id === id)

  if (!user)
    return <div className="alert alert-warning mt-4">User not found.</div>

  return (
    <div className="mt-4">
      <h2 className="mb-4">{user.name || user.username}</h2>
      <h4 className="mb-3 text-muted">Added Blogs</h4>

      {user.blogs && user.blogs.length > 0 ? (
        <ListGroup className="shadow-sm">
          {user.blogs.map((b) => (
            <ListGroup.Item key={b.id} className="p-3">
              <i className="bi bi-file-earmark-text me-2"></i>
              {b.title}
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p className="text-muted">No blogs added yet.</p>
      )}
    </div>
  )
}

export default UserView
