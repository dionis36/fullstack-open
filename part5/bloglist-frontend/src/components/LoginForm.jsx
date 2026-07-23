import { Box, Card, Typography, TextField, Button, Alert } from '@mui/material'

const LoginForm = ({
  username,
  password,
  handleUsernameChange,
  handlePasswordChange,
  handleSubmit,
  notification
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
      }}
    >
      <Card sx={{ p: 4, width: '100%', maxWidth: 400, boxShadow: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom align="center" fontWeight="bold">
          Log in to application
        </Typography>
        
        {notification && (
          <Alert severity={notification.type === 'error' ? 'error' : 'success'} sx={{ mb: 2 }}>
            {notification.message}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Username"
            variant="outlined"
            type="text"
            value={username}
            name="Username"
            onChange={handleUsernameChange}
            fullWidth
          />

          <TextField
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            name="Password"
            onChange={handlePasswordChange}
            fullWidth
          />

          <Button type="submit" variant="contained" color="primary" size="large" fullWidth sx={{ mt: 1 }}>
            Login
          </Button>
        </Box>
      </Card>
    </Box>
  )
}

export default LoginForm