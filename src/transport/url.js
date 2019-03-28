import { paramsToQueryString, paramsToUrlFragment, messageToURI as defaultMessageToURI } from './../message/util.js'
import qs from 'qs'

// TODO callback_url and redirect or just one
/**
 *  A mobile transport for handling and configuring requests which are sent from a mobile browser to a uport client, in this case the uPort mobile app.
 *
 *  @param    {Object}      [config={}]             an optional config object
 *  @param    {Function}    [config.messageToURI]   a function called with the message/JWT to format into a URI
 *  @param    {Function}    [config.uriHandler]     a function called with the requestURI once it is formatted for this transport, default opens URI
 *  @return   {Function}                    a configured MobileTransport Function
 *  @param    {String}       message        a uport client request message
 *  @param    {Object}       [opts={}]      an optional config object
 *  @param    {String}       opts.id        an id string for a request, used to identify response once returned
 *  @param    {String}       opts.data      additional data specific to your application that you can later receive with the response
 *  @param    {String}       opts.type      specifies callback type 'post' or 'redirect' for response
 *  @param    {String}       opts.callback  specifies url which a uport client will return to control once request is handled, depending on request type it may or may not be returned with the response as well.
 */
const send = ({ uriHandler, messageToURI = defaultMessageToURI } = {}) => {
  return (message, { id, data, type, redirectUrl } = {}) => {
    let uri = messageToURI(message)
    if (type) uri = paramsToQueryString(uri, { callback_type: type })
    if (redirectUrl) {
      if (data) redirectUrl = paramsToUrlFragment(redirectUrl, { data })
      if (id) redirectUrl = paramsToUrlFragment(redirectUrl, { id })
      uri = paramsToQueryString(uri, { redirect_url: redirectUrl })
    }
    uriHandler ? uriHandler(uri) : window.location.assign(uri)
  }
}

/**
 *  A function to fetch a response from hash params appended to callback url, if available when function called.
 *
 *  @return   {Object}   A response object if repsonse is available, otherwise null.
 */
const getResponse = () => {
  const hash = window.location.hash.slice(1) // hash always starts with #
  const response = parseResponse(hash)
  const { nextHash, hashChanged } = removeUportHashParams(hash)
  if (hashChanged) window.location.hash = nextHash
  return response
}

const UPORT_PARAMS = ['data', 'id', 'error', 'access_token', 'verification', 'typedDataSig', 'personalSig', 'tx']
const removeUportHashParams = hash => {
  const parts = hash.split(/[&;]/g)

  let hashChanged = false
  for (let i = parts.length - 1; i >= 0; i--) {
    const param = parts[i].split('=')[0]
    if (UPORT_PARAMS.includes(param)) {
      parts.splice(i, 1)
      if (!hashChanged) hashChanged = true
    }
  }

  return {
    nextHash: parts.length > 0 ? '#' + parts.join('&') : '',
    hashChanged,
  }
}

// TODO should there be a way to cancel
/**
 *  A listener which calls given callback when a response becomes avaialble in the hash params (url fragment)
 *
 *  @param    {Function}     cb     a callback function called as cb(err, res) when a response becomes available
 */
const listenResponse = cb => {
  window.onhashchange = () => {
    const payload = getResponse()
    if (payload) payload.error ? cb(payload.error, payload) : cb(null, payload)
  }
}

/**
 *  A promise which resolves once a response become available in the hash params (url fragment)
 *
 *  @return   {Promise<Object, Error>}    a promise which resolves with a response object or rejects with an error.
 */
const onResponse = () =>
  new Promise((resolve, reject) => {
    listenResponse((err, res) => {
      err ? reject(res) : resolve(res)
    })
  })

/**
 *  Parses response from full response url or hash param string
 *
 *  @return   {Object}     a response object of the form {id: ..., payload: ..., data: ...}
 */
const parseResponse = url => {
  const params = qs.parse(url.split('#').pop())
  if (params.id) {
    const response = { data: params.data || null, id: params.id }
    if (params.error) return Object.assign(response, { error: params.error, payload: null })
    if (params['access_token']) return Object.assign(response, { payload: params['access_token'] })
    if (params['verification']) return Object.assign(response, { payload: params['verification'] })
    if (params['typedDataSig']) return Object.assign(response, { payload: params['typedDataSig'] })
    if (params['personalSig']) return Object.assign(response, { payload: params['personalSig'] })
    if (params['tx']) return Object.assign(response, { payload: params['tx'] })
    return Object.assign(response, { payload: null })
  }
  return null
}

export { send, getResponse, listenResponse, onResponse, parseResponse }
