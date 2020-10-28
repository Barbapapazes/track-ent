const request = require('request')
const util = require('util')
const dayjs = require('dayjs')

const { dbs, services } = require('../database')

const post = util.promisify(request.post)

exports.tweet = function (Twitter, text) {
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

exports.sendResponse = async function (event, oauth) {
  // Only react to direct messages
  if (!event.direct_message_events) {
    return
  }

  const message = event.direct_message_events.shift()

  // Filter out empty messages or non-message events
  if (
    typeof message === 'undefined' ||
    typeof message.message_create === 'undefined'
  ) {
    return
  }

  // Filter out messages created by the the authenticating users (to avoid sending messages to oneself)
  if (
    message.message_create.sender_id ===
    message.message_create.target.recipient_id
  ) {
    return
  }

  const oAuthConfig = {
    token: oauth.oauth_token,
    token_secret: oauth.oauth_token_secret,
    consumer_key: oauth.consumer_key,
    consumer_secret: oauth.consumer_secret,
  }

  await markAsRead(
    message.message_create.id,
    message.message_create.sender_id,
    oAuthConfig
  )
  await indicateTyping(message.message_create.sender_id, oAuthConfig)

  const senderScreenName =
    event.users[message.message_create.sender_id].screen_name

  let text = ''
  if (!message.message_create.message_data.text.startsWith('!')) {
    text += `Bonjour @${senderScreenName} 👋 !\n\nJe ne comprends pas grand choses pour le moment 😑 mais en utilisant !help, tu sauras comment te faire comprendre ! 😄`
    await sendDM(message, text, oAuthConfig)
  } else {
    const messageText = message.message_create.message_data.text.slice(1)
    const args = messageText.split(' ')
    if (args[0] === 'help') {
      text +=
        "Besoin d'aide ? Laisse moi tout t'expliquer !😏\n\n!help => obtenir de l'aide\n!statut <service> => obtenir l'état d'un service (cas|celene|ent)"
      await sendDM(message, text, oAuthConfig)
    } else if (args[0] === 'statut' && services.includes(args[1])) {
      dbs[args[1]]
        .find({})
        .sort({ date: -1 })
        .limit(1)
        .exec((err, docs) => {
          const doc = docs[0]
          if (err) {
            text +=
              "\n\nOups, il semble que mon concepteur m'ait mal conçu ! 🙄"
          } else if (doc.status === 200) {
            const date = dayjs(doc.date)
            text += `\n\n${args[1].toUpperCase()} était opérationnel ${date.format(
              'à H:mm le DD/MM/YYYY'
            )} ! 🚀`
          } else {
            const date = dayjs(doc.date)
            text += `\n\n${args[1].toUpperCase()} était cassé ${date.format(
              'à H:mm le DD/MM/YYYY'
            )} ! 🐛\n\nStatut: ${doc.status} 👀`
          }
          sendDM(message, text, oAuthConfig)
        })
    } else {
      text += '\n\nJe suis navré mais je ne vous comprends pas ! 😫'
      await sendDM(message, text, oAuthConfig)
    }
  }
}

async function sendDM(messageReceived, textToSent, oAuth) {
  const requestConfig = {
    url: 'https://api.twitter.com/1.1/direct_messages/events/new.json',
    oauth: oAuth,
    json: {
      event: {
        type: 'message_create',
        message_create: {
          target: {
            recipient_id: messageReceived.message_create.sender_id,
          },
          message_data: {
            text: textToSent,
          },
        },
      },
    },
  }
  await post(requestConfig)
}

async function markAsRead(messageId, senderId, auth) {
  const requestConfig = {
    url: 'https://api.twitter.com/1.1/direct_messages/mark_read.json',
    form: {
      last_read_event_id: messageId,
      recipient_id: senderId,
    },
    oauth: auth,
  }

  await post(requestConfig)
}

async function indicateTyping(senderId, auth) {
  const requestConfig = {
    url: 'https://api.twitter.com/1.1/direct_messages/indicate_typing.json',
    form: {
      recipient_id: senderId,
    },
    oauth: auth,
  }

  await post(requestConfig)
}
