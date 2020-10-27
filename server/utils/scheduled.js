const fetch = require('node-fetch')

exports.checkEnt = function () {
  fetch(process.env.URL_FETCH)
    .then((res) => {
      db.insert({ status: res.status, date: new Date() }, (err) => {
        if (err) {
          console.error(err)
        }
      })
    })
    .catch((err) => console.log(err))
}
