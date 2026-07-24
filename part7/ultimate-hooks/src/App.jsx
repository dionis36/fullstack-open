import { useState, useEffect } from 'react'
import axios from 'axios'

const useField = (type) => {
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

const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  useEffect(() => {
    axios
      .get(baseUrl)
      .then((response) => setResources(response.data))
      .catch((err) => console.error(`Error loading ${baseUrl}:`, err))
  }, [baseUrl])

  const create = async (newObject) => {
    const response = await axios.post(baseUrl, newObject)
    setResources(resources.concat(response.data))
    return response.data
  }

  const service = {
    create
  }

  return [resources, service]
}

const App = () => {
  const { reset: resetNote, ...content } = useField('text')
  const { reset: resetName, ...name } = useField('text')
  const { reset: resetNumber, ...number } = useField('text')

  const [notes, noteService] = useResource('http://localhost:3005/notes')
  const [persons, personService] = useResource('http://localhost:3005/persons')

  const handleNoteSubmit = (event) => {
    event.preventDefault()
    noteService.create({ content: content.value })
    resetNote()
  }

  const handlePersonSubmit = (event) => {
    event.preventDefault()
    personService.create({ name: name.value, number: number.value })
    resetName()
    resetNumber()
  }

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h2>notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input {...content} placeholder="new note..." />
        <button type="submit">create</button>
      </form>
      {notes.map((n) => (
        <p key={n.id || n.content}>{n.content}</p>
      ))}

      <h2>persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name <input {...name} />
        <br />
        number <input {...number} />
        <br />
        <button type="submit">create</button>
      </form>
      {persons.map((p) => (
        <p key={p.id || p.name}>
          {p.name} {p.number}
        </p>
      ))}
    </div>
  )
}

export default App