import { useState, useEffect } from 'react'
import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

export const useAnecdotes = () => {
  const [anecdotes, setAnecdotes] = useState([])

  useEffect(() => {
    axios.get(baseUrl).then((res) => setAnecdotes(res.data))
  }, [])

  const addAnecdote = async (newObject) => {
    const res = await axios.post(baseUrl, newObject)
    setAnecdotes(anecdotes.concat(res.data))
    return res.data
  }

  const deleteAnecdote = async (id) => {
    await axios.delete(`${baseUrl}/${id}`)
    setAnecdotes(anecdotes.filter(a => a.id !== id))
  }

  return { anecdotes, addAnecdote, deleteAnecdote }
}

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => {
    setValue('')
  }

  return {
    type,
    value,
    onChange,
    reset
  }
}