const mongoose = require('mongoose')
const validator = require('validator')
// const QuestionSet = require('./questionSets')

const learningGroupSchema = mongoose.Schema({
  title: {
    type: String,
    required: 'Class title is required',
    maxLength: 40,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  questionSetsAssigned: [ {
    questionSet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'QuestionSet'
    },
    assignedDate: {
      type: Date
    },
    dueDate: {
      type: Date
    }
  }],
  admin: [
    {
      id: {
      type: mongoose.Schema.Types.ObjectId
      },
      hasJoined: {
        type: Boolean
      }
    }
  ],
  students: [
    {
      id: {
      type: mongoose.Schema.Types.ObjectId
      },
      hasJoined: {
        type: Boolean
      }
    }
  ],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
}, {
  timestamps: true
})

// userSchema.virtual('questionSets', {
//   ref: "QuestionSet",
//   localField: '_id',
//   foreignField: 'creator'
// })

// learningGroupSchema.methods.toJSON = function () {
//   const user = this
//   const userObject = user.toObject()

//   delete userObject.password
//   delete userObject.tokens

//   return userObject
// }

// learningGroupSchema.pre('remove', async function (next) {
//   const learningGroup = this
//   await QuestionSet.deleteMany({ creator: user._id })
//   next()
// })

const LearningGroup = mongoose.model('LearningGroup', learningGroupSchema)
module.exports = LearningGroup