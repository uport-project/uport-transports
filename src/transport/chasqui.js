import nets from 'nets'
import * as qr from './qr/index.js'
import { paramsToQueryString } from './Message.js'
const CHASQUI_URL = 'https://chasqui.uport.me/api/v1/topic/'
const POLLING_INTERVAL = 2000

// TODO can the name of URIHandler be changed
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
const URIHandlerSend = ({uriHandler = qr.open, chasquiUrl = CHASQUI_URL, pollingInterval = POLLING_INTERVAL} = {}) => {
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
  *  A polling function specifically for polling Chasqui.
  *
  *  @param    {String}                  url                a Chasqui url polled
  *  @param    {Integer}                 pollingInterval    ms interval at which the given url is polled
  *  @param    {Function}                cancelled          function which returns boolean, if returns true, polling stops
  *  @return   {Promise<Object, Error>}                     a promise which resolves with obj/message or rejects with an error
  */
const poll = (url, pollingInterval, cancelled) => {
  const messageParse = (res) => res.message['access_token']
  const errorParse = (res) => res.message.error
  return poll(url, messageParse, errorParse, pollingInterval, cancelled).then(res => {
    clearChasqui(url)
    return res
  })
}

// TODO maybe remove and just have reasonable removal times
const clearResponse = (url) => {
  nets({
    uri: url,
    method: 'DELETE',
    withCredentials: false,
    rejectUnauthorized: false
  }, function (err) { if (err) { throw err } /* Errors without this cb */ })
}

export { URIHandlerTransport,
         poll,
         clearResponse }
