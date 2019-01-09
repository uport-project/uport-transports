import nets from 'nets'

/**
 * @module pubsub
 * An HTTP pubsub transport, which 
 */
const POLLING_INTERVAL = 2000

/**
 * 
 * @param {Object}  options
 * @param {String}  options.url
 */
export function createSession({url, method, ...options}) {
  return Promise((resolve, reject) => nets({
    uri: url, 
    json: true,
    method, 
    ...options
  }, (err, res, body) => {
    if (err) {
      reject(err)
    } else if (res.statusCode === 201) {
      let location
      if (location = res.headers.location || res.headers.Location) {
        resolve(`${url}${location}`)
      } else {
        resolve(location)
      }
    } else {
      reject(body)
    }
  }))
}

/**
 * Create a new pubsub topic with an HTTP request
 */
export function createSender({url, method="POST", ...options}) {
  return message => Promise((resolve, reject) => nets({
    uri: url,
    json: true,
    body: {message},
    method,
    ...options
  }, (err, res, body) => {
    if (err || res.statusCode >= 400) reject(err || body)
    else resolve(body)
  }))
}

/**
 *  A general polling function. Polls a given url and parse message according to given parsing functions, promise resolves on response or error.
 *
 *  @param    {String}                  url                url polled
 *  @param    {Function}                [messageParse]     function that parses response from GET request, returning the message when available, and null otherwise
 *  @param    {Integer}                 [pollingInterval]  ms interval at which the given url is polled
 *  @param    {Function}                [cancelled]        function which returns boolean, if returns true, polling stops
 *  @return   {Promise<Object, Error>}                     a promise which resolves with obj/message or rejects with an error
 */
export function createListener({url, parseResponse=messageParse, cancelled = () => false, pollingInterval = POLLING_INTERVAL}) {
  return () => new Promise((resolve, reject) => {
    let interval
    const die = err => {
      clearInterval(interval)
      reject(err)
    }
    // Poll until result or error
    interval = setInterval(() => {
      nets({
        uri: url,
        json: true,
        method: 'GET',
        withCredentials: false,
        rejectUnauthorized: false,
      }, (err, res, body) => {
        if (err) {
          die(err)
        } else if (res.statusCode >= 400) { 
          die(new Error(`Error ${res.statusCode}: ${body}`))
        } else if (cancelled()) {
          die(new Error('Request Cancelled'))
        } else {
          const message = parseResponse(body)
          if (message) {
            clearResponse(url)
            clearInterval(interval)
            return resolve(message)
          }
        }
      })
    }, pollingInterval)
  })
}

/**
 * @private
 * The defualt message parsing function for Chasqui
 * @param {Object} body   The json object in the http response
 */
const messageParse = body => {
  // Support new and old chasqui format
  const message = body.message && (('content' in body.message) ? JSON.parse(body.message.content) : body.message)
  
  // FIXME: this is not a great method for handling our expected keys in the response.
  //        Very tightly coupled to the message format, and these keys seem to come out
  //        of nowhere.
  return message && message['access_token'] || message['tx'] || message['typedDataSig'] || message['personalSig']
}

/**
 * @private
 * Delete a chasqui topic with an http DELETE request
 * @param {String} url 
 */
const clearResponse = url => nets({
  uri: url,
  method: 'DELETE',
  withCredentials: false,
  rejectUnauthorized: false,
}, err => { if (err) { throw err } })

export default poll
