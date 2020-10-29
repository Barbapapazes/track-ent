const fetch = require('node-fetch')
const dayjs = require('dayjs')
const {
  createText,
  calculationUpTimes,
  findAllDatastores,
} = require('../utils/index')
const { Twitter } = require('../bot')
const { tweet } = require('../bot/utils')
const { dbs, services } = require('../database')

const lastStatus = {}

// To know if we have to create a new tweet
services.forEach((service) => {
  lastStatus[service] = undefined
})

/**
 * Ping the service, insert the result in the db and tweet it if the status have change
 * @param {string} service
 */
exports.checkService = function (service) {
  return function () {
    fetch(process.env[`${service.toUpperCase()}_URL`])
      .then((res) => {
        dbs[service].insert(
          { status: res.status, date: new Date() },
          (err, doc) => {
            if (err) {
              console.error(err)
            } else {
              if (!lastStatus[service]) {
                lastStatus[service] = doc.status
                tweet(Twitter, createText(service, doc.status, doc.date))
              } else if (doc.status !== lastStatus[service]) {
                lastStatus[service] = doc.status
                tweet(Twitter, createText(service, doc.status, doc.date))
              }
            }
          }
        )
      })
      .catch((err) => console.log(err))
  }
}

/**
 * Get the uptime of a service between now and `time` ago
 * @param {number} time
 */
exports.sumUp = function (time) {
  return function () {
    findAllDatastores(time, calculationUpTimes(time))
  }
}

exports.cron =
  process.env.NODE_ENV === 'production' ? '*/5 * * * *' : '*/10 * * * * *'

exports.cronWeek =
  process.env.NODE_ENV === 'production' ? '* 10 * * 6' : '*/20 * * * * *'

exports.cronMonth =
  process.env.NODE_ENV === 'production' ? '* 10 1 * *' : '*/30 * * * * *'
