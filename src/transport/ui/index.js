import qrImage from 'qr-image'

import { modalTemplate, introModalTemplate, uportModal, pushNotificationModal } from './templates'

/**  
 * @module uport-transports/transport/ui
 * @description
 * A set of ui utility functions and default displays for bridging between
 * a web browser and a uport user's mobile app
 */

/**
 *  Given a string of data it returns a image URI which is a QR code. An image
 *  URI can be displayed in a img html tag by setting the src attrbiute to the
 *  the image URI.
 *
 *  @param    {String}     data      data string, typically a uPort URI
 *  @return   {String}               image URI
 */
const getImageDataURI = (data) => {
  let pngBuffer = qrImage.imageSync(data, {type: 'png'})
  return 'data:image/png;charset=utf-8;base64, ' + pngBuffer.toString('base64')
}

/**
 *  A default QR pop over display, which injects the neccessary html
 *
 *  @param    {String}     data       data which is displayed in QR code
 *  @param    {Function}   cancel     a function called when the cancel button is clicked
 *  @param    {String}     appName    name of the users app
 *  @param    {Boolean}    introModal a flag for displaying the intro
 */
const open = (data, cancel, appName, introModal) => {

  let wrapper = document.createElement('div')
  wrapper.setAttribute('id', 'uport-wrapper')

  wrapper.innerHTML =
    introModal
      ? introModalTemplate(appName)
      : modalTemplate({qrImageUri: getImageDataURI(data), cancel})

  const cancelClick = (event) => {
    document.getElementById('uport-qr-text').innerHTML = 'Cancelling';
    if (!cancel) close();
    cancel();
  }

  const uportTransition = (event) => {
    wrapper.innerHTML = modalTemplate({qrImageUri: getImageDataURI(data), cancel})
    document.getElementById('uport-qr-cancel').addEventListener('click', cancelClick)
  }

  document.body.appendChild(wrapper)
  document.getElementById('uport-qr-cancel').addEventListener('click', cancelClick)
  if (introModal) {
    document.getElementById('uport-continue-btn').addEventListener('click', uportTransition)
  }
}

/**
 *  Closes the default QR pop over
 */
const close = () => {
  const uportWrapper = document.getElementById('uport-wrapper')
  document.body.removeChild(uportWrapper)
}

/**
 * Show a notification to the user that a push has been sent to their phone
 */
const notifyPushSent = () => {
  let wrapper = document.createElement('div')
  wrapper.setAttribute('id', 'uport-wrapper')
  wrapper.innerHTML = uportModal(pushNotificationModal)

  document.getElementById('uport-qr-cancel').addEventListener('click', close)
  document.body.appendChild(wrapper)
  setTimeout(close, 2000)
}

/**
 *  export
 */

export { close, open, notifyPushSent }
