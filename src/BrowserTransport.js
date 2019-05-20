import MobileDetect from 'mobile-detect'
import PubSub from 'pubsub-js'

import { ui, push, qr, url, messageServer } from './transport'
import { messageToUniversalURI } from './message/util'

class BrowserTransport {
  /**
   * Instantiates a new Browser Transport
   *
   * @param {String} [appName] The name of your app as it appears in the QR modal
   * @param {String} [opts.pushToken] A user's push token containing an endpoint for sending notifications
   * @param {String} [opts.publicEncKey] A user's public key for encrypting messages pushed to them
   */
  constructor(appName = 'my-uport-app', opts = {}) {
    this.appName = appName

    // check if we are on mobile
    this.isMobile = typeof navigator !== 'undefined' && !!new MobileDetect(navigator.userAgent).mobile()
    // check if there is a response message in the URL
    this.onLoadUrlResponse = url.getResponse()

    // configure transport for sending push requests
    this.sendPush = null
    this.setPushInfo(opts.pushToken, opts.publicEncKey)
  }

  /**
   * Provide a user's push token and public encryption key to enable the configuration of a push transport
   *
   * @param {String} pushToken A user's push token containing an endpoint for sending notifications
   * @param {String} publicEncKey A user's public key for encrypting messages pushed to them
   */
  setPushInfo(pushToken, publicEncKey) {
    this.sendPush = pushToken && publicEncKey ? push.sendAndNotify(pushToken, publicEncKey) : null
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
  mobileTransport(request, id, { data, redirectUrl, type }) {
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
  pushTransport(request, id) {
    if (!this.pushSend)
      throw new Error('No push transport configured. Call setPushInfo(pushToken, publicEncKey) first.')
    if (messageServer.isMessageServerCallback(request)) {
      // wrap push transport in chasqui transport and publish response
      messageServer
        .URIHandlerSend(this.sendPush)(request)
        .then(res => {
          ui.close()
          PubSub.publish(id, res)
        })
    } else {
      // fire and forget push request
      this.sendPush(request)
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
  qrTransport(request, id, { cancel }) {
    if (messageServer.isMessageServerCallback(request)) {
      // wrap qr transport in chasqui transport and publish response
      qr.chasquiSend({ appName: this.appName })(request).then(res => PubSub.publish(id, res))
    } else {
      // fire and forget qr request
      qr.send(this.appName)(request, { cancel })
    }
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
    if (this.isMobile) {
      if (!redirectUrl && !type) type = 'redirect'
      this.mobileTransport(request, { id, data, redirectUrl, type })
    } else if (this.pushTransport) {
      this.pushTransport(request, id, { redirectUrl, type })
    } else {
      this.qrTransport(request, id, { cancel })
    }
  }

  /**
   * Listens for responses to requests made by calling `send`. Returns a promise that resolves once with the resopnse.
   * If provided with an optional callback, it gets called every time a response with that id is received
   *
   * @param {String} id id of the request that that we are listening for
   * @param {Function} [cb] callback to execute whenever a response with this id is received
   */
  onResponse(id, cb) {
    // if there was a response message in the URL when this was instantiated, resolve it once
    if (this.onLoadUrlResponse && this.onLoadUrlResponse.id === id) {
      const res = this.onLoadUrlResponse
      this.onLoadUrlResponse = null
      return Promise.resolve(res)
    }

    if (cb) {
      // if a callback is provided, call it whenever the topic specified by id is published
      PubSub.subscribe(id, (_, { res, err }) => {
        cb(err, res)
      })
    } else {
      // if no callback is provided, return a promise that resolves with the first response for that topic
      return new Promise((resolve, reject) => {
        PubSub.subscribe(id, (_, { res, err }) => {
          PubSub.unsubscribe(id)
          if (err) reject(err)
          resolve(res)
        })
      })
    }
  }
}

export default BrowserTransport
