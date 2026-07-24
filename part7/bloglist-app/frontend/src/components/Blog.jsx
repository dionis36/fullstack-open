import { useState } from 'react'
import { useLikeBlog, useDeleteBlog } from '../hooks/useBlogs'
import { useUserValue } from '../context/UserContext'

const Blog = ({ blog }) => {
  const [visible, setVisible] = useState(false)
  const user = useUserValue()
  const likeMutation = useLikeBlog()
  const deleteMutation = useDeleteBlog()

  const handleLike = () => {
    likeMutation.mutate({
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id || blog.user
    })
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog '${blog.title}' by ${blog.author}?`)) {
      deleteMutation.mutate(blog.id)
    }
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
    borderRadius: 4
  }

  const canRemove =
    user &&
    blog.user &&
    (blog.user.username === user.username || blog.user === user.id)

  return (
    <div style={blogStyle} className="blog">
      <div>
        {blog.title} <strong>{blog.author}</strong>{' '}
        <button onClick={() => setVisible(!visible)}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>
      {visible && (
        <div style={{ marginTop: 6 }}>
          <div>
            <a href={blog.url}>{blog.url}</a>
          </div>
          <div>
            likes {blog.likes} <button onClick={handleLike}>like</button>
          </div>
          <div>
            added by {blog.user?.name || blog.user?.username || 'unknown'}
          </div>
          {canRemove && (
            <button
              onClick={handleDelete}
              style={{
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: 3,
                padding: '2px 8px',
                marginTop: 4
              }}
            >
              remove
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
