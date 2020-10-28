const path = require('path')
const Datastore = require('nedb')

const pathdb =
  process.env.NODE_ENV === 'production' ? path.join('/', 'data') : 'data'

const services = ['ent', 'cas', 'celene']
const dbs = {}

services.forEach((service) => {
  dbs[service] = new Datastore({
    filename: path.join(pathdb, `${service}-status.db`),
  })
  dbs[service].loadDatabase((err) => console.error(err))
})

exports.services = services
exports.dbs = dbs