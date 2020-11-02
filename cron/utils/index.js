const fetch = require('node-fetch')
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
dayjs.extend(utc)
const async = require('async')

const services = ['ent', 'celene', 'cas']

exports.services = services

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
        fetch(`${process.env.API_URL}/api/${service}`, {
          method: 'post',
          body: JSON.stringify({ status: res.status }),
          headers: { 'Content-Type': 'application/json' },
        })
          .then((res) => res.json())
          .then((doc) => {
            if (!lastStatus[service]) {
              lastStatus[service] = doc.status
              // tweet(Twitter, createText(service, doc.status, doc.date))
            } else if (doc.status !== lastStatus[service]) {
              lastStatus[service] = doc.status
              tweet(createText(service, doc.status, doc.date))
            }
          })
          .catch((err) => console.error(err))
      })
      .catch((err) => console.log(err))
  }
}

function tweet(text) {
  fetch(`${process.env.BOT_URL}/bot`, {
    method: 'post',
    body: JSON.stringify({ text }),
    headers: { 'Content-Type': 'application/json' },
  }).catch((err) => console.error(err))
}

/**
 *
 * @param {string} service
 * @param {number} status
 */
function createText(service, status, date) {
  let text = ''
  if (status === 200) {
    text = `${service.toUpperCase()} est fonctionnelle ! 🚀`
  } else {
    text = `${service.toUpperCase()} a un problème ! 🐛`
  }
  text += `\n\nStatut ${status} ${dayjs(date).format('à H:mm le DD/MM/YYYY')}`
  return text
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

/**
 * Find data in a service using date and send it to the callback
 * @param {string} service
 * @param {date} date
 * @param {function} callback
 */
function findInDatastore(service, date, callback) {
  fetch(`${process.env.API_URL}/api/${service}?date=${date}`)
    .then((res) => res.json())
    .then((docs) => callback(null, docs))
    .catch((err) => callback(err, null))
}

/**
 * Find data in all services
 * @param {number} time
 * @param {function} cb
 */
function findAllDatastores(time, cb) {
  // work with utc date in bdd and then keep the start time
  const date = dayjs().utc().startOf(time).format()
  async.parallel(
    {
      ent: (callback) => findInDatastore('ent', date, callback),
      celene: (callback) => findInDatastore('celene', date, callback),
      cas: (callback) => findInDatastore('cas', date, callback),
    },
    cb
  )
}

/**
 *  Calcul the uptime from all services
 * @param {string} time
 * @returns {function}
 */
function calculationUpTimes(time) {
  return function (err, results) {
    if (err) {
      console.error(err)
    }
    const startDate = dayjs().startOf(time).format('DD/MM/YYYY')
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
    tweet(text)
  }
}

exports.cron =
  process.env.NODE_ENV === 'production' ? '*/5 * * * *' : '*/10 * * * * *'

exports.cronWeek =
  process.env.NODE_ENV === 'production' ? '59 23 * * 0' : '*/20 * * * * *'

exports.cronMonth =
  process.env.NODE_ENV === 'production' ? '59 23 31 * *' : '*/30 * * * * *'
