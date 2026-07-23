import { Link } from 'react-router-dom'
import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material'

const Navigation = ({ user, handleLogout }) => {
  return (
    <AppBar position="static" sx={{ mb: 3 }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Button color="inherit" component={Link} to="/">
            BLOGS
          </Button>
          <Button color="inherit" component={Link} to="/users">
            USERS
          </Button>
        </Box>
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body1">
              {user.name || user.username} logged in
            </Typography>
            <Button color="inherit" variant="outlined" onClick={handleLogout}>
              logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Navigation