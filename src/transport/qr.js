import nets from 'nets'

import { open, close, success, failure } from './ui'
import { paramsToQueryString, messageToURI } from './../message/util.js'
import { URIHandlerSend, CHASQUI_URL, genCallback } from './messageServer'

const POLLING_INTERVAL = 2000

/**
*  A QR tranpsort which uses our provided QR modal to relay a request to a uPort client
*
*  @param    {String}       displayText   dialog used in qr modal display
*  @return   {Function}                   a configured QRTransport Function
*  @param    {String}       message       a uport client request message
*  @param    {Object}       [opt={}]
*  @param    {Function}     [cancel]      cancel callback, called on modal close
*  @return   {Function}                   a function to close the QR modal
*/
const send = (displayText) => (message, {cancel, compress} = {}) => {
  let uri = compress ? messageToURI(compress(message)) : messageToURI(message)
  uri = /callback_type=/.test(uri) ? uri : paramsToQueryString(uri, {callback_type: 'post'})
  open(uri, cancel, displayText)
  return close
}

/**
 * A utility function for reducing the size of a QR code by uploading it to chasqui and
 * replacing the contents with the topic url
 * @param   {String}  message     the request JWT
 * @param   {Number}  threshold   the smallest size (in string length) to compress
 * @returns {String}  the chasqui url of the message, or the original message if less than threshold 
 */
const chasquiCompress = (message, threshold) => {
  if (message.length < threshold) return message

  // TODO: Allow chasqui post to create a topicId
  const topicURL = genCallback()
  nets({
    uri: topicURL,
    method: 'POST',
    body: message,
  }, function (err) { 
    if (err) { throw err } 
  })

  return topicURL
}

/**
  *  A QR Code and Chasqui Transport. The QR modal is configured for tranporting the request, while the
  *  response will be returned through Chasqui.
  *
  *  @param    {Object}       [config={}]               an optional config object
  *  @param    {String}       [config.chasquiUrl]       url of messaging server, defaults to Chasqui instance run by uPort
  *  @param    {String}       [config.pollingInterval]  milisecond interval at which the messaging server will be polled for a response
  *  @return   {Function}                               a configured QRTransport Function
  *  @param    {String}       message                   a uPort client request message
  *  @return   {Promise<Object, Error>}                 a function to close the QR modal
  */
const chasquiSend = ({ chasquiUrl = CHASQUI_URL, pollingInterval = POLLING_INTERVAL, displayText } = {}) => {
  const transport = URIHandlerSend(send(displayText, {compress: chasquiCompress}), {chasquiUrl, pollingInterval})
  return (message, params) => transport(message, params).then(res => {
    close()
    return res
  }, err => {
    close()
    throw new Error(err)
  })
}

export { chasquiSend, send }
