const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

require('dotenv').config()
const url = process.env.MONGODB_URI

console.log('connecting to MongoDB...')

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const numberValidator = (val) => {
  return /^\d{2,3}-\d+$/.test(val)
}

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: numberValidator,
      message: props => `${props.value} is not a valid phone number! Must be formatted like 09-1234556 or 040-223344`
    },
    required: [true, 'User phone number required']
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)