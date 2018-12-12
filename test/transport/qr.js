const proxyquire = require('proxyquire')
const chai = require('chai')
const sinon = require('sinon')
const { messageToURI } = require('../../src/message/util')
const expect = chai.expect
chai.use(require('sinon-chai'))

// Exactly 650 characters
const fakeJWT = 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMiwiY2xhaW0iOiJsYWxhbGFsYWxhbGFsYWxhbGFsYWxhbGFsYWxhbGFsYWxhbGFsYWxhbGFsYWxsYWxhbGFsYWxhbGFsYWxhbGFsYWxhbGFzZmphbGtmandvZWZqcGFvaXdqZnBramF3ZWZwb2lqZmVyaW9mam9pYXdqZmVvamFvc2lmam9haWVqZm9pYXdlam9maWphb2lzZWpmb2lhc2plZm9pYWpwb3dldWhmcWxsa2MsZG0sZG1kbWRtYXNtYSx3Zml3ZWYzMHN3ZWY0dDk4dTg0aGcwM3VoNGcwaXUzaGdmMG9pcnVuMDR1cm9mbHF1NDU5aG9xODV1NTA5ODN1NDA5ODIzdTR0b2lqZmxpamloYXNmZWFmZmVmZWVlZWVhc2V5dWllamZpZWplbGZpM2pmOTgzamY5MnVqa3NyZGZsaWoifQ.pcofwu5zy5i7SAQpCCa5kIAFMtsSSrSyLD8QG_Mkrh-Xjfo8U9xdB5u2575wCiFUHUG2GXWKM4DBM6yIZQVlLA'

describe('qr send', () => {
  it('uses a compression function if provided', () => {
    const compress = sinon.stub().resolves('fakejwt')
    const nets = sinon.stub()
    const { send } = proxyquire('../../src/transport/qr', {
      'nets': nets, 
      './ui': {open: () => null, close: () => null}
    })

    send('test')('fakejwt', {compress})
    expect(compress).to.be.calledOnce
  })
})

describe('chasquiCompress', () => {
  it('formats messages below the threshold as uris', () => {
    const message = 'shortmessage'
    const nets = sinon.spy()
    const { chasquiCompress } = proxyquire('../../src/transport/qr', {
      'nets': nets
    })

    return chasquiCompress(message).then((msg) => {
      expect(msg).to.equal(messageToURI(message) + '?callback_type=post')
      expect(nets).to.not.be.called
    })
  })

  it.skip('uploads to chasqui for long messages, and returns an encoded topicUrl', () => {
    const callback_type = 'post'
    const callback_url = 'uport.me'
    const message = `${fakeJWT}?callback_url=${callback_url}&callback_type=${callback_type}`;

    const nets = sinon.stub().callsFake(({body}, cb) => {
      body = JSON.parse(body)
      expect(body.message).to.equal(fakeJWT)
      expect(body.callback_type).to.equal(callback_type)
      expect(body.callback_url).to.equal(callback_url)
      cb(null, {
        statusCode: 201,
        headers: {Location: '/topic/deadbeefDEADBEEF'}
      })
    })
    const { chasquiCompress } = proxyquire('../../src/transport/qr', {
      'nets': nets
    })

    return chasquiCompress(message).then((msg) => {
      expect(decodeURI(msg)).to.match(/\/topic\//)
      expect(nets).to.be.calledOnce
    })
  })
})