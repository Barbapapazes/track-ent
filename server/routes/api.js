const dayjs = require('dayjs')
const express = require('express')
const router = express.Router()

const { services, dbs } = require('../database')

/* GET all status of a service */
router.get('/:service', (req, res) => {
  const { service } = req.params
  const { date } = req.query

  if (!services.includes(service)) {
    throw new Error('Service not found')
  }

  let query = {}
  if (date) {
    query = { date: { $gte: dayjs(date) } }
  }

  dbs[service]
    .find(query)
    .sort({ date: 1 })
    .exec((err, data) => {
      if (err) {
        next(err)
      } else {
        res.json(data)
      }
    })
})

/* POST a status from a service*/
router.post('/:service', (req, res, next) => {
  const { service } = req.params
  const { status } = req.body

  if (!service.includes(service)) {
    throw new Error('Service not found')
  }

  dbs[service].insert({ status, date: new Date() }, (err, doc) => {
    if (err) {
      console.error(err)
      next(err)
    }
    res.status(201).json(doc)
  })
})

module.exports = router
