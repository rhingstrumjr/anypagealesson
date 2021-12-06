const mongoose = require('mongoose')
const validator = require('validator')

const questionSchema = mongoose.Schema({
  text: {
    type: String,
    required: 'A question is required'
  },
  type : { 
    type: String,
    required: true
  },
  answers : [{
    answer: String || Number,
    isCorrect: Boolean
  }],
  points : {
    type: Number,
    min: 0,
    max: 10
  },
  websitesUsedOn : {
    type: [{
      type: String,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error('Must be an URL')
        }
      }
    }]
  },
  isPublic: {
    type: Boolean,
    default: true
  }
})

const Question = mongoose.model('Question', questionSchema)
module.exports = Question