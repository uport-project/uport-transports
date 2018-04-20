import nacl from 'tweetnacl'
import naclutil from 'tweetnacl-util'

// TODO Move to some utils in transport or move out of transport entirely?
/**
  *  Given a length, returns a random string of that length
  *
  *  @param    {Integer}                 length    specify length of string returned
  *  @return   {String}                            random string
  */
function randomString (length) {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let result = ''
  for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
  return result
}


/**
 *  Encrypts a message
 *
 *  @param      {String}        the message to be encrypted
 *  @param      {String}        the public encryption key of the receiver, encoded as base64
 *  @return     {String}        the encrypted message, encoded as base64
 *  @private
 */
const encryptMessage = (message, receiverKey) => {
  const tmpKp = nacl.box.keyPair()
  const decodedKey = naclutil.decodeBase64(receiverKey)
  const decodedMsg = naclutil.decodeUTF8(message)
  const nonce = nacl.randomBytes(24)

  const ciphertext = nacl.box(decodedMsg, nonce, decodedKey, tmpKp.secretKey)
  return {
    from: naclutil.encodeBase64(tmpKp.publicKey),
    nonce: naclutil.encodeBase64(nonce),
    ciphertext: naclutil.encodeBase64(ciphertext)
  }
}



export { randomString, encryptMessage }
