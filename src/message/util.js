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
  const supported = ['value', 'function', 'bytecode', 'label', 'callback_url', 'redirect_url', 'client_id', 'network_id', 'gas', 'gasPrice', 'type']
  return supported.filter(val => params[val])
                  .reduce((uri = url, val) => {
                      const split = uri.split('#')
                      return `${split[0]}${/uport.me\/(me|(0x)?[0-9a-f]+|[0-9a-zA-Z]+)?\?/.test(split[0]) ? '&' : '?'}${val}=${encodeURIComponent(params[val])}${split[1]  ? '#' + split[1] : ''}`
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

const getURLJWT = (url) => url.replace(/https:\/\/id.uport.me\/req\//, '').replace(/(\#|\?)(.*)/, '')


export { paramsToUrlFragment, paramsToQueryString, getUrlQueryParams, getURLJWT }
