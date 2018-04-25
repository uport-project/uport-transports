// import { expect } from 'chai'
// import * as chasqui from './../../src/transport/chasqui.js'
const sinon = require('sinon')
const proxyquire = require('proxyquire')
var chai = require('chai');
const expect = chai.expect
chai.use(require('sinon-chai'))
let chasqui = require('./../../src/transport/chasqui.js')
const CHASQUI_URL = 'https://chasqui.uport.me/api/v1/topic/'
const ranStr = '4242'

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
    const uri = 'me.uport:me'
    let URIHandlerSend

    before(() => {
      chasqui = proxyquire( './../../src/transport/chasqui.js', {
        './poll.js': {default: pollGeneral},
        './../crypto/index.js': { randomString }
      })
      URIHandlerSend = chasqui.URIHandlerSend(uriHandler)
    });

    it('Uses uPort chasqui as default messaging server', () => {
      return URIHandlerSend(uri).then(res => {
        expect(uriHandler).to.have.been.calledWithMatch('chasqui.uport.me')
      })
    })

    it('Adds messaging server url as callback url param with random string', () => {
      return URIHandlerSend(uri).then(res => {
        expect(uriHandler).to.have.been.calledWithMatch(`callback_url=${encodeURIComponent(CHASQUI_URL + ranStr)}`)
      })
    })

    it('Adds "post" as type url param', () => {
      return URIHandlerSend(uri).then(res => {
        expect(uriHandler).to.have.been.calledWithMatch(`type=post`)
      })
    })

    it('Polls messaging server at cb for a response', () => {
      return URIHandlerSend(uri).then(res => {
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
      chasqui = proxyquire( './../../src/transport/chasqui.js', {
        './poll.js': {default: pollGeneral}
      })
      return chasqui.poll(CHASQUI_URL + ranStr)
    })

    it('Creates poll arg function to parse error', () => {
      const pollGeneral = sinon.stub().callsFake((url, messageParse, errorParse, pollingInterval, cancelled) => {
        expect(errorParse(resError)).to.equal('error')
        return Promise.resolve('ResponseString')
      })
      chasqui = proxyquire( './../../src/transport/chasqui.js', {
        './poll.js': {default: pollGeneral}
      })
      return chasqui.poll(CHASQUI_URL + ranStr)
    })

    it('Clears response on chasqui once response received ', () => {
      const pollGeneral = sinon.stub().resolves('ResponseString')
      chasqui = proxyquire( './../../src/transport/chasqui.js', {
        './poll.js': {default: pollGeneral}
      })
      return chasqui.poll(CHASQUI_URL + ranStr)
      // TODO Spy on nets call with delete uponr response
    })

    it('It resolves with response from polling if response', () => {
      const pollGeneral = sinon.stub().resolves('ResponseString')
      chasqui = proxyquire( './../../src/transport/chasqui.js', {
        './poll.js': {default: pollGeneral}
      })
      return chasqui.poll(CHASQUI_URL + ranStr).then(res => {
        expect(res).to.equal('ResponseString')
      })
    })

    it('It rejects with error from polling if error', () => {
      const pollGeneral = sinon.stub().rejects('Error')
      chasqui = proxyquire( './../../src/transport/chasqui.js', {
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
      chasqui = proxyquire( './../../src/transport/chasqui.js', {
        'nets': nets
      })
      return chasqui.clearResponse(CHASQUI_URL + ranStr)
    })
  })
})
