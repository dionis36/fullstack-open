/* eslint-disable react-refresh/only-export-components */
import { createContext, useReducer, useContext } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload
    case 'CLEAR':
      return null
    default:
      return state
  }
}

const NotificationContext = createContext()

let timeoutId = null

export const NotificationContextProvider = (props) => {
  const [notification, dispatch] = useReducer(notificationReducer, null)

  return (
    <NotificationContext.Provider value={[notification, dispatch]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export const useNotificationValue = () => {
  const context = useContext(NotificationContext)
  return context[0]
}

export const useNotify = () => {
  const context = useContext(NotificationContext)
  const dispatch = context[1]

  return (message, seconds = 5) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    dispatch({ type: 'SET', payload: message })
    timeoutId = setTimeout(() => {
      dispatch({ type: 'CLEAR' })
    }, seconds * 1000)
  }
}

export default NotificationContext