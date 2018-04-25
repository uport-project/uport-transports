import nets from 'nets'
const POLLING_INTERVAL = 2000

/**
  *  A general polling function. Polls a given url and parse message according to given parsing functions, promise resolves on response or error.
  *
  *  @param    {String}                  url                url polled
  *  @param    {Function}                messageParse       function that parses response from get request, also determines if response is available to decide to continue polling or not
  *  @param    {Function}                errorParse         function that parses response from get request and determines if error was returned.
  *  @param    {Integer}                 pollingInterval    ms interval at which the given url is polled
  *  @param    {Function}                cancelled          function which returns boolean, if returns true, polling stops
  *  @return   {Promise<Object, Error>}                     a promise which resolves with obj/message or rejects with an error
  */
const poll = (url, messageParse, errorParse, cancelled = () => false, pollingInterval = POLLING_INTERVAL) => new Promise((resolve, reject) => {
  let interval = setInterval(
    () => {
      nets({
        uri: url,
        json: true,
        method: 'GET',
        withCredentials: false,
        rejectUnauthorized: false
      },
      (err, res, body) => {
        if (err) return reject(err)

        if (cancelled()) {
          clearInterval(interval)
          return reject(new Error('Request Cancelled'))
        }
        try {
          const messageError = errorParse(body)
          const message = messageParse(body)
          if (messageError) {
            clearInterval(interval)
            return reject(messageError)
          }
          if (message) {
            clearInterval(interval)
            return resolve(message)
          }
        } catch (err) {
          clearInterval(interval)
          return reject(err)
        }
      })
    }, pollingInterval)
})

export default poll
