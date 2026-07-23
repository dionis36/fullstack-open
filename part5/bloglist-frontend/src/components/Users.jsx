import { Link } from 'react-router-dom'
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'

const Users = ({ users }) => {
  return (
    <div>
      <Typography variant="h4" component="h2" gutterBottom>
        Users
      </Typography>
      <TableContainer component={Paper} sx={{ maxWidth: 500 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="right">Blogs Created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(u => (
              <TableRow key={u.id}>
                <TableCell>
                  <Link to={`/users/${u.id}`} style={{ textDecoration: 'none', color: '#1976d2' }}>
                    {u.name || u.username}
                  </Link>
                </TableCell>
                <TableCell align="right">{u.blogs ? u.blogs.length : 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default Users