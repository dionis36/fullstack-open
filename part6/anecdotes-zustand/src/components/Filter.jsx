import useAnecdoteStore from '../store'

const Filter = () => {
  const setFilter = useAnecdoteStore((state) => state.setFilter)

  const handleChange = (event) => {
    setFilter(event.target.value)
  }

  return (
    <div style={{ marginBottom: 15 }}>
      filter <input onChange={handleChange} placeholder="search anecdotes..." />
    </div>
  )
}

export default Filter