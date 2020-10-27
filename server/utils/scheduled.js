const fetch = require('node-fetch')
const { createText } = require('./index')
const { tweet } = require('../bot/utils')
const { dbs, services } = require('../database')

const lastStatus = {}

// To know if we have to create a new tweet
services.forEach((service) => {
  lastStatus[service] = undefined
})

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
                tweet(createText(service, doc.status))
              } else if (doc.status !== lastStatus[service]) {
                lastStatus[service] = doc.status
                tweet(createText(service, doc.status))
              }
            }
          }
        )
      })
      .catch((err) => console.log(err))
  }
}

exports.cron =
  process.env.NODE_ENV === 'production' ? '*/5 * * * *' : '*/10 * * * * *'
