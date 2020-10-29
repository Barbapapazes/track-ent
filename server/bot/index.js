const Twit = require('twit')
const { Autohook } = require('twitter-autohook')

const { sendResponse } = require('./utils')
const { dbs, services } = require('../database')

const Twitter = new Twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
})

/**
 * Start the webhook to open the response of the bot
 */
if (process.env.BOT_DM === 'start') {
  ;(async () => {
    try {
      const webhook = new Autohook({
        consumer_key: process.env.CONSUMER_KEY,
        consumer_secret: process.env.CONSUMER_SECRET,
        token: process.env.ACCESS_TOKEN,
        token_secret: process.env.ACCESS_TOKEN_SECRET,
        env: 'dev',
        port: 1337,
      })

      // Removes existing webhooks
      await webhook.removeWebhooks()

      // Starts a server and adds a new webhook
      await webhook.start()

      webhook.on('event', async (event) => {
        sendResponse(event, {
          oauth_token: process.env.ACCESS_TOKEN,
          oauth_token_secret: process.env.ACCESS_TOKEN_SECRET,
          consumer_key: process.env.CONSUMER_KEY,
          consumer_secret: process.env.CONSUMER_SECRET,
          reset: true,
        })
      })

      // Subscribes to your own user's activity
      await webhook.subscribe({
        oauth_token: process.env.ACCESS_TOKEN,
        oauth_token_secret: process.env.ACCESS_TOKEN_SECRET,
      })
    } catch (e) {
      // Display the error and quit
      console.error(e)
      process.exit(1)
    }
  })()
}

exports.Twitter = Twitter
