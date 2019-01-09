import qrImage from 'qr-image'

/**
 *  Given a string of data it returns a image URI which is a QR code. An image
 *  URI can be displayed in a img html tag by setting the src attrbiute to the
 *  the image URI.
 *
 *  @param    {Function(String => Promise)} display 
 *  @return   {String}               image URI
 */
const createSender = (display) => {
  return data => {
    let png = qrImage.imageSync(data, { type: 'png' }).toString('base64')
    return display(`data:image/png;charset=utf-8;base64, ${png}`)
  }
}

const createListener = () => {
  
}

export { chasquiSend, chasquiCompress, send }
