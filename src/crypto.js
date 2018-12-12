import nacl from 'tweetnacl'
import naclutil from 'tweetnacl-util'
import base64url from 'base64url'

export const ASYNC_ENC_ALGORITHM = 'x25519-xsalsa20-poly1305'
const BLOCK_SIZE = 64

function pad(message) {
  const paddedSize = Math.ceil(message.length / BLOCK_SIZE) * BLOCK_SIZE
  // use `String.prototype.padEnd()` if available
  if (typeof message.padEnd === 'function') return message.padEnd(paddedSize, '\0')
  let padded = message
  while (padded.length < paddedSize) {
    padded += '\0'
  }
  return padded
}

function unpad(padded) {
  return padded.replace(/\0+$/, '')
}

/**
 *  Given a length, returns a random string of that length
 *
 *  @param    {Integer}                 length    specify length of string returned
 *  @return   {String}                            random string
 */
function randomString(length) {
  return base64url.fromBase64(naclutil.encodeBase64(nacl.randomBytes(length)))
}

/**
 *  Encrypts a message
 *
 *  @param      {String}   message    the message to be encrypted
 *  @param      {String}   boxPub     the public encryption key of the receiver, encoded as base64
 *  @return     {Object}              the encrypted message as an object containing a `version`, `nonce`, `ephemPublicKey` and `ciphertext`
 *  @private
 */
function encryptMessage(message, boxPub) {
  const { publicKey, secretKey } = nacl.box.keyPair()
  const nonce = nacl.randomBytes(nacl.box.nonceLength)
  const padded = pad(message)
  const ciphertext = nacl.box(naclutil.decodeUTF8(padded), nonce, naclutil.decodeBase64(boxPub), secretKey)
  return {
    version: ASYNC_ENC_ALGORITHM,
    nonce: naclutil.encodeBase64(nonce),
    ephemPublicKey: naclutil.encodeBase64(publicKey),
    ciphertext: naclutil.encodeBase64(ciphertext),
  }
}

/**
 *  Decrypts a message
 *
 *  @param      {Object} encrypted                   The encrypted message object
 *  @param      {String} encrypted.version           The string `x25519-xsalsa20-poly1305`
 *  @param      {String} encrypted.nonce             Base64 encoded nonce
 *  @param      {String} encrypted.ephemPublicKey    Base64 encoded ephemeral public key
 *  @param      {String} encrypted.ciphertext        Base64 encoded ciphertext
 *  @param      {String} secretKey                   The secret key as a Uint8Array
 *  @return     {String}                             The decrypted message
 *  @private
 */

function decryptMessage({ version, ciphertext, nonce, ephemPublicKey }, secretKey) {
  if (!secretKey) throw new Error('Encryption secret key has not been configured')
  if (version !== ASYNC_ENC_ALGORITHM) throw new Error(`Unsupported encryption algorithm: ${version}`)
  if (!(ciphertext && nonce && ephemPublicKey)) throw new Error(`Invalid encrypted message`)
  const decrypted = nacl.box.open(
    naclutil.decodeBase64(ciphertext),
    naclutil.decodeBase64(nonce),
    naclutil.decodeBase64(ephemPublicKey),
    secretKey,
  )
  if (!decrypted) throw new Error('Could not decrypt message')
  return unpad(naclutil.encodeUTF8(decrypted))
}

/**
 *  Decrypts a response from a promise. This is intended to be used to wrap the response from Chasqui or other transport
 *
 *  @param      {Object} encrypted                 The encrypted message object
 *  @param      {String} encrypted.version         The string `x25519-xsalsa20-poly1305`
 *  @param      {String} encrypted.nonce           Base64 encoded nonce
 *  @param      {String} encrypted.ephemPublicKey  Base64 encoded ephemeral public key
 *  @param      {String} encrypted.ciphertext      Base64 encoded ciphertext
 *  @param      {String} secretKey                 The secret key as a Uint8Array
 *  @return   {Promise<Object, Error>}             a promise which resolves with the decrypted message or rejects with an error
 */
function decryptResponse(response, secretKey) {
  return new Promise((resolve, reject) => {
    if (typeof response === 'object') {
      resolve(decryptMessage(response, secretKey))
    }
    resolve(response)
  })
}

export { randomString, encryptMessage, decryptMessage, decryptResponse, pad, unpad }
