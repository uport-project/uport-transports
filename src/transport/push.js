import { encryptMessage } from '../crypto.js'
import { paramsToQueryString } from './../message/util.js'
import nets from 'nets'
const PUTUTU_URL = 'https://api.uport.me/pututu/sns'

/**
  *  A push notification transport for pushing requests to the uPort mobile client of a specific user
  *  for which you have been given a valid push token.
  *
  *  @param    {String}      token              a push notification token (get a pn token by requesting push permissions in a request)
  *  @param    {String}      pubEncKey          the public encryption key of the receiver, encoded as a base64 string, found in a DID document
  *  @param    {String}      [pushServiceUrl=PUTUTU_URL] the url of the push service, by default it is PUTUTU at https://api.uport.me/pututu/sns/
  *  @return   {Function}                       a configured Push transport function
  *  @param    {String}      url                a uport client request url
  *  @param    {Object}      [opts={}]          an optional config object
  *  @param    {String}      opts.message       a message to display to the user
  *  @param    {String}      opts.type          specifies callback type 'post' or 'redirect' for response
  *  @param    {String}      opts.callback      specifies url which a uport client will return to control once the request is handled, depending on request type it may or may not be returned with the response as well.
  *  @return   {Promise<Object, Error>}         a promise which resolves with successful push notification status or rejects with an error
  */
const send = (token, pubEncKey, pushServiceUrl = PUTUTU_URL) => {
  if (!token) throw new Error('Requires push notification token')
  if (!pubEncKey) throw new Error('Requires public encryption key of the receiver')

  return (url, {message, type, redirectUrl}={}) => new Promise((resolve, reject) => {
    if (!url) return reject(new Error('Requires url request for sending to users device'))
    if (type) url = paramsToQueryString(url, {callback_type: type})
    if (redirectUrl) url = paramsToQueryString(url, {'redirect_url': redirectUrl})
    const reqObj = {url}
    if (message) reqObj.message = message
    const plaintext = padMessage(JSON.stringify(reqObj))
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
