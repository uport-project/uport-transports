import { paramsToQueryString, getUrlQueryParams, getURLJWT, messageToURI } from './../message/util.js'
import { randomString } from './../crypto.js'
import generalPoll from './poll.js'
import { decodeJWT } from 'did-jwt'
import nets from 'nets'
const CHASQUI_URL = 'https://api.uport.me/chasqui/'
const POLLING_INTERVAL = 2000

// TODO can the name of URIHandler be changed
// TODO should it just allow cancel func to be passed in??
// TODO Should it return uri append to promise? instead of a promise??
/**
 *  A general Chasqui Transport. Allows you to configure the transport with any uriHandler for the request,
 *  while the response will always be returned through Chasqui. Chasqui is a simple messaging server that
 *  allows responses to be relayed from a uport client to the original callee.
 *
 *  @param    {String}       uriHandler               a function called with the requestURI once it is formatted for this transport
 *  @param    {Object}       [config={}]              an optional config object
 *  @param    {String}       [config.chasquiUrl]      url of messaging server, defaults to Chasqui instance run by uPort
 *  @param    {String}       [config.pollingInterval] milisecond interval at which the messaging server will be polled for a response
 *  @return   {Function}                              a configured QRTransport Function
 *  @param    {String}       message                  a uPort client request message
 *  @return   {Promise<Object, Error>}                a function to close the QR modal
 */
const URIHandlerSend = (uriHandler, { messageServerUrl = CHASQUI_URL, pollingInterval = POLLING_INTERVAL } = {}) => {
  if (!uriHandler) throw new Error('uriHandler function required')
  return (message, params = {}) => {
    let uri = messageToURI(message)
    const callback = getCallback(uri)
    if (!isMessageServerCallback(uri, messageServerUrl))
      throw new Error('Not a request that can be handled by this configured messaging server transport')
    let isCancelled = false
    const cancel = () => {
      isCancelled = true
    }
    uri = paramsToQueryString(uri, { callback_type: 'post' })
    uriHandler(uri, Object.assign(params, { cancel }))
    const returnVal = poll(callback, pollingInterval, () => isCancelled)
    returnVal.cancel = cancel
    return returnVal
  }
}

/**
 *  A polling function specifically for polling Chasqui.
 *
 *  @param    {String}                  url                a Chasqui url polled
 *  @param    {Integer}                 [pollingInterval]  ms interval at which the given url is polled
 *  @param    {Function}                [cancelled]        function which returns boolean, if returns true, polling stops
 *  @return   {Promise<Object, Error>}                     a promise which resolves with obj/message or rejects with an error
 */
const poll = (url, pollingInterval, cancelled) => {
  const messageParse = res => {
    // Support new and old chasqui format
    const message = res.message && (('content' in res.message) ? JSON.parse(res.message.content) : res.message)
    // FIXME: this is not a great method for handling our expected keys in the response.
    //        Very tightly coupled to the message format, and these keys seem to come out
    //        of nowhere.
    if (message) {
      return message['access_token'] || message['tx'] || message['typedDataSig'] || message['personalSig']
    }
  }
  const errorParse = res => {
    if (res.message) return res.message.error
  }
  return generalPoll(url, messageParse, errorParse, cancelled, pollingInterval).then(res => {
    clearResponse(url)
    return res
  })
}

// TODO maybe remove and just have reasonable removal times
const clearResponse = url => {
  nets(
    {
      uri: url,
      method: 'DELETE',
      withCredentials: false,
      rejectUnauthorized: false,
    },
    function(err) {
      if (err) {
        throw err
      } /* Errors without this cb */
    },
  )
}

const formatMessageServerUrl = url => {
  if (url.endsWith('/topic/')) return url
  if (url.endsWith('/topic')) return `${url}/`
  if (url.endsWith('/')) return `${url}topic/`
  return `${url}/topic/`
}
const genCallback = (messageServerUrl = CHASQUI_URL) => `${formatMessageServerUrl(messageServerUrl)}${randomString(16)}`
const isMessageServerCallback = (uri, messageServerUrl = CHASQUI_URL) =>
  new RegExp(formatMessageServerUrl(messageServerUrl)).test(getCallback(uri))
const getCallback = uri => {
  const tokenCB = decodeJWT(getURLJWT(uri)).payload.callback
  if (tokenCB) return tokenCB
  // support attest req, which does not included cb in token, attest req may better align with other requests in the future
  return getUrlQueryParams(uri).callback_url
}

export { URIHandlerSend, poll, clearResponse, genCallback, isMessageServerCallback, CHASQUI_URL }
