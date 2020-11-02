const path = require('path')
const envFilename = process.env.NODE_ENV === 'production' ? '.env' : '.env.dev'

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

const schedule = require('node-schedule')

const {
  checkService,
  sumUp,
  cron,
  cronWeek,
  cronMonth,
  services,
} = require('./utils')

// Start all scheduled jobs
services.forEach((service) => {
  schedule.scheduleJob(cron, checkService(service))
})
schedule.scheduleJob(cronWeek, sumUp('week'))
schedule.scheduleJob(cronMonth, sumUp('month'))
