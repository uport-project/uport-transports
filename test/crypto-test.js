import { pad, unpad, encryptMessage, decryptMessage, randomString } from '../src/crypto.js'
import nacl from 'tweetnacl'
import naclutil from 'tweetnacl-util'

const sinon = require('sinon')
const chai = require('chai');
const expect = chai.expect

chai.use(require('sinon-chai'))

describe('pad', () => {
  it('pads correctly', () => {
    expect(pad('')).to.equal('')
    expect(pad('hello')).to.equal('hello\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000')
    expect(pad(pad('hello'))).to.equal(pad('hello'))
    expect(pad('hello+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++')).to.equal('hello+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
    expect(pad('hello+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++!')).to.equal('hello+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++!\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000')
  })
})

describe('unpad', () => {
  it('unpads correctly', () => {
    expect(unpad('')).to.equal('')
    expect(unpad(pad('hello'))).to.equal('hello')
    expect(unpad('hello+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++')).to.equal('hello+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
    expect(unpad(pad('hello+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++!'))).to.equal('hello+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++!')
  })
})

const boxPub = 'oGZhZ0cvwgLKslgiPEQpBkRoE+CbWEdi738efvQBsH0='
const KEY_PAIR = {
  secret: 'Qgigj54O7CsQOhR5vLTfqSQyD3zmq/Gb8ukID7XvC3o=',
  public: boxPub
}
const KP = {
  secretKey: naclutil.decodeBase64(KEY_PAIR.secret),
  publicKey: naclutil.decodeBase64(KEY_PAIR.public)
}
const message = 'hello'
const nonce = '/20Dn2PowBiZu5kw42pO7F/wiKvkecM3'
const VALID_ENCRYPTED_PAYLOAD = {
  ciphertext: 'xdP3d9e9sQhTB4FP/Omf3N68GRSb5u/vHlkhFUTcj+58UjQ6aBJc/DLjG3ArNS/UPpO+XnKB/Dc8tXram6Xc6OD5Qpnyfn/txoqPudc0XkM=',
  ephemPublicKey: 'oGZhZ0cvwgLKslgiPEQpBkRoE+CbWEdi738efvQBsH0=',
  nonce,
  version: 'x25519-xsalsa20-poly1305'
}

describe('encryptMessage', () => {
  it('encrypts correctly', () => {
    nacl.box.keyPair = () => KP
    nacl.randomBytes = () => naclutil.decodeBase64(nonce)
    expect(encryptMessage(message, boxPub)).to.equal(VALID_ENCRYPTED_PAYLOAD)
  })
})

describe('decryptMessage', () => {
  it('encrypts correctly', () => {
    nacl.box.keyPair = () => KP
    nacl.randomBytes = () => naclutil.decodeBase64(nonce)
    expect(decryptMessage(VALID_ENCRYPTED_PAYLOAD, KP.secretKey)).to.equal(message)
  })
})

describe('randomString', () => {
  it('generates url compatible random string', () => {
    nacl.randomBytes = () => naclutil.decodeBase64(nonce)
    expect(randomString()).to.eq('_20Dn2PowBiZu5kw42pO7F_wiKvkecM3')
  })
})