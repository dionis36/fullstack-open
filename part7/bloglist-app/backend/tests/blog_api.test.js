const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

let token = null

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('secret', 10)
  const user = new User({ username: 'root', name: 'Superuser', passwordHash })
  await user.save()

  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'root', password: 'secret' })

  token = loginResponse.body.token

  const blogObjects = helper.initialBlogs.map(b => new Blog({ ...b, user: user._id }))
  const promiseArray = blogObjects.map(b => b.save())
  await Promise.all(promiseArray)
})

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('unique identifier property is named id', async () => {
    const response = await api.get('/api/blogs')
    const blog = response.body[0]
    assert.ok(blog.id)
    assert.strictEqual(blog._id, undefined)
  })
})

describe('addition of a new blog', () => {
  test('succeeds with valid data and valid token', async () => {
    const newBlog = {
      title: 'Canonical code style',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    assert.ok(titles.includes('Canonical code style'))
  })

  test('fails with status code 401 if token is missing', async () => {
    const newBlog = {
      title: 'Unauthorized blog',
      author: 'Anonymous',
      url: 'http://unauthorized.com'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })

  test('defaults likes property to 0 if missing', async () => {
    const newBlog = {
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html'
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)

    assert.strictEqual(response.body.likes, 0)
  })

  test('fails with status code 400 if title is missing', async () => {
    const newBlog = {
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
  })

  test('fails with status code 400 if url is missing', async () => {
    const newBlog = {
      title: 'TDD harms architecture',
      author: 'Robert C. Martin'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if token and id are valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
  })
})

describe('updating a blog', () => {
  test('succeeds in updating likes', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlogData = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 10
    }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlogData)
      .expect(200)

    assert.strictEqual(response.body.likes, blogToUpdate.likes + 10)
  })
})

after(async () => {
  await mongoose.connection.close()
})