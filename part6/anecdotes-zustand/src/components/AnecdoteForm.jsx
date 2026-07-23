import { useCreateAnecdote } from '../hooks/useAnecdotes'

const AnecdoteForm = () => {
  const newAnecdoteMutation = useCreateAnecdote()

  const addAnecdote = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value.trim()
    if (!content) return

    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate(content)
  }

  return (
    <div style={{ marginTop: 25 }}>
      <h3>create new</h3>
      <form onSubmit={addAnecdote}>
        <div>
          <input name="anecdote" placeholder="type new anecdote..." />
        </div>
        <button type="submit" style={{ marginTop: 8 }}>
          create
        </button>
      </form>
    </div>
  )
}

export default AnecdoteForm