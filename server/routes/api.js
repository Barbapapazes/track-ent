const express = require('express')
const router = express.Router()

const { services, dbs } = require('../database')

router.get('/:service', (req, res) => {
  const { service } = req.params

  if (!services.includes(service)) {
    throw new Error('Service not found')
  }

  dbs[service]
    .find({})
    .sort({ date: 1 })
    .exec((err, data) => {
      if (err) {
        next(err)
      } else {
        res.json(data)
      }
    })
})

module.exports = router
