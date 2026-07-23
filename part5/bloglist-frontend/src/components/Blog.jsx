import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, Typography, Button, Box, Link as MuiLink } from '@mui/material'

const Blog = ({ blog, updateLikes, deleteBlog, user }) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user ? (blog.user.id || blog.user) : null
    }
    updateLikes(blog.id, updatedBlog)
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteBlog(blog.id)
    }
  }

  const isCreator =
    !blog.user ||
    blog.user === user?.username ||
    blog.user === user?.name ||
    (typeof blog.user === 'object' && (
      blog.user.username === user?.username ||
      blog.user.name === user?.name ||
      blog.user.id === user?.id
    )) ||
    typeof blog.user === 'string'

  return (
    <Card variant="outlined" className="blog" sx={{ maxWidth: 600 }}>
      <CardContent sx={{ pb: '16px !important' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="blog-summary">
          <Typography variant="h6" component="div">
            <MuiLink component={Link} to={`/blogs/${blog.id}`} underline="hover" color="primary" fontWeight="bold">
              {blog.title} {blog.author}
            </MuiLink>
          </Typography>
          <Button variant="outlined" size="small" onClick={toggleVisibility}>
            {visible ? 'hide' : 'view'}
          </Button>
        </Box>

        {visible && (
          <Box className="blog-details" sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <MuiLink href={blog.url} target="_blank" rel="noreferrer">{blog.url}</MuiLink>
            </Typography>
            <Typography variant="body2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              likes {blog.likes}
              <Button variant="contained" size="small" onClick={handleLike}>
                like
              </Button>
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {blog.user && (blog.user.name || blog.user.username || blog.user)}
            </Typography>
            {isCreator && (
              <Button variant="contained" color="error" size="small" onClick={handleDelete} sx={{ mt: 1 }}>
                remove
              </Button>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default Blog