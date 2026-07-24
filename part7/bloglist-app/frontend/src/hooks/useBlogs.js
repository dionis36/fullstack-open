import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogs'
import { useNotify } from '../context/NotificationContext'

export const useBlogs = () => {
  return useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    refetchOnWindowFocus: false
  })
}

export const useCreateBlog = () => {
  const queryClient = useQueryClient()
  const notify = useNotify()

  return useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      notify(`A new blog '${newBlog.title}' by ${newBlog.author} added`)
    },
    onError: (error) => {
      notify(
        `Failed to add blog: ${error.response?.data?.error || error.message}`,
        true
      )
    }
  })
}

export const useLikeBlog = () => {
  const queryClient = useQueryClient()
  const notify = useNotify()

  return useMutation({
    mutationFn: (updatedBlog) =>
      blogService.update(updatedBlog.id, updatedBlog),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      notify(`You liked '${updated.title}'`)
    }
  })
}

export const useDeleteBlog = () => {
  const queryClient = useQueryClient()
  const notify = useNotify()

  return useMutation({
    mutationFn: blogService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      notify('Blog successfully removed')
    },
    onError: (error) => {
      notify(
        `Failed to delete blog: ${error.response?.data?.error || error.message}`,
        true
      )
    }
  })
}

export const useAddComment = () => {
  const queryClient = useQueryClient()
  const notify = useNotify()

  return useMutation({
    mutationFn: ({ id, comment }) => blogService.addComment(id, comment),
    onSuccess: (updatedBlog) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      notify(`Comment added to '${updatedBlog.title}'`)
    }
  })
}
