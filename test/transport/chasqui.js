// import { expect } from 'chai'
// import * as chasqui from './../../src/transport/messageServer.js'
const sinon = require('sinon')
const proxyquire = require('proxyquire')
var chai = require('chai');
const expect = chai.expect
chai.use(require('sinon-chai'))
let chasqui = require('./../../src/transport/messageServer.js')
const CHASQUI_URL = 'https://chasqui.uport.me/api/v1/topic/'
const ranStr = 'aVKcEd5jznmWslj3'

// TODO stub nets everywhere
// Cleanup imports and redundancy

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
    const requestMessage = CHASQUI_URL.match(/api\.uport/) 
      ? 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NkstUiJ9.eyJpYXQiOjE1Mjk5NTQxMjcsImV4cCI6MTUyOTk1NDcyNywicmVxdWVzdGVkIjpbIm5hbWUiLCJwaG9uZSIsImNvdW50cnkiXSwicGVybWlzc2lvbnMiOlsibm90aWZpY2F0aW9ucyJdLCJjYWxsYmFjayI6Imh0dHBzOi8vYXBpLnVwb3J0LnNwYWNlL2NoYXNxdWkvdG9waWMvYVZLY0VkNWp6bm1Xc2xqMyIsInR5cGUiOiJzaGFyZVJlcSIsImlzcyI6ImRpZDpldGhyOjB4NDFjOTkxZjczZjBjN2E3Y2M5NWI5ZGY5MDk0NmUxYTdiMDE3NGVlNiJ9.hjkP5-yoAACebORa29-iO_VXCm3_81KwaHzrD3xHI94PbJzaT50x3uSr9MwQSl9sO1Lmdzkg1VMkuHyHFt9ClAE'
      : 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NkstUiJ9.eyJpYXQiOjE1Mjk5NTQxMjcsImV4cCI6MTUyOTk1NDcyNywicmVxdWVzdGVkIjpbIm5hbWUiLCJwaG9uZSIsImNvdW50cnkiXSwicGVybWlzc2lvbnMiOlsibm90aWZpY2F0aW9ucyJdLCJjYWxsYmFjayI6Imh0dHBzOi8vY2hhc3F1aS51cG9ydC5tZS9hcGkvdjEvdG9waWMvYVZLY0VkNWp6bm1Xc2xqMyIsInR5cGUiOiJzaGFyZVJlcSIsImlzcyI6ImRpZDpldGhyOjB4OWY0Yjc2ZDI2ODJhZmY1NmJjODdhNTkwNzJlNTAyNWExMjA3YTdmOSJ9.TdkEhbhOXEMQtNdqk3c9U8lueY2gy4tD0QhqGm_HMawFI-wPXz4nf2FFfdb_UYCBR03dZnrBqcyQz8rXBab8tQE'
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
