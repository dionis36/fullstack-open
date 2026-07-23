import { Alert } from '@mui/material'

const Notification = ({ info }) => {
  if (info === null || !info.message) {
    return null
  }

  return (
    <Alert severity={info.type === 'error' ? 'error' : 'success'} sx={{ mb: 3 }}>
      {info.message}
    </Alert>
  )
}

export default Notification