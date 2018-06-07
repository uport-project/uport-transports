import nacl from 'tweetnacl'
import naclutil from 'tweetnacl-util'
import base64url from "base64url"

export const ASYNC_ENC_ALGORITHM = 'x25519-xsalsa20-poly1305'
const BLOCK_SIZE = 64

function pad (message) {
  return message.padEnd(Math.ceil(message.length / 64) * BLOCK_SIZE, '\0')
}

function unpad (padded) {
  return padded.replace(/\0+$/, '')
}

// TODO Move to some utils in transport or move out of transport entirely?
/**
  *  Given a length, returns a random string of that length
  *
  *  @param    {Integer}                 length    specify length of string returned
  *  @return   {String}                            random string
  */
function randomString (length) {
  return base64url.fromBase64(naclutil.encodeBase64(nacl.randomBytes(length)))
}

/**
 *  Encrypts a message
 *
 *  @param      {String}        the message to be encrypted
 *  @param      {String}        the public encryption key of the receiver, encoded as base64
 *  @return     {String}        the encrypted message, encoded as base64
 *  @private
 */
function encryptMessage (message, boxPub) {
  const { publicKey, secretKey } = nacl.box.keyPair()
  const nonce = nacl.randomBytes(nacl.box.nonceLength)
  const padded = pad(message)
  const ciphertext = nacl.box(naclutil.decodeUTF8(padded), nonce, naclutil.decodeBase64(boxPub), secretKey)
  return {
    version: ASYNC_ENC_ALGORITHM,
    nonce: naclutil.encodeBase64(nonce),
    ephemPublicKey: naclutil.encodeBase64(publicKey),
    ciphertext: naclutil.encodeBase64(ciphertext)
  }
}

function decryptMessage ({ciphertext, nonce, ephemPublicKey}, secretKey) {
  // TODO lookup idIndex and actIndex based on passed in address
  const decrypted = nacl.box.open(
    naclutil.decodeBase64(ciphertext),
    naclutil.decodeBase64(nonce),
    naclutil.decodeBase64(ephemPublicKey),
    secretKey)
  return unpad(naclutil.encodeUTF8(decrypted))
}

export { randomString, encryptMessage, decryptMessage, pad, unpad }
