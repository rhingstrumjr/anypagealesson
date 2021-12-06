const express = require('express')
const QuestionSet = require('../models/questionSets')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/questionsets', auth, async (req, res) => {
  try {
    const questionSet = new QuestionSet({ ...req.body, creator: req.user._id})
    await questionSet.save()
    res.status(201).send(questionSet)
  } catch (e) {
    res.status(500).send()
  }
})

router.get('/questionsets', auth, async (req, res) => {
  try {
    // const questionSets = await QuestionSet.find({ creator: req.user._id})
    await req.user.populate('questionSets')
    res.send(req.user.questionSets)
  } catch (e) {
    res.status(500).send()
    console.log(e)
  }
})

router.get('/questionsets/:_id', auth, async (req, res) => {
  const _id = req.params._id
  try {
    const questionSet = await QuestionSet.findOne({ _id, creator: req.user._id})
    if (!questionSet) {
      return res.status(404).send()
    }
    res.send(questionSet)
  } catch (e) {
    res.status(500).send()
  }
})

router.patch('/questionsets/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['title', 'questions', 'websitesUsedOn', 'isPublic']
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
  if (!isValidOperation) {
    return res.status(400).send({error: 'Invalid updates'})
  }

  try {
    const questionSet = await QuestionSet.findOne({_id: req.params.id, creator: req.user._id})
    if (!questionSet) {
      return res.status(404).send()
    }
    updates.forEach((update) => questionSet[update] = req.body[update])
    await questionSet.save()
    res.send(questionSet)
  } catch (e) {
    res.status(400).send()
  }
})

router.delete('/questionsets/:id', auth, async (req, res) => {
  try {
    const questionSet = await QuestionSet.findOneAndDelete({_id: req.params.id, creator: req.user._id})
    if (!questionSet) {
      res.status(404).send()
    }
    res.send(questionSet)
  } catch (e) {
    res.status(500).send()
  }
})
module.exports = router