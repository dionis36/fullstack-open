import { Alert } from 'react-bootstrap'
import { useNotificationValue } from '../context/NotificationContext'

const Notification = () => {
  const notification = useNotificationValue()

  if (!notification) return null

  return (
    <Alert
      variant={notification.isError ? 'danger' : 'success'}
      className="mt-3 shadow-sm font-weight-bold"
    >
      {notification.message}
    </Alert>
  )
}

export default Notification
