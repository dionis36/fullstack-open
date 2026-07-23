import { useState } from 'react'
import { Box, Card, Typography, TextField, Button } from '@mui/material'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleCreate = (event) => {
    event.preventDefault()
    createBlog({
      title,
      author,
      url
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <Card sx={{ p: 3, mb: 3, maxWidth: 500, boxShadow: 2 }}>
      <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
        Create New Blog
      </Typography>
      <Box component="form" onSubmit={handleCreate} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Title"
          variant="outlined"
          type="text"
          value={title}
          name="Title"
          placeholder="write title here"
          onChange={({ target }) => setTitle(target.value)}
          fullWidth
          size="small"
        />

        <TextField
          label="Author"
          variant="outlined"
          type="text"
          value={author}
          name="Author"
          placeholder="write author here"
          onChange={({ target }) => setAuthor(target.value)}
          fullWidth
          size="small"
        />

        <TextField
          label="URL"
          variant="outlined"
          type="text"
          value={url}
          name="Url"
          placeholder="write url here"
          onChange={({ target }) => setUrl(target.value)}
          fullWidth
          size="small"
        />

        <Button type="submit" variant="contained" color="primary" sx={{ alignSelf: 'flex-start' }}>
          create
        </Button>
      </Box>
    </Card>
  )
}

export default BlogForm