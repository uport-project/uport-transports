import nets from 'nets'
import MobileDetect from 'mobile-detect'
import qs from 'qs'
import { openQr, closeQr } from './QR.js'
import { paramsToQueryString, paramsToUrlFragment } from './Message.js'
import nacl from 'tweetnacl'
import naclutil from 'tweetnacl-util'
const CHASQUI_URL = 'https://chasqui.uport.me/api/v1/topic/'
const PUTUTU_URL = 'https://pututu.uport.space' // TODO - change to .me
const POLLING_INTERVAL = 2000


// TODO for understanding maybe change uri to request?? or requestURI
//  if change URI also change to requestHandler

// TODO maybe don't use mobile reference for naming functions below. maybe too specific, as the same transports could be used in non mobile
//  use cases if a uport client is not a mobile app, ie desktop app for example or browser extension.

/**
  *  A general Chasqui Transport. Allows you to configure the transport with any uriHandler for the request,
  *  while the response will always be returned through Chasqui. Chasqui is a simple messaging server that
  *  allows responses to be relayed from a uport client to the original callee.
  *
  *  @param    {Object}       [config={}]      an optional config object
  *  @param    {String}       uriHandler       a function called with the requestURI once it is formatted for this transport
  *  @param    {String}       chasquiUrl       url of messaging server, defaults to Chasqui instance run by uPort
  *  @param    {String}       pollingInterval  milisecond interval at which the messaging server will be polled for a response
  *  @return   {Function}                      a configured QRTransport Function
  *  @param    {String}       uri              a uport client request URI
  *  @return   {Promise<Object, Error>}        a function to close the QR modal
  */
const URIHandlerChasquiTransport = ({uriHandler = openQr, chasquiUrl = CHASQUI_URL, pollingInterval = POLLING_INTERVAL} = {}) => {
  return (uri) => {
    let isCancelled = false
    const cancel = () => { isCancelled = true }
    const cb = chasquiUrl + randomString(16)
    uri = paramsToQueryString(uri, {'callback_url': cb, 'type': 'post'})
    uriHandler(uri, cancel)
    const returnVal = pollChasqui(cb, pollingInterval, () => isCancelled)
    returnVal.cancel = cancel
    return returnVal
  }
}

/**
  *  A QR Code and Chasqui Transport. The QR modal is configured for tranporting the request, while the
  *  response will be returned through Chasqui.
  *
  *  @param    {Object}       [config={}]      an optional config object
  *  @param    {String}       chasquiUrl       url of messaging server, defaults to Chasqui instance run by uPort
  *  @param    {String}       pollingInterval  milisecond interval at which the messaging server will be polled for a response
  *  @return   {Function}                      a configured QRTransport Function
  *  @param    {String}       uri              a uport client request URI
  *  @return   {Promise<Object, Error>}        a function to close the QR modal
  */
const QRChasquiTransport = ({chasquiUrl = CHASQUI_URL, pollingInterval = POLLING_INTERVAL} = {}) => {
  const transport = URIHandlerChasquiTransport({ chasquiUrl, pollingInterval})
  return (uri) => {
    return transport(uri).then(res => {
      closeQr()
      return res
    })
  }
}

// TODO use this func above, maybe offer some configs
/**
  *  A QR tranpsort which uses our provide QR modal to relay a request to a uport client
  *
  *  @return   {Function}             a configured QRTransport Function
  *  @param    {String}       uri     a uport client request URI
  *  @return   {Function}             a function to close the QR modal
  */
const QRTransport = () => (uri) => {
  openQr(paramsToQueryString(uri, {'type': 'post'}))
  return closeQr
}

// TODO Could have separate func for signed payloads (below)
// TODO id and data or one field here with two in connect
// TODO callback_url and redirect or just one
// TODO details docs or give reference to specs
/**
  *  A mobile transport for handling and configuring requests which are sent from a mobile browser to a uport client, in this case the uPort mobile app.
  *
  *  @param    {Object}       [config={}]    an optional config object
  *  @param    {String}       uriHandler     a function called with the requestURI once it is formatted for this transport, default opens URI
  *  @return   {Function}                    a configured MobileTransport Function
  *  @param    {String}       uri            a uport client request URI
  *  @param    {Object}       [opts={}]      an optional config object
  *  @param    {String}       opts.id        an id string for a request, used to identify response once returned
  *  @param    {String}       opts.data      additional data specific to your application that you can later receive with the response
  *  @param    {String}       opts.type      specifies callback type 'post' or 'redirect' for response
  *  @param    {String}       opts.callback  specifies url which a uport client will return to control once request is handled, depending on request type it may or may not be returned with the response as well.
  */
