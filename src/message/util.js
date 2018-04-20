// TODO make so the following funcs don't necessarily need to be used and order, and they are redundant.
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
  const supported = ['value', 'function', 'bytecode', 'label', 'callback_url', 'client_id', 'network_id', 'gas', 'gasPrice']
  return supported.filter(val => params[val])
                  .reduce((uri = url, val) => `${uri}${/uport:.*?\?/.test(uri) ? '&' : '?'}${val}=${encodeURIComponent(params[val])}`, url)
                  .toString()
}


export { paramsToUrlFragment, paramsToQueryString}
