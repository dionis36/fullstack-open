import { describe, it, expect, beforeEach } from 'vitest'
import useAnecdoteStore from './store'

describe('Zustand Filter Store', () => {
  beforeEach(() => {
    useAnecdoteStore.setState({ filter: '' })
  })

  it('should have initial empty filter', () => {
    const state = useAnecdoteStore.getState()
    expect(state.filter).toBe('')
  })

  it('should update filter value cleanly', () => {
    useAnecdoteStore.getState().setFilter('react')
    const state = useAnecdoteStore.getState()
    expect(state.filter).toBe('react')
  })
})