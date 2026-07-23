import { useAnecdotes, useVoteAnecdote, useDeleteAnecdote } from '../hooks/useAnecdotes'
import useAnecdoteStore from '../store'

const AnecdoteList = () => {
  const { data: anecdotes, isLoading, isError } = useAnecdotes()
  const voteMutation = useVoteAnecdote()
  const deleteMutation = useDeleteAnecdote()
  const filter = useAnecdoteStore((state) => state.filter)

  if (isLoading) return <div>loading anecdotes data...</div>
  if (isError) return <div>anecdote service not available due to server problems</div>

  const handleVote = (anecdote) => {
    voteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
  }

  const handleDelete = (id) => {
    deleteMutation.mutate(id)
  }

  const filtered = anecdotes.filter((a) =>
    a.content.toLowerCase().includes(filter.toLowerCase())
  )

  const sorted = [...filtered].sort((a, b) => b.votes - a.votes)

  return (
    <div>
      {sorted.map((anecdote) => (
        <div
          key={anecdote.id}
          style={{
            marginBottom: 12,
            padding: 12,
            border: '1px solid #444',
            borderRadius: 6
          }}
        >
          <div>{anecdote.content}</div>
          <div style={{ marginTop: 6, display: 'flex', gap: 10, alignItems: 'center' }}>
            <span>has <strong>{anecdote.votes}</strong> votes</span>
            <button onClick={() => handleVote(anecdote)}>vote</button>
            {anecdote.votes === 0 && (
              <button
                onClick={() => handleDelete(anecdote.id)}
                style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '4px 8px', borderRadius: 4, cursor: 'pointer' }}
              >
                delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList