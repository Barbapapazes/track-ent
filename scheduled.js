const fetch = require('node-fetch')

exports.checkEnt = function () {
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
