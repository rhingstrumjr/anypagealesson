const express = require('express')
require('./db/mongoose')
const questionRouter = require('./routers/question')
const userRouter = require('./routers/user')
const questionSetRouter = require('./routers/questionSets')
const learningGroupsRouter = require('./routers/learningGroups')

const isMaintanence = false

const app = express()
const port = process.env.PORT || 3000

app.use((req, res, next) => {
  if (isMaintanence) {
    res.status(503).send('Site is being updated.  Come back soon.')
  } else {
    next()
  }
})

app.use(express.json())
// Set up routes to use
app.use([userRouter, questionRouter, questionSetRouter, learningGroupsRouter])

app.listen(port, () => {
  console.log('Server is up on port', port)
})