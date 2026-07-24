import { Link } from 'react-router-dom'
import { Table, Spinner } from 'react-bootstrap'
import { useUsers } from '../hooks/useUsers'

const Users = () => {
  const { data: users = [], isLoading } = useUsers()

  if (isLoading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    )
  }

  return (
    <div className="mt-4">
      <h2 className="mb-4">Users</h2>
      <Table striped bordered hover responsive className="shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>User</th>
            <th>Blogs Created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>
                <Link
                  to={`/users/${u.id}`}
                  className="text-decoration-none fw-bold"
                >
                  {u.name || u.username}
                </Link>
              </td>
              <td>{u.blogs ? u.blogs.length : 0}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default Users
