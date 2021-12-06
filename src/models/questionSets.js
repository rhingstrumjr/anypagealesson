const mongoose = require('mongoose')
const validator = require('validator')

const questionSetSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  questions: {
    type: [{
      type:mongoose.Schema.Types.ObjectId
    }]
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
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
}, {
  timestamps: true
})

const QuestionSet = mongoose.model('QuestionSet', questionSetSchema)
module.exports = QuestionSet