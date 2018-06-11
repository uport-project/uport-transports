/**
  *  Add params as url fragment (hash params)
  *
  *  @param    {String}       url           a url
  *  @param    {Object}       [params={}]   params object of valid params to add as url fragment
  *  @return   {String}                     a url with valid params added as url fragment (hash params)
  */
const paramsToUrlFragment = (url, params = {} ) => {
  const supported = ['data', 'id']
  return supported.filter(val => params[val])
                  .reduce((uri = url, val) => `${uri}${/#/.test(uri) ? '&' : '#'}${val}=${encodeURIComponent(params[val])}`, url)
                  .toString()
}

//NOTE  still suport data/bytecode param???
/**
  *  Add params as url query params
  *
  *  @param    {String}       url           a url
  *  @param    {Object}       [params={}]   params object of valid params to add as url query params
  *  @return   {String}                     a url with valid params added as url query framents
  */
const paramsToQueryString = (url, params = {} ) => {
  const supported = ['value', 'function', 'bytecode', 'label', 'callback_url', 'redirect_url', 'client_id', 'network_id', 'gas', 'gasPrice', 'callback_type']
  return supported.filter(val => params[val])
                  .reduce((uri = url, val) => {
                      const split = uri.split('#')
                      return `${split[0]}${/uport.me\/req\/([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-\+\/=]*)?\?/.test(split[0]) ? '&' : '?'}${val}=${encodeURIComponent(params[val])}${split[1]  ? '#' + split[1] : ''}`
                  }, url)
                  .toString()
}

/**
  *  Returns params object of query params in given url
  *
  *  @param    {String}       url           a url
  *  @return   {Object}                     object of param key and values
  */
const getUrlQueryParams = (url) => {
  const params = url.match(/[^&?]*?=[^&?]*/g)
  if (!params) return {}
  return params.map((param) => param.split('='))
               .reduce((params, param) => {
                 params[param[0]] = param[1]
                 return params
                }, {})
}

/**
  * Returns request token (JWT) from a request URI
  *
  *  @param    {String}       url           a url
  *  @return   {String}                     a JWT string
  */
const getURLJWT = (url) => url.replace(/https:\/\/id.uport.me\/req\//, '').replace(/(\#|\?)(.*)/, '')

/**
  * Given string, returns boolean if string is JWT
  *
  *  @param    {String}       jwt           A JWT string
  *  @return   {Boolean}
  */
const isJWT = (jwt) => /^([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-\+\/=]*)/.test(jwt)

/**
  * Given token request (JWT), wraps in request URI
  *
  *  @param    {String}       jwt           A JWT string
  *  @return   {Staring}                    A valid request URI, including the given request token
  */
const tokenRequest = (jwt) =>  `https://id.uport.me/req/${jwt}`



export { paramsToUrlFragment, paramsToQueryString, getUrlQueryParams, getURLJWT, isJWT, tokenRequest }
