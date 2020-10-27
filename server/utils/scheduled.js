const { tweet } = require('../bot/utils')
const fetch = require('node-fetch')

let lastStatus = undefined

exports.checkEnt = function () {
  fetch(process.env.URL_FETCH)
    .then((res) => {
      db.insert({ status: res.status, date: new Date() }, (err, doc) => {
        if (err) {
          console.error(err)
        } else {
          if (!lastStatus) {
            lastStatus = doc.status
            tweet(createText(doc.status))
          } else if (doc.status !== lastStatus) {
            lastStatus = doc.status
            tweet(createText(doc.status))
          }
        }
      })
    })
    .catch((err) => console.log(err))
}

function createText(status) {
  let text = ''
  const date = new Date()
  if (status === 200) {
    text = `L'ENT est fonctionnelle ! 🚀`
  } else {
    text = `L'ENT a un problème ! 🐛`
  }
  text += `\n\nStatut ${status} à ${date.toLocaleString('fr-FR', {
    timeZone: 'UTC',
  })}`
  return text
}

exports.cron =
  process.env.NODE_ENV === 'production' ? '*/5 * * * *' : '*/10 * * * * *'
