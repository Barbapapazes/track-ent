const Twitter = require('../bot')

exports.tweet = function (text) {
  Twitter.post('statuses/update', { status: text }, function (err) {
    if (err) {
      console.error(err)
      return
    }
  })
}
