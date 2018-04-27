import { encryptMessage } from './../crypto/index.js'
import nets from 'nets'
const PUTUTU_URL = 'https://api.uport.me/pututu/sns/'

// TODO still add redirect opt and type
/**
  *  Send a push notification to a user, consumes a token which allows you to send push notifications
  *  and a url/uri request you want to send to the user.
  *
  *  @param    {String}                  token              a push notification token (get a pn token by requesting push permissions in a request)
  *  @param    {Object}                  payload            push notification payload
  *  @param    {String}                  payload.url        a uport request url
  *  @param    {String}                  payload.message    a message to display to the user
  *  @param    {String}                  pubEncKey          the public encryption key of the receiver, encoded as a base64 string
  *  @return   {Promise<Object, Error>}              a promise which resolves with successful status or rejects with an error
  */
const send = (token, pubEncKey, pushServiceUrl = PUTUTU_URL) => {
  if (!token) throw new Error('Requires push notification token')
  if (!pubEncKey) throw new Error('Requires public encryption key of the receiver')

  return (uri, {message}={}) => new Promise((resolve, reject) => {
    if (!uri) return reject(new Error('Requires uri request for sending to users device'))
    const plaintext = padMessage(JSON.stringify({uri, message}))
    const enc = encryptMessage(plaintext, pubEncKey)
    const payload = { message: JSON.stringify(enc) }
    nets({
      uri:  pushServiceUrl,
      json: payload,
      method: 'POST',
      withCredentials: false,
      headers: {
        Authorization: `Bearer ${token}`
      }
    },
    (error, res, body) => {
      if (error) return reject(error)
      if (res.statusCode === 200) return resolve(body)
      if (res.statusCode === 403) {
        return reject(new Error('Error sending push notification to user: Invalid Token'))
      }
      reject(new Error(`Error sending push notification to user: ${res.statusCode} ${body.toString()}`))
    })
  })
}

/**
 *  Adds padding to a string
 *
 *  @param      {String}        the message to be padded
 *  @return     {String}        the padded message
 *  @private
 */
const padMessage = (message) => {
  const INTERVAL_LENGTH = 50
  const padLength = INTERVAL_LENGTH - message.length % INTERVAL_LENGTH
  return message + ' '.repeat(padLength)
}

export { send }
