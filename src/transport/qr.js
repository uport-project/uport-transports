import nets from 'nets'

import { open, close, failure } from './ui'
import { paramsToQueryString, messageToURI, getUrlQueryParams } from './../message/util.js'
import { URIHandlerSend, CHASQUI_URL } from './messageServer'

const POLLING_INTERVAL = 2000

/**
 * A QR tranpsort which uses our provided QR modal to relay a request to a uPort client,
 * optionally compressing the provided message if a compress function is provided
 *
 * @param    {String}       displayText   dialog used in qr modal display
 * @return   {Function}                   a configured QRTransport Function
 *   @param    {String}       message            a uport client request message
 *   @param    {Object}       [opts={}]
 *   @param    {Function}     [opts.cancel]      cancel callback, called on modal close
 *   @param    {Function}     [opts.compress]    a function to compress a JWT, returning a promise that resolves to a string
 *   @return   {Function}                        a function to close the QR modal
 */
const send = displayText => (message, { cancel, compress } = {}) => {
  if (compress) {
    compress(message)
      .then(msg => open(msg, cancel, displayText))
      .catch(err => {
        console.error(err)
        // Display failure modal and allow retry
        failure(() => send(displayText)(message, { cancel, compress }))
      })
  } else {
    let uri = messageToURI(message)
    uri = /callback_type=/.test(uri) ? uri : paramsToQueryString(uri, { callback_type: 'post' })
    open(uri, cancel, displayText)
  }

  // Return close function immediately, UI is async anyway
  return close
}

/**
 * A utility function for reducing the size of a QR code by uploading it to chasqui and
 * replacing the contents with the topic url.
 *
 * An empty Verification JWT (i.e. with signature and sub/iss but blank claim) is ~250 characters
 * The absolute max that can fit in a scanable QR on the screen is ~1500 characters
 * Below 650 characters the QR modal fits perfectly in the browser on a 13" MBP, with some wiggle room
 *
 * @param   {String}  message     the request JWT
 * @param   {Number}  threshold   the smallest size (in string length) to compress
 * @returns {String}  the chasqui url of the message, or the original message if less than threshold
 */
const chasquiCompress = (message, threshold = Number.MAX_VALUE) => {
  return new Promise((resolve, reject) => {
    if (message.length < threshold) {
      let uri = messageToURI(message)
      uri = /callback_type=/.test(uri) ? uri : paramsToQueryString(uri, { callback_type: 'post' })
      resolve(uri)
      return
    }
    // Trim message and extract query params
    const topic = {
      message: message.replace(/\?.*/, ''),
      ...getUrlQueryParams(message),
    }
    nets(
      {
        uri: `${CHASQUI_URL}topic/`,
        method: 'POST',
        body: JSON.stringify(topic),
        headers: {
          'content-type': 'application/json',
        },
        withCredentials: false,
        rejectUnauthorized: false,
      },
      function(err, response) {
        if (err) reject(err)
        else if (response.statusCode !== 201) reject(new Error('Failed to create topic'))
        else {
          const uri = `${CHASQUI_URL}${response.headers.location || response.headers.Location}`
          resolve(uri)
        }
      },
    )
  })
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
  const transport = URIHandlerSend(send(displayText, { compress: chasquiCompress }), { chasquiUrl, pollingInterval })
  return (message, params) =>
    transport(message, params).then(
      res => {
        close()
        return res
      },
      err => {
        close()
        throw new Error(err)
      },
    )
}

export { chasquiSend, chasquiCompress, send }
