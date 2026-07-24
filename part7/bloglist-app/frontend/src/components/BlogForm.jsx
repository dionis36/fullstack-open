import { Form, Button, Card } from 'react-bootstrap'
import { useField } from '../hooks/useField'
import { useCreateBlog } from '../hooks/useBlogs'

const BlogForm = ({ toggleRef }) => {
  const { reset: resetTitle, ...title } = useField('text')
  const { reset: resetAuthor, ...author } = useField('text')
  const { reset: resetUrl, ...url } = useField('text')

  const createBlogMutation = useCreateBlog()

  const handleCreate = (event) => {
    event.preventDefault()

    createBlogMutation.mutate(
      { title: title.value, author: author.value, url: url.value },
      {
        onSuccess: () => {
          resetTitle()
          resetAuthor()
          resetUrl()
          if (toggleRef?.current) {
            toggleRef.current.toggleVisibility()
          }
        }
      }
    )
  }

  return (
    <Card className="mb-4 shadow-sm border-0 bg-light">
      <Card.Body>
        <Card.Title className="mb-3">Create a New Blog</Card.Title>
        <Form onSubmit={handleCreate}>
          <Form.Group className="mb-3" controlId="title">
            <Form.Label className="fw-bold text-muted small">Title</Form.Label>
            <Form.Control {...title} placeholder="write title here" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="author">
            <Form.Label className="fw-bold text-muted small">Author</Form.Label>
            <Form.Control {...author} placeholder="write author here" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="url">
            <Form.Label className="fw-bold text-muted small">URL</Form.Label>
            <Form.Control {...url} placeholder="write url here" />
          </Form.Group>

          <Button variant="success" type="submit" className="px-4">
            create
          </Button>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default BlogForm
