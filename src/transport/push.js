import nets from 'nets'

/**
 * @module push
 * Endpoint transport between a javascript running client (server or browser) 
 * and a push-receiving client (mobile).  The endpoint of the configured push service
 * will be the 
 */

// uPort hosted push microservice
const PUTUTU_URL = 'https://api.uport.me/pututu/sns'

/**
 * Create a function to send 
 *
 * @param    {Object}     opts
 * @param    {String}     opts.token              a push notification token (get a pn token by requesting push permissions in a request)
 * @param    {String}     opts.pubEncKey          the public encryption key of the receiver, encoded as a base64 string, found in a DID document
 * @param    {String}     [opts.pushServiceUrl]   the url of the push service, by default it is PUTUTU at https://api.uport.me/pututu/sns/
 * @returns  {Function}   a configured Push transport endpoint function
 */
export function createPushSender({token, pubEncKey, pushServiceUrl = PUTUTU_URL}) {
  if (!token) throw new Error('Requires push notification token')
  if (!pubEncKey) throw new Error('Requires public encryption key of the receiver')

  return message => new Promise((resolve, reject) => {
    if (!message) return reject(new Error('Requires message request to send'))

    nets({
      uri: pushServiceUrl,
      json: { message },
      method: 'POST',
      withCredentials: false,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }, (error, res, body) => {
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
 * Legacy Push Path:
 * message => {message}
 * {message} => pad(stringify({message}))
 * plaintext => encrypt(plaintext)
 * encrypted => {message: encrypted}
 */

/**
 * The same transport as above, but also display a self-dismissing modal notifying
 * the user that push notification has been sent to their device
 * @see send
 */
// const sendAndNotify = (token, pubEncKey, pushServiceUrl = PUTUTU_URL) => {
//   const FALLBACK_MESSAGE = 'Scan QR Code Instead:'
//   const sendPush = send(token, pubEncKey, pushServiceUrl)
//   return (message, params) => {
//     notifyPushSent(() => sendQR(FALLBACK_MESSAGE)(message))
//     return sendPush(message, params)
//   }
// }

/**
 *  @private
 *  Adds padding to a string
 *
 *  @param      {String}   message    the message to be padded
 *  @return     {String}              the padded message
 */
const padMessage = message => {
  const INTERVAL_LENGTH = 50
  const padLength = INTERVAL_LENGTH - (message.length % INTERVAL_LENGTH)
  return message + ' '.repeat(padLength)
}
