const express = require('express')
const router = express.Router()

router.get('/status', (req, res) => {
  db.find({}, (err, data) => {
    if (err) {
      next(err)
    } else {
      res.json(data)
    }
  })
})

module.exports = router
