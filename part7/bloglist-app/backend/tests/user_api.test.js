const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('secret', 10)
    const user = new User({ username: 'root', name: 'Superuser', passwordHash })
    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await User.find({})

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'password123'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await User.find({})
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert.ok(usernames.includes(newUser.username))
  })

  test('creation fails with status code 400 if password is too short', async () => {
    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: '12'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert.ok(result.body.error.includes('password must be at least 3 characters long'))
  })

  test('creation fails with status code 400 if username is not unique', async () => {
    const newUser = {
      username: 'root',
      name: 'Superuser duplicate',
      password: 'password123'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert.ok(result.body.error.includes('expected `username` to be unique'))
  })
})

after(async () => {
  await mongoose.connection.close()
})