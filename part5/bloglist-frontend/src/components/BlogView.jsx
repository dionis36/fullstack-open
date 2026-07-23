import { useState } from 'react'
import { Card, CardContent, Typography, Button, TextField, Box, Link as MuiLink, List, ListItem, ListItemText } from '@mui/material'

const BlogView = ({ blog, handleLike, handleDelete, handleComment, currentUser }) => {
  const [comment, setComment] = useState('')

  if (!blog) return null

  const isCreator =
    !blog.user ||
    blog.user === currentUser?.username ||
    blog.user === currentUser?.name ||
    (typeof blog.user === 'object' && (
      blog.user.username === currentUser?.username ||
      blog.user.name === currentUser?.name ||
      blog.user.id === currentUser?.id
    ))

  const onLikeClick = () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user ? (blog.user.id || blog.user) : null
    }
    handleLike(blog.id, updatedBlog)
  }

  const onDeleteClick = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      handleDelete(blog.id)
    }
  }

  return (
    <Card sx={{ mt: 3, maxWidth: 600 }}>
      <CardContent>
        <Typography variant="h4" component="h2" gutterBottom>
          {blog.title}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <MuiLink href={blog.url} target="_blank" rel="noreferrer">{blog.url}</MuiLink>
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          {blog.likes} likes{' '}
          <Button variant="outlined" size="small" onClick={onLikeClick} sx={{ ml: 1 }}>
            like
          </Button>
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Added by {blog.user ? (blog.user.name || blog.user.username) : 'Superuser'}
        </Typography>
        
        {isCreator && (
          <Button variant="contained" color="error" size="small" onClick={onDeleteClick}>
            remove
          </Button>
        )}

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Comments
          </Typography>
          <Box component="form" onSubmit={(e) => {
            e.preventDefault()
            handleComment(blog.id, comment)
            setComment('')
          }} sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              size="small"
              variant="outlined"
              placeholder="write a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              fullWidth
            />
            <Button type="submit" variant="contained">
              add comment
            </Button>
          </Box>
          <List>
            {blog.comments && blog.comments.map((c, i) => (
              <ListItem key={i} divider disablePadding sx={{ py: 1 }}>
                <ListItemText primary={c} />
              </ListItem>
            ))}
          </List>
        </Box>
      </CardContent>
    </Card>
  )
}

export default BlogView