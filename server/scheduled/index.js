const fetch = require('node-fetch')
const dayjs = require('dayjs')
const { createText, calculationUpTimes } = require('../utils/index')
const { Twitter } = require('../bot')
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
                tweet(Twitter, createText(service, doc.status))
              } else if (doc.status !== lastStatus[service]) {
                lastStatus[service] = doc.status
                tweet(Twitter, createText(service, doc.status))
              }
            }
          }
        )
      })
      .catch((err) => console.log(err))
  }
}

exports.sumUp = function (time) {
  return function () {
    calculationUpTimes(time, function (err, results) {
      if (err) {
        console.error(err)
      }
      const startDate = dayjs().subtract(time, 'day').format('DD/MM/YYYY')
      const endDate = dayjs().format('DD/MM/YYYY')
      let text = `Uptime du ${startDate} au ${endDate} 📊 \n\n`
      services.forEach((service) => {
        const all = results[service].length
        const up = results[service].filter((result) => result.status === 200)
          .length
        text += `  - ${service.toUpperCase()}: ${Math.round(
          (up * 100) / all
        )} % \n`
      })
      tweet(Twitter, text)
    })
  }
}

exports.cron =
  process.env.NODE_ENV === 'production' ? '*/5 * * * *' : '*/10 * * * * *'

exports.cronWeek =
  process.env.NODE_ENV === 'production' ? '* 10 * * 6' : '*/20 * * * * *'

exports.cronMonth =
  process.env.NODE_ENV === 'production' ? '* 10 1 * *' : '*/30 * * * * *'
