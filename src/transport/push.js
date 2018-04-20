// TODO move elsewhere/generalize, just here as helper for push right now.

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

  // TODO uri vs payload? and how to handle both to them, once again where is the right place for something like message, in config or inner func???
const transport = (token, pubEncKey) => {
  return (uri, {message}) => {
    return new Promise((resolve, reject) => {
      let endpoint = '/api/v2/sns'
      if (!token) return reject(new Error('Missing push notification token'))
      if (!pubEncKey) return reject(new Error('Missing public encryption key of the receiver'))
      if (pubEncKey.url) {
        console.error('WARNING: Calling push without a public encryption key is deprecated')
        endpoint = '/api/v1/sns'
        payload = pubEncKey
      } else {
        if (!uri) return reject(new Error('Missing payload url for sending to users device'))
        const plaintext = padMessage(JSON.stringify(payload))
        const enc = encryptMessage(plaintext, pubEncKey)
        payload = { message: JSON.stringify(enc) }
      }

      nets({
        uri: PUTUTU_URL + endpoint,
        json: payload,
        method: 'POST',
        withCredentials: false,
        headers: {
          Authorization: `Bearer ${token}`
        }
      },
      (error, res, body) => {
        if (error) return reject(error)
        if (res.statusCode === 200) {
          resolve(body)
        }
        if (res.statusCode === 403) {
          return reject(new Error('Error sending push notification to user: Invalid Token'))
        }
        reject(new Error(`Error sending push notification to user: ${res.statusCode} ${body.toString()}`))
      })
    })
  }
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

export { transport }
