const express = require('express')
const { NotExtended } = require('http-errors')
const router = express.Router()
const { tweet } = require('../utils/bot')

/* Post a tweet */
router.post('/', function (req, res, next) {
  try {
    tweet(req.body.text)
    res.status(200).json({ status: 200, response: 'tweet is posted' })
  } catch (err) {
    console.error(err)
    next(err)
  }
})

module.exports = router
