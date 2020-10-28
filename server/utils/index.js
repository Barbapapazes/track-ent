const dayjs = require('dayjs')
const async = require('async')
const { dbs } = require('../database')

exports.createText = function (service, status) {
  let text = ''
  const date = new Date()
  if (status === 200) {
    text = `${service.toUpperCase()} est fonctionnelle ! 🚀`
  } else {
    text = `${service.toUpperCase()} a un problème ! 🐛`
  }
  text += `\n\nStatut ${status} à ${date.toLocaleString('fr-FR', {
    timeZone: 'UTC',
  })}`
  return text
}

function findInDatastore(service, date, callback) {
  dbs[service].find({ date: { $gte: date } }, function (err, docs) {
    if (err) {
      callback(err, null)
    } else {
      callback(null, docs)
    }
  })
}

exports.calculationUpTimes = function (time, cb) {
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
