import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import anecdoteService from '../services/anecdotes'
import { useNotify } from '../context/NotificationContext'

export const useAnecdotes = () => {
  return useQuery({
    queryKey: ['anecdotes'],
    queryFn: anecdoteService.getAll,
    refetchOnWindowFocus: false
  })
}

export const useCreateAnecdote = () => {
  const queryClient = useQueryClient()
  const notify = useNotify()

  return useMutation({
    mutationFn: anecdoteService.createNew,
    onSuccess: (newAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      notify(`you created '${newAnecdote.content}'`)
    },
    onError: (error) => {
      notify(`error: ${error.message}`)
    }
  })
}

export const useVoteAnecdote = () => {
  const queryClient = useQueryClient()
  const notify = useNotify()

  return useMutation({
    mutationFn: (updatedAnecdote) =>
      anecdoteService.update(updatedAnecdote.id, updatedAnecdote),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      notify(`you voted '${updated.content}'`)
    }
  })
}

export const useDeleteAnecdote = () => {
  const queryClient = useQueryClient()
  const notify = useNotify()

  return useMutation({
    mutationFn: anecdoteService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      notify('anecdote deleted')
    }
  })
}