import push from './push'
import qr from './qr'
import url from './url'
import messageServer from './messageServer'
import MobileDetect from 'mobile-detect'
import { ui } from '.'

/**
 *  Detects if this library is called on a mobile device.
 *
 *  @return   {Boolean} Returns true if on mobile or tablet, false otherwise.
 *  @private
 */
const isMobile = () => {
  return typeof navigator !== 'undefined' && !!new MobileDetect(navigator.userAgent).mobile()
}

/**
 * A transport that can be used in the browser.  Perfer push transport if possible.
 * Otherwise use URL on mobile or QR on desktop.
 *
 * @param {String} appName  The name of your app
 * @param {String} pushToken A user's push token containing an endpoint for sending notifications to them
 * @param {String} pubEncKey A user's public encryption key used to encrypt the message being pushed to them
 * @return {Function} A transport function
 */

export const send = (appName, pushToken, pubEncKey) => {
  // use push if possible
  if (pushToken && pubEncKey) {
    const pushSend = push.sendAndNotify(pushToken, pubEncKey)
    return (request, { type, redirectUrl, data }) => {
      if (messageServer.isMessageServerCallack(request)) {
        return messageServer
          .URIHandlerSend(pushSend)(request, { type, redirectUrl })
          .then(res => {
            ui.close()
            return { payload: res, data }
          })
      }

      pushSend(request, { type, redirectUrl })
      return Promise.resolve({ data })
    }
  }

  // use url transport on mobile
  if (isMobile()) {
    return url.send()
  }

  // if on desktop, use qr for request
  return (request, { data, cancel }) => {
    // use chasqui for the response if request contains a chasqui url
    if (messageServer.isMessageServerCallack(request)) {
      return qr
        .chasquiSend({ appName })(request)
        .then(res => ({ payload: res, data }))
    }

    qr.send(appName)(request, { cancel })
    return Promise.resolve({ data })
  }
}
