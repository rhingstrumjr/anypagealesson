const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const QuestionSet = require('./questionSets')

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: 'Name is required',
    trim: true
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error('Age must be greater than 0')
      }
    }
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is not valid')
      }
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 7
  },
  classesEnrolled: [], // might be able to make these virtual
  classesOwned: [],
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
}, {
  timestamps: true
})

userSchema.virtual('questionSets', {
  ref: "QuestionSet",
  localField: '_id',
  foreignField: 'creator'
})

userSchema.virtual('learningGroups', {
  ref: "QuestionSet",
  localField: '_id',
  foreignField: 'creator'
})

userSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.tokens

  return userObject
}

userSchema.methods.generateAuthToken = async function () {
  const user = this
  const token = jwt.sign( {_id: user._id.toString() }, 'secretsauce')
  
  user.tokens = user.tokens.concat({ token })
  await user.save()
  
  return token
}

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email })

  if (!user) {
    throw new Error('Unable to login')
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    throw new Error('Unable to login')
  }

  return user
}

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
  const user = this

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})

userSchema.pre('remove', async function (next) {
  const user = this
  await QuestionSet.deleteMany({ creator: user._id })
  next()
})

const User = mongoose.model('User', userSchema)
module.exports = User