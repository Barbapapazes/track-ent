const path = require('path')
const Datastore = require('nedb')

const pathdb =
  process.env.NODE_ENV === 'production' ? path.join('/', 'data') : 'data'

const services = ['ent', 'cas', 'celene']

const dbs = {}

/**
 * Create and start each database
 */
services.forEach((service) => {
  dbs[service] = new Datastore({
    filename: path.join(pathdb, `${service}-status.db`),
  })
  dbs[service].loadDatabase((err) => {
    if (err) {
      console.error(err)
      return
    } else {
      console.log('Start ' + service + ' database')
    }
  })
})

exports.services = services
exports.dbs = dbs
