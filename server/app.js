const path = require('path')
const envFilename = process.env.NODE_ENV === 'production' ? '.env' : '.env.dev'
require('dotenv').config({ path: path.resolve(process.cwd(), envFilename) })
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

const createError = require('http-errors')
const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const schedule = require('node-schedule')

const indexRouter = require('./routes/index')
const apiRouter = require('./routes/api')
const { Twitter, startBot } = require('./bot')
const scheduled = require('./scheduled')
const { services, dbs } = require('./database')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

// Start all scheduled jobs
services.forEach((service) => {
  schedule.scheduleJob(scheduled.cron, scheduled.checkService(service))
})
schedule.scheduleJob(scheduled.cronWeek, scheduled.sumUp(7))
schedule.scheduleJob(scheduled.cronMonth, scheduled.sumUp(30))

// Start the bot
if (process.env.BOT_DM === 'start') {
  startBot(services, dbs)
}

app.use('/', indexRouter)
app.use('/api', apiRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
