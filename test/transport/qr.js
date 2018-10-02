const proxyquire = require('proxyquire')
const chai = require('chai')
const sinon = require('sinon')
const expect = chai.expect
chai.use(require('sinon-chai'))

const { isMessageServerCallback } = require('../../src/transport/messageServer')

// Exactly 650 characters
const fakeJWT = 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMiwiY2xhaW0iOiJsYWxhbGFsYWxhbGFsYWxhbGFsYWxhbGFsYWxhbGFsYWxhbGFsYWxhbGFsYWxsYWxhbGFsYWxhbGFsYWxhbGFsYWxhbGFzZmphbGtmandvZWZqcGFvaXdqZnBramF3ZWZwb2lqZmVyaW9mam9pYXdqZmVvamFvc2lmam9haWVqZm9pYXdlam9maWphb2lzZWpmb2lhc2plZm9pYWpwb3dldWhmcWxsa2MsZG0sZG1kbWRtYXNtYSx3Zml3ZWYzMHN3ZWY0dDk4dTg0aGcwM3VoNGcwaXUzaGdmMG9pcnVuMDR1cm9mbHF1NDU5aG9xODV1NTA5ODN1NDA5ODIzdTR0b2lqZmxpamloYXNmZWFmZmVmZWVlZWVhc2V5dWllamZpZWplbGZpM2pmOTgzamY5MnVqa3NyZGZsaWoifQ.pcofwu5zy5i7SAQpCCa5kIAFMtsSSrSyLD8QG_Mkrh-Xjfo8U9xdB5u2575wCiFUHUG2GXWKM4DBM6yIZQVlLA'

describe('qr send', () => {
  it('uses a compression function if provided', () => {
    const compress = sinon.stub().callsFake(x => x)
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
  it('does nothing for messages below the threshold', () => {
    const message = 'shortmessage'
    const nets = sinon.spy()
    const { chasquiCompress } = proxyquire('../../src/transport/qr', {
      'nets': nets
    })
    expect(chasquiCompress(message)).to.equal(message)
    expect(nets).to.not.be.called
  })

  it('uploads to chasqui for long messages, and returns an encoded topicUrl', () => {
    const threshold = 650
    const nets = sinon.spy()
    const { chasquiCompress } = proxyquire('../../src/transport/qr', {
      'nets': nets
    })

    expect(decodeURI(chasquiCompress(fakeJWT))).to.match(/\/topic\//)
    expect(nets).to.be.calledOnce
  })
})