const MobileTransport = ({uriHandler}={}) => {
  // TODO args below or above? extra details above
  return (uri, {id, data, type, callback}) => {
  // what if has no protocol in passed in string
  // if( md.userAgent() === 'Chrome' && md.os() === 'iOS' ) {
  //    url = 'googlechrome:' + window.location.href.substring(window.location.protocol.length)
  //  } else {
  //    url = window.location.href
  //  }
    if (type) uri = paramsToQueryString(uri, {type})
    // Maybe move this logic (line) up a level to connect?
    let cb = /access_token/.test(uri) ? callback || null : callback || window.location.href
    if (cb) {
      if (data) cb = paramsToUrlFragment(cb, {data})
      if (id) cb = paramsToUrlFragment(cb, {id})
      uri = paramsToQueryString(uri, {'callback_url': cb})
    }
    uriHandler ? uriHandler(uri) : window.location.assign(uri)
  }
}

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
const pushNotificationTransport = (token, pubEncKey) => {
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
  *  A function to fetch a response from hash params appended to callback url, if available when function called.
  *
  *  @return   {Object}   A response object if repsonse is available, otherwise null.
  */
const getMobileResponse = () => {
  if (!!window.location.hash) { // TODO remove redundant
    const params = qs.parse(window.location.hash.slice(1))
    window.location.hash = ''
    if (params.error) return {error: params.error}
    return {res: params['access_token'], data: params['data'],  id: params['id']}
  }
  return null
}

// TODO should there be a way to cancel
/**
  *  A listener which calls given callback when a response becomes avaialble in the hash params (url fragment)
  *
  *  @param    {Function}     cb     a callback function called as cb(err, res) when a response becomes available
  */
const listenMobileResponse = (cb) => {
  window.onhashchange = () => {
    const res = getMobileResponse()
    !res ? cb(null, null) : (res.error ?  cb(res.error, null) : cb(null, res))
  }
}

/**
  *  A promise which resolves once a response become available in the hash params (url frament)
  *
  *  @return   {Promise<Object, Error>}    a promise which resolves with a response object or rejects with an error.
  */
const onMobileResponse = () => new Promise((resolve, reject) => {
  listenMobileResponse((err, res) => { err ? reject(err) : resolve(res)})
})


/**
  *  A general polling function. Polls a given url and parse message according to given parsing functions, promise resolves on response or error.
  *
  *  @param    {String}                  url                url polled
  *  @param    {Function}                messageParse       function that parses response from get request, also determines if response is available to decide to continue polling or not
  *  @param    {Function}                errorParse         function that parses response from get request and determines if error was returned.
  *  @param    {Integer}                 pollingInterval    ms interval at which the given url is polled
  *  @param    {Function}                cancelled          function which returns boolean, if returns true, polling stops
  *  @return   {Promise<Object, Error>}                     a promise which resolves with obj/message or rejects with an error
  */
const poll = (url, messageParse, errorParse, pollingInterval, cancelled) => new Promise((resolve, reject) => {
  let interval = setInterval(
    () => {
      nets({
        uri: url,
        json: true,
        method: 'GET',
        withCredentials: false,
        rejectUnauthorized: false
      },
      function (err, res, body) {
        if (err) return reject(err)

        if (cancelled()) {
          clearInterval(interval)
          return reject(new Error('Request Cancelled'))
        }
        try {
          const messageError = errorParse(body)
          const message = messageParse(body)
          if (messageError) {
            clearInterval(interval)
            return reject(messageError)
          }
          if (message) {
            clearInterval(interval)
            return resolve(message)
          }
        } catch (err) {
          clearInterval(interval)
          return reject(err)
        }
      })
    }, pollingInterval)
})


/**
  *  A polling function specifically for polling Chasqui.
  *
  *  @param    {String}                  url                a Chasqui url polled
  *  @param    {Integer}                 pollingInterval    ms interval at which the given url is polled
  *  @param    {Function}                cancelled          function which returns boolean, if returns true, polling stops
  *  @return   {Promise<Object, Error>}                     a promise which resolves with obj/message or rejects with an error
  */
const pollChasqui = (url, pollingInterval, cancelled) => {
  const messageParse = (res) => res.message['access_token']
  const errorParse = (res) => res.message.error
  return poll(url, messageParse, errorParse, pollingInterval, cancelled).then(res => {
    console.log('res!')
    clearChasqui(url)
    console.log(res)
    return res
  })
}

// TODO maybe remove and just have reasonable removal times
const clearChasqui = (url) => {
  nets({
    uri: url,
    method: 'DELETE',
    withCredentials: false,
    rejectUnauthorized: false
  }, function (err) { if (err) { throw err } /* Errors without this cb */ })
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


// TODO move elsewhere/generalize, just here as helper for push right now.
/**
 *  Encrypts a message
 *
 *  @param      {String}        the message to be encrypted
 *  @param      {String}        the public encryption key of the receiver, encoded as base64
 *  @return     {String}        the encrypted message, encoded as base64
 *  @private
 */
const encryptMessage = (message, receiverKey) => {
  const tmpKp = nacl.box.keyPair()
  const decodedKey = naclutil.decodeBase64(receiverKey)
  const decodedMsg = naclutil.decodeUTF8(message)
  const nonce = nacl.randomBytes(24)

  const ciphertext = nacl.box(decodedMsg, nonce, decodedKey, tmpKp.secretKey)
  return {
    from: naclutil.encodeBase64(tmpKp.publicKey),
    nonce: naclutil.encodeBase64(nonce),
    ciphertext: naclutil.encodeBase64(ciphertext)
  }
}

// TODO Move to some utils?
/**
  *  Given a length, returns a random string of that length
  *
  *  @param    {Integer}                 length    specify length of string returned
  *  @return   {String}                            random string
  */
function randomString (length) {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let result = ''
  for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
  return result
}

// const MobileSignedTransport = ({uriHandler}) => {
//   // TODO args below or above?, above makes sense if using this alone, dev create dif transports for dif types, not clear if used in connect
//   // maybe just allow both, with below overwriting above, and what are the defaults? if default post, shoul redirect not have a default.
//   // TODO temporary here
//   return (uri, {data, type = 'post', redirectUrl } = {}) => {
//     uri = paramsToQueryString(uri, {type})
//     if (redirectUrl) {
//       if (data) redirectUrl = paramsToUrlFragment(redirectUrl, {data})
//       uri = paramsToQueryString(uri, {'redirect_url': redirectUrl })
//     }
//     uriHandler ? uriHandler(uri) : window.location.assign(uri)
//   }
// }

export { pollChasqui,
         poll,
         listenMobileResponse,
         pushNotificationTransport,
         MobileTransport,
        //  MobileSignedTransport,
         QRChasquiTransport,
         QRTransport,
         URIHandlerChasquiTransport,
         onMobileResponse,
         getMobileResponse }
