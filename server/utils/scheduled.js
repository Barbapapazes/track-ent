const fetch = require('node-fetch')
const dayjs = require('dayjs')
const { createText, calculationUpTime } = require('./index')
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

exports.sumUpWeek = function (service) {
  return function () {
    calculationUpTime(service, function (upTime, service) {
      const startDate = dayjs().subtract(7, 'day').format('DD/MM/YYYY')
      const endDate = dayjs().format('DD/MM/YYYY')
      tweet(
        `Le up-time de ${service.toUpperCase()} est de ${upTime}% cette dernière semaine, du ${startDate} au ${endDate} ! 📊`
      )
    })
  }
}

exports.cron =
  process.env.NODE_ENV === 'production' ? '*/5 * * * *' : '*/10 * * * * *'

exports.cronWeek =
  process.env.NODE_ENV === 'production' ? '* 10 * * * 0' : '*/5 * * * * *'
