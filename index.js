process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

const Datastore = require('nedb')
const schedule = require('node-schedule')
const fetch = require('node-fetch')

db = new Datastore({ filename: 'status.db' })
db.loadDatabase((err) => console.error(err))

function checkEnt() {
  fetch('https://ent.insa-cvl.fr/')
    .then((res) => {
      if (res.status !== 200) {
        db.insert({ status: res.status, date: new Date() }, (err) => {
          if (err) {
            console.error(err)
          }
        })
      }
    })
    .catch((err) => console.log(err))
}

schedule.scheduleJob('*/5 * * * *', checkEnt)
