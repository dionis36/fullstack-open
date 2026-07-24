/* eslint-disable react-refresh/only-export-components */
import { createContext, useReducer, useContext, useEffect } from 'react'
import blogService from '../services/blogs'

const userReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return action.payload
    case 'CLEAR_USER':
      return null
    default:
      return state
  }
}

const UserContext = createContext()

export const UserContextProvider = (props) => {
  const [user, dispatch] = useReducer(userReducer, null)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch({ type: 'SET_USER', payload: user })
      blogService.setToken(user.token)
    }
  }, [])

  return (
    <UserContext.Provider value={[user, dispatch]}>
      {props.children}
    </UserContext.Provider>
  )
}

export const useUserValue = () => useContext(UserContext)[0]

export const useUserDispatch = () => useContext(UserContext)[1]

export default UserContext
