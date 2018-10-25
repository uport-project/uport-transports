const sinon = require('sinon')
const proxyquire = require('proxyquire')
var chai = require('chai');
const expect = chai.expect
chai.use(require('sinon-chai'))
const CHASQUI_URL = 'https://chasqui.uport.me/api/v1/topic/'
const ranStr = '4242'

describe('transport.poll', function () {
  const res = { message: { access_token: 'token'}}
  const resError = { message: {error: 'error'}}
  const messageParse = (res) => { if (res.message) return res.message['access_token'] }
  const errorParse = (res) => { if (res.message) return res.message.error }

  describe('poll', function () {
    it('Makes GET requests until a message is received, then it resolves, and stops polling', () => {
      let called = 0
      const nets = sinon.stub().callsFake((obj, cb) => {
        expect(obj.method).to.equal('GET')
        if (called++ <= 1) {
          cb(null, {}, {})
        } else {
          cb(null, {}, res)
        }
      })
      let poll = proxyquire( './../../src/transport/poll.js', { 'nets': nets })
      return poll.default(CHASQUI_URL + ranStr, messageParse, errorParse, () => false, 200).then(res => {
        expect(res).to.equal('token')
        expect(nets).to.be.calledThrice
      })
    })

    it('Rejects with an error once available', () => {
      let called = 0
      const nets = sinon.stub().callsFake((obj, cb) => {
        expect(obj.method).to.equal('GET')
        if (called++ <= 1) {
          cb(null, {}, {})
        } else {
          cb(null, {}, resError)
        }
      })
      let poll = proxyquire( './../../src/transport/poll.js', { 'nets': nets })
      return poll.default(CHASQUI_URL + ranStr, messageParse, errorParse, () => false, 200).then(res => {
        throw new Error('transport.poll Promise resolved, expected it to reject')
      }, err => {
        expect(err).to.equal('error');
        expect(nets).to.be.calledThrice
      })
    })

    it('Stops polling once cancelled and rejects', () => {
      let called = 0
      let isCancelled = false
      const nets = sinon.stub().callsFake((obj, cb) => {
        expect(obj.method).to.equal('GET')
        if (called++ <= 1) {
          cb(null, {}, {})
        } else {
          isCancelled = true
          cb(null, {}, {})
        }
      })
      let poll = proxyquire( './../../src/transport/poll.js', { 'nets': nets })
      return poll.default(CHASQUI_URL + ranStr, messageParse, errorParse, () => isCancelled, 200).then(res => {
        throw new Error('transport.poll Promise resolved, expected it to reject')
      }, err => {
        expect(err).to.be.an('error');
        expect(nets).to.be.calledThrice
      })
    })
  })
})
