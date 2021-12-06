const express = require('express')
const LearningGroup = require('../models/learningGroups')
const auth = require('../middleware/auth')
const router = new express.Router()

// Create a learning group
router.post('/learninggroups', auth, async (req, res) => {
  try {
    const learningGroup = new LearningGroup({...req.body, creator: req.user._id})
    await learningGroup.save()
    res.status(201).send(learningGroup)
  } catch (e) {
    res.status(400).send()
  }
})

// Get a single learning group
router.get('/learninggroups/:id', auth, async (req, res) => {
  const _id = req.params.id

  try {
    const learningGroup = await LearningGroup.findById(_id)
    if (!learningGroup) {
      return res.status(404).send()
    }
    if (learningGroup.creator.equals(req.user._id) || learningGroup.admin.forEach((admin) => {
      if (admin.id.equals(req.user._id)) {
        return true
      }
    })) {
      res.send(learningGroup)
    }
  } catch (e) {
    res.status(500).send()
  }
})

// Get all user's learning groups
router.get('/learninggroups', auth, async (req, res) => {
  try {
    const createdGroups = await LearningGroup.find({creator: req.user._id})
    const adminGroups = await LearningGroup.find({'admin.id': req.user._id})
    const studentGroups = await LearningGroup.find({'students.id': req.user._id})
    if (!createdGroups && !adminGroups && !studentGroups) {
      res.status(404).send()
    }
    res.send({createdGroups, adminGroups, studentGroups})
  } catch (e) {
    res.status(500).send()
  }
})

// Edit learning group if one of the admins or creator
router.patch('/learninggroups/:id', auth, async (req, res) => {
  console.log('got request')
  const _id = req.params.id
  const allowedUpdates = ['title', 'description', 'questionSetsAssigned', 'admin', 'students']
  const attemptedUpdates = Object.keys(req.body)
  const isValidOperation = attemptedUpdates.every((update) => allowedUpdates.includes(update))
  if (!isValidOperation) {
    return res.status(400).send({error: 'Invalid updates'})
  }
  try {
    const learningGroup = await LearningGroup.findOne({_id})
    if (!learningGroup) {
      res.status(404).send()
    }
    let makeEdit = false
    learningGroup.admin.forEach((ad) => {
      if (ad.id.equals(req.user._id) && ad.hasJoined === true) {
        makeEdit = true
      }
    })
    if (!makeEdit) {
      if (learningGroup.creator.equals(req.user._id)) {
        makeEdit = true
      }
    }
    if (makeEdit) {
      attemptedUpdates.forEach((update) => learningGroup[update] = req.body[update])
      await learningGroup.save()
      res.send(learningGroup)
    }
    res.status(404).send()
  } catch (e) {
    res.status(400).send(e)
  }
})

router.delete('/learninggroups/:id', auth, async (req, res) => {
  try {
    const learningGroup = await LearningGroup.findOneAndDelete({_id: req.params.id, creator: req.user._id})
    if (!learningGroup) {
      res.status(404).send()
    }
    res.send(learningGroup)
  } catch (e) {
    res.status(500).send()
  }
})

module.exports = router