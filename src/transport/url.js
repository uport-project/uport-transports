import qs from 'qs'

/**
 *  A mobile transport for handling and configuring requests which are sent from a mobile browser to a uport client, in this case the uPort mobile app.
 *
 */
export const createSender = () => {
  return uri => window.location.assign(uri)
}

/**
 *  A listener which calls given callback when a response becomes avaialble in the hash params (url fragment)
 *
 *  @param    {Function}     cb     a callback function called as cb(err, res) when a response becomes available
 */
export const createListener = ({ parse = parseResponse }) => 
  () => new Promise((resolve, reject) => {
    const handleHashChange = () => {
      const payload = parse(window.location.hash.slice(1))
      if (payload) {
        if (payload.error) reject(payload.error)
        else resolve(payload)
        window.removeEventListener('hashchange', handleHashChange)
      }
    }
  
    window.addEventListener('hashchange', handleHashChange)
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

