import { useState } from 'react'
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useMatch
} from 'react-router-dom'
import { useField, useAnecdotes } from './hooks'

const Menu = () => {
  const padding = { paddingRight: 5 }
  return (
    <div>
      <Link to="/" style={padding}>anecdotes</Link>
      <Link to="/create" style={padding}>create new</Link>
      <Link to="/about" style={padding}>about</Link>
    </div>
  )
}

const AnecdoteList = () => {
  const { anecdotes, deleteAnecdote } = useAnecdotes()
  return (
    <div>
      <h2>Anecdotes</h2>
      <ul>
        {anecdotes.map(anecdote => (
          <li key={anecdote.id}>
            <Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link>
            <button onClick={() => deleteAnecdote(anecdote.id)} style={{ marginLeft: 10 }}>delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

const Anecdote = () => {
  const { anecdotes } = useAnecdotes()
  const match = useMatch('/anecdotes/:id')
  const anecdote = match
    ? anecdotes.find(a => String(a.id) === String(match.params.id))
    : null

  if (!anecdote) return null

  return (
    <div>
      <h2>{anecdote.content} by {anecdote.author}</h2>
      <div>has {anecdote.info ? <a href={anecdote.info}>{anecdote.info}</a> : 'no info'}</div>
      <br />
      <div>has {anecdote.votes} votes</div>
      <br />
    </div>
  )
}

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>
    <em>An anecdote is a brief, revealing account of an individual person or an incident.</em>
  </div>
)

const Footer = () => (
  <div style={{ marginTop: 20, fontSize: '0.9em', color: '#666' }}>
    Anecdote app for Full Stack Open.
  </div>
)

const CreateNew = ({ setNotification }) => {
  const { reset: resetContent, ...content } = useField('text')
  const { reset: resetAuthor, ...author } = useField('text')
  const { reset: resetInfo, ...info } = useField('text')

  const { addAnecdote } = useAnecdotes()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await addAnecdote({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0
    })
    setNotification(`a new anecdote '${content.value}' created!`)
    setTimeout(() => {
      setNotification('')
    }, 5000)
    navigate('/')
  }

  const handleReset = () => {
    resetContent()
    resetAuthor()
    resetInfo()
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content: <input {...content} />
        </div>
        <div>
          author: <input {...author} />
        </div>
        <div>
          url for more info: <input {...info} />
        </div>
        <button type="submit">create</button>
        <button type="button" onClick={handleReset}>reset</button>
      </form>
    </div>
  )
}

const App = () => {
  const [notification, setNotification] = useState('')

  return (
    <div style={{ padding: 20 }}>
      <h1>Software anecdotes</h1>
      <Menu />
      {notification && <div style={{ border: '1px solid green', padding: 10, margin: '10px 0' }}>{notification}</div>}
      <Routes>
        <Route path="/anecdotes/:id" element={<Anecdote />} />
        <Route path="/" element={<AnecdoteList />} />
        <Route path="/create" element={<CreateNew setNotification={setNotification} />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App