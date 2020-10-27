let Twitter = undefined
if (process.env.NODE_ENV === 'production') Twitter = require('../bot')

exports.tweet = function (text) {
  if (process.env.NODE_ENV === 'production') {
    Twitter.post('statuses/update', { status: text }, function (err) {
      if (err) {
        console.error(err)
        return
      }
    })
  } else {
    console.debug(text)
  }
}
