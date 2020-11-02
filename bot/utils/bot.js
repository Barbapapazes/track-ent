const Twit = require('twit')

const Twitter = new Twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
})

/**
 * Function to create a tweet
 * @param {twit} Twitter API to help
 * @param {string} text to tweet
 */
function tweet(text) {
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

exports.tweet = tweet
