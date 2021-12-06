const express = require('express')
const Question = require('../models/questions')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/questions', auth, async (req, res) => {
  const question = new Question(req.body)
  try {
    await question.save()
    res.status(201).send(question)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.get('/questions', auth, async (req, res) => {
  try {
    const questions = await Question.find({})
    res.send(questions)
  } catch (e) {
    res.status(500).send()
  }
})

router.get('/questions/:id', auth, async (req, res) => {
  const _id = req.params.id
  try {
    const question = await Question.findById(_id)
    if (!question) {
      return res.status(404).send()
    }
    res.send(question)
  } catch (e) {
    res.status(500).send()
  }
})

router.patch('/questions/:id', auth, async (req, res) => {
  const _id = req.params.id
  const update = req.body
  const attemptedUpdates = Object.keys(update)
  const allowedUpdates = ['text', 'answers', 'type', 'points', 'websitesUsedOn', 'isPublic']

  const isValidUpdate = attemptedUpdates.every((updateCall) => allowedUpdates.includes(updateCall))
  if (!isValidUpdate) {
    res.status(400).send({error: "Invalid update"})
  }
  try {
    const question = await Question.findById(_id)
    attemptedUpdates.forEach((item) => question[item] = update[item])
    await question.save()

    if (!question) {
      res.status(404).send()
    }
    res.send(question)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.delete('/questions/:id', auth, async (req, res) => {
  const _id = req.params.id

  try {
    const question = await Question.findByIdAndDelete(_id)
    if (!question) {
      return res.status(404).send()
    }
    res.send(question)
  } catch (e) {
    res.status(500).send()
  }
})

module.exports = router