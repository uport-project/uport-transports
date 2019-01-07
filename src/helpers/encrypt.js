import nacl from 'tweetnacl'
import naclutil from 'tweetnacl-util'

/**
 * @module encrypt
 * Paired helper functions to encrypt and decrypt a payload
 */

/** Encryption algorithm to use */
export const ASYNC_ENC_ALGORITHM = 'x25519-xsalsa20-poly1305'

/**
 * @private
 * Pad a message at the end with zero bytes to be divisible by a particular block size
 * @param   {String} message    the message to pad
 * @param   {Number} blockSize  the encryption block size to pad to 
 * @returns {String}            the zero-padded message
 */
function pad(message, blockSize=64) {
  const paddedSize = Math.ceil(message.length / blockSize) * blockSize
  // use `String.prototype.padEnd()` if available
  if (typeof message.padEnd === 'function') return message.padEnd(paddedSize, '\0')
  let padded = message
  while (padded.length < paddedSize) {
    padded += '\0'
  }
  return padded
}

/**
 * @private
 * Remove trailing zero bytes from a string
 * @param   {String} padded 
 * @returns {String} the message without its trailing zero bytes
 */
function unpad(padded) {
  return padded.replace(/\0+$/, '')
}

/**
 *  Create an adapter to encrypt a message with a provided public key
 *
 *  @param      {String}   boxPub     the public encryption key of the receiver, encoded as base64
 *  @return     {Function}            the encrypted message as an object containing a `version`, `nonce`, `ephemPublicKey` and `ciphertext`
 */
export function encryptWith(boxPub) {
  const { publicKey, secretKey } = nacl.box.keyPair()
  return message => {
    const nonce = nacl.randomBytes(nacl.box.nonceLength)
    const padded = pad(message)
    const ciphertext = nacl.box(naclutil.decodeUTF8(padded), nonce, naclutil.decodeBase64(boxPub), secretKey)
    const encObj =  {
      version: ASYNC_ENC_ALGORITHM,
      nonce: naclutil.encodeBase64(nonce),
      ephemPublicKey: naclutil.encodeBase64(publicKey),
      ciphertext: naclutil.encodeBase64(ciphertext),
    }

    return JSON.stringify(encObj)
  }
}

/**
 *  Create a function to decrypt a message encrypted with a 
 *
 *  @param      {String} secretKey                   The secret key as a Uint8Array
 *  @return     {Function}                           A funciton which decrypts messages using the provided secretKey
 */
export function decryptWith(secretKey) {
  if (!secretKey) throw new Error('Encryption secret key has not been configured')
  
  return encryptedMessage => {
    const { version, ciphertext, nonce, ephemPublicKey } = JSON.parse(encryptedMessage)
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
}

/**
 * OLD PARAMS:
 *  @param      {Object} encrypted                   The encrypted message object
 *  @param      {String} encrypted.version           The string `x25519-xsalsa20-poly1305`
 *  @param      {String} encrypted.nonce             Base64 encoded nonce
 *  @param      {String} encrypted.ephemPublicKey    Base64 encoded ephemeral public key
 *  @param      {String} encrypted.ciphertext        Base64 encoded ciphertext
 */