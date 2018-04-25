import * as url from './../../src/transport/url.js'
const sinon = require('sinon')
var chai = require('chai');
const expect = chai.expect
chai.use(require('sinon-chai'))

const unsignedRequest = `https://id.uport.me/me`
const signedRequest = `https://id.uport.me/me?requestToken=eyJ0eXAiOiJK`
const windowUrl = 'thiswindow.url'
const res = 'eyJ0eXAiOiJK'

describe('transport.url', function () {

  describe('send()', function () {
    const send = url.send()

    it('Calls uriHandler if given one', () => {
      const uriHandler = sinon.spy()
      const send = url.send({uriHandler})
      const assign = sinon.spy()
      global.window = {location : {href: windowUrl, assign}}
      send('request')
      expect(uriHandler).to.be.calledOnce
    })

    it('Adds type to uri if given one', () => {
      const assign = sinon.spy()
      global.window = {location : {href: windowUrl, assign}}
      send('request')
      expect(assign).to.be.calledWithMatch('type=post')
    })

    it('Adds current window as callback to uri if unsigned and not given callback', () => {
      const assign = sinon.spy()
      global.window = {location : {href: windowUrl, assign}}
      send(unsignedRequest)
      expect(assign).to.be.calledWithMatch(`callback_url=${encodeURIComponent(windowUrl)}`)
    })

    it('Adds callback as redirect_url param if signed request', () => {
      const assign = sinon.spy()
      global.window = {location : {href: windowUrl, assign}}
      const callback = 'https://myserver.web'
      send(signedRequest, {callback})
      expect(assign).to.be.calledWithMatch(`redirect_url=${encodeURIComponent(callback)}`)
    })

    it('Adds callback as callback_url param if unsigned request', () => {
      const assign = sinon.spy()
      global.window = {location : {href: windowUrl, assign}}
      const callback = 'https://myserver.web'
      send(signedRequest, {callback})
      expect(assign).to.be.calledWithMatch(`callback_url=${encodeURIComponent(callback)}`)
    })

    it('Adds id to uri if given one', () => {
      const assign = sinon.spy()
      global.window = {location : {href: windowUrl, assign}}
      send(signedRequest, {id: 'idString'})
      expect(assign).to.be.calledWithMatch('id=idString')
    })

    it('Adds data to uri if given one', () => {
      const assign = sinon.spy()
      global.window = {location : {href: windowUrl, assign}}
      send(signedRequest, {data: 'dataString'})
      expect(assign).to.be.calledWithMatch('data=dataString')
    })
  })

  describe('getResponse()', function () {

    it('Returns if response in url', () => {
      global.window = {location : {hash: `?access_token=${res}`}}
      expect(url.getResponse()).to.not.be.null
    })

    it('Returns null if no response in url', () => {
      global.window = {location : {hash: ''}}
      expect(url.getResponse()).to.be.null
    })

    it('Returns error, gets error from url, if error', () => {
      global.window = {location : {hash: '?error=error'}}
      expect(url.getResponse()).to.deep.equal({error:'error'})
    })

    it('Returns {res, data, id}, gets params from url, if successful response', () => {
      global.window = {location : {hash: `?access_token=${res}&id=idString&data=dataString`}}
      expect(url.getResponse()).to.deep.equal({res, id: 'idString', data: 'dataString'})
    })
  })

  describe('listenResponse()', function () {

    it('Calls callback with response on url hash change with response', () => {
      global.window = {location : {hash: `?access_token=${res}`}, onhashchange: () => { throw new Error('expected listenResponse to set this function')}}
      const cb = sinon.spy()
      url.listenResponse(cb)
      window.onhashchange()
      expect(cb).to.be.calledWith(null, { data: undefined, id: undefined, res })
    })

    it('Calls callback with error on url hash change with error', () => {
      global.window = {location : {hash: `?error=error`}, onhashchange: () => { throw new Error('expected listenResponse to set this function')}}
      const cb = sinon.spy()
      url.listenResponse(cb)
      window.onhashchange()
      expect(cb).to.be.calledWith('error', null)
    })

    it('Does not call callback if url hash change does not include a response', () => {
      global.window = {location : {hash: ``}, onhashchange: () => { throw new Error('expected listenResponse to set this function')}}
      const cb = sinon.spy()
      url.listenResponse(cb)
      window.onhashchange()
      expect(cb).to.not.be.called
    })
  })

  describe('onResponse()', function () {
    it('Calls listenResponse and returns promise which resolves on successful response', () => {
      global.window = {location : {hash: `?access_token=${res}`}, onhashchange: () => { throw new Error('expected listenResponse to set this function')}}
      const cb = sinon.spy()
      return url.onResponse().then(res => {
        expect(res).to.deep.equal({ data: undefined, id: undefined, res })
      })
      window.onhashchange()
    })

    it('Calls listenResponse and returns promise which rejects on error response', () => {
      global.window = {location : {hash: `?error=error`}, onhashchange: () => { throw new Error('expected listenResponse to set this function')}}
      const cb = sinon.spy()
      return url.onResponse().then(res => {
        throw new Error('transport.url.onReponse Promise resolved, expected it to reject')
      }, err => {
        expect(err).to.match('error');
      })
      window.onhashchange()
    })
  })
})
