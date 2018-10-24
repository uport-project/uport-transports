import qrImage from 'qr-image'

import { qrModal, pushModal, successModal, failureModal } from './templates'

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
const getImageDataURI = data => {
  let pngBuffer = qrImage.imageSync(data, { type: 'png' })
  return 'data:image/png;charset=utf-8;base64, ' + pngBuffer.toString('base64')
}

/**
 *  Closes the default QR pop over
 */
const close = () => {
  const uportWrapper = document.getElementById('uport-wrapper')
  document.body.removeChild(uportWrapper)
}

/**
 * A utility function for rendering a modal with particular content
 *
 * @param     {String}    content   html string defining the inside of the modal
 * @param     {Function}  [close]   the handler to fire when the modal's x button is pressed
 */
const makeModal = (content, closeModal = close) => {
  let wrapper = document.createElement('div')
  wrapper.setAttribute('id', 'uport-wrapper')

  wrapper.innerHTML = content

  document.body.appendChild(wrapper)
  document.getElementById('uport__modal-x').addEventListener('click', closeModal)
}

/**
 *  A default QR pop over display, which injects the neccessary html
 *
 *  @param    {String}     data       data which is displayed in QR code
 *  @param    {Function}   cancel     a function called when the cancel button is clicked
 *  @param    {String}     modalText  message to be displayed above the QR in the modal
 */
const open = (data, cancel, modalText) => {
  const closeModal = close // closure over close for use in callbacks etc.
  const content = qrModal(getImageDataURI(data), modalText)

  const cancelClick = event => {
    document.getElementById('uport__qr-text').innerHTML = 'Cancelling'
    if (cancel) cancel()
    closeModal()
  }

  makeModal(content, cancelClick)
}

/**
 * Show a notification to the user that a push has been sent to their phone
 * @param   {Function}    fallback    The fallback handler if the user doesn't receive a push
 */
const notifyPushSent = fallback => {
  makeModal(pushModal)
  document.getElementById('uport__push-not-received').addEventListener('click', () => {
    close()
    fallback()
  })
}

/**
 * Show a success screen to the user which automatically dismisses
 * after 2 seconds
 */
const success = (timeout = 500) => {
  makeModal(successModal)
  setTimeout(close, timeout)
}

/**
 * Show a failure modal that gives users the option to repeat the failed action
 * @param {Function}  resend  The function that should fire to allow the user to retry
 */
const failure = retry => {
  makeModal(failureModal)

  document.getElementById('uport__failure-retry').addEventListener('click', retry)
}

/**
 *  export
 */

export { close, open, success, failure, notifyPushSent }
