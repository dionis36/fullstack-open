import { useState } from 'react'

const Blog = ({ blog, updateLikes, deleteBlog, user }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

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
    blog.user === user.username ||
    blog.user === user.name ||
    (typeof blog.user === 'object' && (
      blog.user.username === user.username ||
      blog.user.name === user.name ||
      blog.user.id === user.id
    )) ||
    typeof blog.user === 'string'

  return (
    <div style={blogStyle} className="blog">
      <div className="blog-summary">
        {blog.title} {blog.author}{' '}
        <button onClick={toggleVisibility}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>

      {visible && (
        <div className="blog-details">
          <p>{blog.url}</p>
          <p>
            likes {blog.likes}{' '}
            <button onClick={handleLike}>like</button>
          </p>
          <p>{blog.user && (blog.user.name || blog.user.username || blog.user)}</p>
          {isCreator && (
            <button onClick={handleDelete} style={{ backgroundColor: '#f44336', color: 'white' }}>
              remove
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog