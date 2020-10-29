const dayjs = require('dayjs')
const async = require('async')
const { Twitter } = require('../bot')
const { tweet } = require('../bot/utils')
const { dbs, services } = require('../database')

/**
 *
 * @param {string} service
 * @param {number} status
 */
exports.createText = function (service, status, date) {
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
 * Find data in a service using date and send it to the callback
 * @param {string} service
 * @param {date} date
 * @param {function} callback
 */
function findInDatastore(service, date, callback) {
  dbs[service].find({ date: { $gte: date } }, function (err, docs) {
    if (err) {
      callback(err, null)
    } else {
      callback(null, docs)
    }
  })
}

/**
 * Find data in all services
 * @param {number} time
 * @param {function} cb
 */
exports.findAllDatastores = function (time, cb) {
  const date = dayjs().subtract(time, 'day')
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
 * @param {number} time
 * @returns {function}
 */
exports.calculationUpTimes = function (time) {
  return function (err, results) {
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
  }
}
