import MobileDetect from 'mobile-detect'
import PubSub from 'pubsub-js'

import { ui, push, qr, url, messageServer } from './transport'
import { messageToUniversalURI, paramsToUrlFragment } from './message/util'

// declare symbols as identifiers for private attributes and methods
const _sendPush = Symbol('sendPush')
const _pushToken = Symbol('pushToken')
const _publicEncKey = Symbol('publicEncKey')
const _isMobile = Symbol('isMobile')
const _onLoadUrlResponse = Symbol('onLoadUrlResponse')

class BrowserTransport {
  /**
   * Instantiates a new Browser Transport
   *
   * @param {String} [opts.pushToken] A user's push token containing an endpoint for sending notifications
   * @param {String} [opts.publicEncKey] A user's public key for encrypting messages pushed to them
   * @param {String} [opts.qrTitle] Title text that appears in the QR modal
   */
  constructor(
    opts = {
      pushToken: null,
      publicEncKey: null,
      qrTitle: '',
    },
  ) {
    // check if we are on mobile
    this[_isMobile] = typeof navigator !== 'undefined' && !!new MobileDetect(navigator.userAgent).mobile()

    // check if there is a response message in the URL
    // shape of this should be { id: string, payload: string, data: string, error: string }
    this[_onLoadUrlResponse] = url.getResponse()

    // Start listening for responses in the URL in case the mobile app redirects back to this same running page
    // this has been observed using safari on an iPhone-xs. However, most of the time a response will not be received
    // this way because the redirect will open a new tab
    url.listenResponse((err, res) => {
      if (err) throw err
      const { id, payload, data } = res
      PubSub.publish(id, { payload, data })
    })

    // configure transport for sending push requests
    this[_sendPush] = null
    this.setPushInfo(opts.pushToken, opts.publicEncKey)

    this.qrTitle = opts.qrTitle
  }

  /**
   * @returns {Boolean} true if detected as running on a mobile device
   */
  getIsMobile() {
    return this[_isMobile]
  }

  /**
   * Generates a callbackUrl that can be used to create a request which will return its response to this application
   *
   * @param {String} id id that will be used when sending the request that will contain this callback url
   * @returns {String} a url that can be used as the callbackUrl option when creating a request with uport-credentials
   */
  getCallbackUrl(id) {
    return this[_isMobile] ? paramsToUrlFragment(window.location.href, { id }) : messageServer.genCallback()
  }
  // NOTE: This is necessary due to leaky abstractions between the current transports and messages specs. Ideally
  //       you should be able to create a request message independently of where the response will get sent. Moving
  //       towards a edge-server-based transport architecture will help alleviate this.

  /**
   * @returns {Object} object containing the currently configured pushToken and publicEncKey
   */
  getPushInfo() {
    return { pushToken: this[_pushToken], publicEncKey: this[_publicEncKey] }
  }

  /**
   * Provide a user's push token and public encryption key to enable the configuration of a push transport
   *
   * @param {String} pushToken A user's push token containing an endpoint for sending notifications
   * @param {String} publicEncKey A user's public key for encrypting messages pushed to them
   */
  setPushInfo(pushToken, publicEncKey) {
    this[_pushToken] = pushToken
    this[_publicEncKey] = publicEncKey
    this[_sendPush] = pushToken && publicEncKey ? push.sendAndNotify(pushToken, publicEncKey) : null
  }

  /**
   * Listens for responses to requests made by calling `send`. Returns a promise that resolves once with the resopnse.
   *
   * @param {String} id id of the request that that we are listening for
   * @returns {Promise} resolves a response object with { payload, data } containing the jwt and extra optional data
   */
  onResponse(id) {
    // if there was a response message in the URL when this was instantiated, resolve it once
    if (this[_onLoadUrlResponse] && this[_onLoadUrlResponse].id === id) {
      const { payload, data, error } = this[_onLoadUrlResponse]
      this[_onLoadUrlResponse] = null
      if (error) return Promise.reject(error)
      else return Promise.resolve({ payload, data })
    }

    // if no callback is provided, return a promise that resolves with the first response for that topic
    return new Promise((resolve, reject) => {
      PubSub.subscribe(id, (_, { payload, data, error }) => {
        PubSub.unsubscribe(id)
        if (error) reject(error)
        resolve({ payload, data })
      })
    })
  }

  /**
   * Sends a message by automatically selecting an appropriate transport
   *
   * @param {String} request request message to send
   * @param {String} id id of the request that will be used to identify the response
   * @param {Object} [opts] optional parameters for each transport
   * @param {String} [opts.data] additional application data that can be included as part of the response
   * @param {String} [opts.redirectUrl] url to send the response to
   * @param {String} [opts.type] specifies callback type 'post' or 'redirect' for response
   * @param {Function} [cancel] called when user closes the QR modal
   */
  send(request, id, { data, redirectUrl, type, cancel } = {}) {
    if (!id) throw new Error('Requires request id')
    if (this[_isMobile]) {
      if (!redirectUrl && !type) type = 'redirect'
      this.mobileSend(request, id, { data, redirectUrl, type })
    } else if (this[_sendPush]) {
      this.pushSend(request, id)
    } else {
      this.qrSend(request, id, { cancel })
    }
  }

  /**
   * Sends a message using URL transport.
   *
   * @param {String} request request message to send
   * @param {String} id id of the request that will be used to associate the response
   * @param {Object} [opts] optional parameters specific to url transport
   * @param {String} [opts.data] additional application data that can be included as part of the response
   * @param {String} [opts.redirectUrl] url to send the response to
   * @param {String} [opts.type] specifies callback type 'post' or 'redirect' for response
   */
  mobileSend(request, id, { data, redirectUrl, type } = {}) {
    // fire and forget url request, response will never come back to the same page
    url.send({
      messageToURI: messageToUniversalURI,
    })(request, { id, data, redirectUrl, type })
  }

  /**
   * Sends a message using push transport.
   *
   * @param {String} request request message to send
   * @param {String} id id of the request that will be used to identify the response
   */
  pushSend(request, id) {
    if (!this[_sendPush])
      throw new Error('No push transport configured. Call setPushInfo(pushToken, publicEncKey) first.')
    if (messageServer.isMessageServerCallback(request)) {
      // wrap push transport in chasqui transport and publish response
      messageServer
        .URIHandlerSend(this[_sendPush])(request)
        .then(res => {
          ui.close()
          PubSub.publish(id, { payload: res })
        })
        .catch(error => {
          PubSub.publish(id, { error })
        })
    } else {
      // fire and forget push request
      this[_sendPush](request)
    }
  }

  /**
   * Sends a message using a qr transport
   *
   * @param {String} request request message to send
   * @param {String} id id of the request that will be used to identify the response
   * @param {Object} [opts] optional parameters specific to qr transport
   * @param {Function} [cancel] called when user closes the QR modal
   */
  qrSend(request, id, { cancel } = {}) {
    if (messageServer.isMessageServerCallback(request)) {
      // wrap qr transport in chasqui transport and publish response
      qr.chasquiSend({ displayText: this.qrTitle })(request)
        .then(res => {
          PubSub.publish(id, { payload: res })
        })
        .catch(error => {
          PubSub.publish(id, { error })
        })
    } else {
      // fire and forget qr request
      qr.send(this.qrTitle)(request, { cancel })
    }
  }
}

export default BrowserTransport
