import Blog from './Blog'
import Togglable from './Togglable'
import BlogForm from './BlogForm'
import { Box } from '@mui/material'

const BlogList = ({ blogs, blogFormRef, handleCreateBlog, handleLikeBlog, handleDeleteBlog, user }) => {
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <Box>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={handleCreateBlog} />
      </Togglable>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
        {sortedBlogs.map(blog => (
          <Blog
            key={blog.id}
            blog={blog}
            updateLikes={handleLikeBlog}
            deleteBlog={handleDeleteBlog}
            user={user}
          />
        ))}
      </Box>
    </Box>
  )
}

export default BlogList