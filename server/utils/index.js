const dayjs = require('dayjs')
const { dbs, services } = require('../database')

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

exports.calculationUpTime = function (service, cb) {
  const date = dayjs().subtract(7, 'day')
  dbs[service].find({ date: { $gte: date } }, function (err, docs) {
    if (err) {
      console.error(err)
    } else {
      const up = docs.filter((obj) => obj.status === 200)
      const upTime = (up.length * 100) / docs.length
      cb(upTime, service)
    }
  })
}
