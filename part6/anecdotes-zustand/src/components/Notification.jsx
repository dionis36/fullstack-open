import { useNotificationValue } from '../context/NotificationContext'

const Notification = () => {
  const notification = useNotificationValue()

  if (!notification) return null

  const style = {
    border: '1px solid #81c784',
    padding: '10px 14px',
    marginBottom: 16,
    borderRadius: 6,
    backgroundColor: '#e8f5e9',
    color: '#1b5e20',
    fontWeight: '500'
  }

  return <div style={style}>{notification}</div>
}

export default Notification