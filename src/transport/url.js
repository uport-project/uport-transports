import { paramsToQueryString, paramsToUrlFragment } from './../message/util.js'
import qs from 'qs'

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
const send = ({uriHandler}={}) => {
  // TODO args below or above? extra details above
  return (uri, {id, data, type, callback} = {}) => {
  // what if has no protocol in passed in string
  // if( md.userAgent() === 'Chrome' && md.os() === 'iOS' ) {
  //    url = 'googlechrome:' + window.location.href.substring(window.location.protocol.length)
  //  } else {
  //    url = window.location.href
  //  }
    if (type) uri = paramsToQueryString(uri, {type})
    // Maybe move this logic (line) up a level to connect?
    let cb = /requestToken/.test(uri) ? callback || null : callback || window.location.href
    if (cb) {
      if (data) cb = paramsToUrlFragment(cb, {data})
      if (id) cb = paramsToUrlFragment(cb, {id})
      uri = /requestToken/.test(uri) ? paramsToQueryString(uri, {'redirect_url': cb}) : paramsToQueryString(uri, {'callback_url': cb})
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
const listenResponse = (cb) => {
  window.onhashchange = () => {
    const res = getResponse()
    if (res) res.error ?  cb(res.error, null) : cb(null, res)
  }
}

/**
  *  A promise which resolves once a response become available in the hash params (url fragment)
  *
  *  @return   {Promise<Object, Error>}    a promise which resolves with a response object or rejects with an error.
  */
const onResponse = () => new Promise((resolve, reject) => {
  listenResponse((err, res) => { err ? reject(err) : resolve(res)})
})

export { send,
         getResponse,
         listenResponse,
         onResponse }
