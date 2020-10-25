require('dotenv').config()
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const Datastore = require('nedb')
const schedule = require('node-schedule')
const fetch = require('node-fetch')

db = new Datastore({ filename: 'status.db' })
db.loadDatabase((err) => console.error(err))

const scheduled = require('./scheduled')

schedule.scheduleJob('*/5 * * * *', scheduled.checkEnt)

const middlewares = require('./middlewares')

const app = express()

app.set('views', './templates')
app.set('view engine', 'pug')

app.use(morgan('dev'))
app.use(helmet())
// app.use(cors())
app.use(express.json())

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/data', (req, res) => {
  db.find({}, (err, data) => {
    if (err) {
      next(err)
    } else {
      res.json(data)
    }
  })
})

app.use(middlewares.notFound)
app.use(middlewares.errorHandler)

module.exports = app

db = new Datastore({ filename: 'status.db' })
db.loadDatabase((err) => console.error(err))

function checkEnt() {
  fetch('https://ent.insa-cvl.fr/')
    .then((res) => {
      db.insert({ status: res.status, date: new Date() }, (err) => {
        if (err) {
          console.error(err)
        }
      })
    })
    .catch((err) => console.log(err))
}

schedule.scheduleJob('*/5 * * * *', checkEnt)
