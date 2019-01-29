// import { expect } from 'chai'
// import * as chasqui from './../../src/transport/messageServer.js'
const sinon = require('sinon')
const proxyquire = require('proxyquire')
var chai = require('chai');
const expect = chai.expect
chai.use(require('sinon-chai'))
let chasqui = require('./../../src/transport/messageServer.js')

const CHASQUI_URL = 'https://api.uport.space/chasqui/topic/'
const ranStr = 'aVKcEd5jznmWslj3'

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


describe('transport.chasqui', function () {

  describe('URIHandlerSend()', function () {
    it('Requires a uriHandler', () => {
      expect(chasqui.URIHandlerSend).to.throw(/required/)
      expect(() => chasqui.URIHandlerSend(()=>{})).to.not.throw()
    })
  })

  describe('URIHandlerSend() Configured', function () {
    const uriHandler = sinon.spy()
    const pollGeneral = sinon.stub().resolves('ResponseString')
    const randomString = sinon.stub().returns(ranStr)
    const requestMessage = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NkstUiJ9.eyJpYXQiOjE1Mjk5NTQxMjcsImV4cCI6MTUyOTk1NDcyNywicmVxdWVzdGVkIjpbIm5hbWUiLCJwaG9uZSIsImNvdW50cnkiXSwicGVybWlzc2lvbnMiOlsibm90aWZpY2F0aW9ucyJdLCJjYWxsYmFjayI6Imh0dHBzOi8vYXBpLnVwb3J0LnNwYWNlL2NoYXNxdWkvdG9waWMvYVZLY0VkNWp6bm1Xc2xqMyIsInR5cGUiOiJzaGFyZVJlcSIsImlzcyI6ImRpZDpldGhyOjB4NDFjOTkxZjczZjBjN2E3Y2M5NWI5ZGY5MDk0NmUxYTdiMDE3NGVlNiJ9.hjkP5-yoAACebORa29-iO_VXCm3_81KwaHzrD3xHI94PbJzaT50x3uSr9MwQSl9sO1Lmdzkg1VMkuHyHFt9ClAE'
    const uri = `https://id.uport.me/req/${requestMessage}`
    let URIHandlerSend

    before(() => {
      chasqui = proxyquire( './../../src/transport/messageServer.js', {
        './poll.js': {default: pollGeneral},
        '../crypto.js': { randomString }
      })
      URIHandlerSend = chasqui.URIHandlerSend(uriHandler)
    });

    it('Uses uPort chasqui as default messaging server', () => {
      return URIHandlerSend(requestMessage).then(res => {
        expect(uriHandler).to.have.been.calledWithMatch(uri)
      })
    })

    it('Adds "post" as type url param', () => {
      return URIHandlerSend(requestMessage).then(res => {
        expect(uriHandler).to.have.been.calledWithMatch(`type=post`)
      })
    })

    it('Polls messaging server at cb for a response', () => {
      return URIHandlerSend(requestMessage).then(res => {
        expect(pollGeneral).to.have.been.calledWith(CHASQUI_URL + ranStr)
      })
    })
  })

  describe('poll()', function () {
    const res = { message: { access_token: 'token'}}
    const resError = { message: {error: 'error'}}

    it('Creates poll arg function to parse message', () => {
      const pollGeneral = sinon.stub().callsFake((url, messageParse, errorParse, pollingInterval, cancelled) => {
        expect(messageParse(res)).to.equal('token')
        return Promise.resolve('ResponseString')
      })
      chasqui = proxyquire( './../../src/transport/messageServer.js', {
        './poll.js': {default: pollGeneral}
      })
      return chasqui.poll(CHASQUI_URL + ranStr)
    })

    it('Creates poll arg function to parse error', () => {
      const pollGeneral = sinon.stub().callsFake((url, messageParse, errorParse, pollingInterval, cancelled) => {
        expect(errorParse(resError)).to.equal('error')
        return Promise.resolve('ResponseString')
      })
      chasqui = proxyquire( './../../src/transport/messageServer.js', {
        './poll.js': {default: pollGeneral}
      })
      return chasqui.poll(CHASQUI_URL + ranStr)
    })

    it('Clears response on chasqui once response received ', () => {
      const pollGeneral = sinon.stub().resolves('ResponseString')
      chasqui = proxyquire( './../../src/transport/messageServer.js', {
        './poll.js': {default: pollGeneral}
      })
      return chasqui.poll(CHASQUI_URL + ranStr)
      // TODO Spy on nets call with delete uponr response
    })

    it('It resolves with response from polling if response', () => {
      const pollGeneral = sinon.stub().resolves('ResponseString')
      chasqui = proxyquire( './../../src/transport/messageServer.js', {
        './poll.js': {default: pollGeneral}
      })
      return chasqui.poll(CHASQUI_URL + ranStr).then(res => {
        expect(res).to.equal('ResponseString')
      })
    })

    it('It rejects with error from polling if error', () => {
      const pollGeneral = sinon.stub().rejects('Error')
      chasqui = proxyquire( './../../src/transport/messageServer.js', {
        './poll.js': {default: pollGeneral}
      })
      return chasqui.poll(CHASQUI_URL + ranStr).then(res => {
        throw new Error('transport.chasqui.poll Promise resolved, expected it to reject')
      }, err => {
        expect(err).to.be.an('error');
      })
    })

  })

  describe('clearResponse()', function () {
    it('Creates DELETE HTTP request to given url', () => {
      const nets = sinon.stub().callsFake((obj, cb) => {
        expect(obj.method).to.equal('DELETE')
      })
      chasqui = proxyquire( './../../src/transport/messageServer.js', {
        'nets': nets
      })
      return chasqui.clearResponse(CHASQUI_URL + ranStr)
    })
  })
})
