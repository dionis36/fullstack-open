import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  useBlogs,
  useLikeBlog,
  useAddComment,
  useDeleteBlog
} from '../hooks/useBlogs'
import { useUserValue } from '../context/UserContext'
import {
  Card,
  Button,
  Form,
  ListGroup,
  InputGroup,
  Spinner,
  Badge
} from 'react-bootstrap'

const BlogView = () => {
  const { id } = useParams()
  const [commentText, setCommentText] = useState('')

  const { data: blogs = [], isLoading } = useBlogs()
  const likeMutation = useLikeBlog()
  const addCommentMutation = useAddComment()
  const deleteMutation = useDeleteBlog()
  const user = useUserValue()
  const navigate = useNavigate()

  if (isLoading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    )

  const blog = blogs.find((b) => b.id === id)
  if (!blog)
    return <div className="alert alert-warning mt-4">Blog not found.</div>

  const handleLike = () => {
    likeMutation.mutate({
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id || blog.user
    })
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteMutation.mutate(blog.id, {
        onSuccess: () => navigate('/')
      })
    }
  }

  const handleCommentSubmit = (e) => {
    e.preventDefault()
    if (!commentText.trim()) return

    addCommentMutation.mutate(
      { id: blog.id, comment: commentText.trim() },
      {
        onSuccess: () => setCommentText('')
      }
    )
  }

  const canRemove =
    user &&
    blog.user &&
    (blog.user.username === user.username || blog.user === user.id)

  return (
    <div className="mt-4">
      <Card className="mb-5 shadow-sm border-0 bg-light">
        <Card.Body className="p-4">
          <Card.Title className="display-6 fw-bold text-primary">
            {blog.title}
          </Card.Title>
          <Card.Subtitle className="mb-3 text-muted fs-5">
            by {blog.author}
          </Card.Subtitle>
          <Card.Text className="mb-2">
            <a
              href={blog.url}
              target="_blank"
              rel="noreferrer"
              className="text-decoration-none"
            >
              {blog.url}
            </a>
          </Card.Text>
          <Card.Text className="d-flex align-items-center gap-3 mb-3">
            <Badge bg="secondary" className="fs-6 p-2">
              {blog.likes} likes
            </Badge>
            <Button
              variant="outline-success"
              size="sm"
              onClick={handleLike}
              className="fw-bold px-3"
            >
              Like
            </Button>
          </Card.Text>
          <Card.Text className="text-muted small">
            Added by{' '}
            <span className="fw-bold">
              {blog.user?.name || blog.user?.username || 'unknown'}
            </span>
          </Card.Text>
          {canRemove && (
            <Button
              variant="danger"
              size="sm"
              onClick={handleDelete}
              className="mt-2"
            >
              remove
            </Button>
          )}
        </Card.Body>
      </Card>

      <h4 className="mb-3 border-bottom pb-2">Comments</h4>
      <Form
        onSubmit={handleCommentSubmit}
        className="mb-4 shadow-sm p-3 rounded bg-white border"
      >
        <InputGroup>
          <Form.Control
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write an anonymous comment..."
          />
          <Button type="submit" variant="primary">
            Add Comment
          </Button>
        </InputGroup>
      </Form>

      {blog.comments && blog.comments.length > 0 ? (
        <ListGroup variant="flush" className="shadow-sm border rounded">
          {blog.comments.map((c, index) => (
            <ListGroup.Item key={index} className="p-3 bg-light">
              {c}
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p className="text-muted fst-italic">No comments yet. Be the first!</p>
      )}
    </div>
  )
}

export default BlogView
