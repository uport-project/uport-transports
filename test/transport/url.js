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
      send(signedRequest, {type: 'post'})
      expect(assign).to.be.calledWithMatch('type=post')
    })

    it('Adds redirectUrl as redirect_url param ', () => {
      const assign = sinon.spy()
      global.window = {location : {href: windowUrl, assign}}
      const redirectUrl = 'https://myserver.web'
      send(signedRequest, {redirectUrl})
      expect(assign).to.be.calledWithMatch(`redirect_url=${encodeURIComponent(redirectUrl)}`)
    })

    it('Adds id to redirectUrl if given one', () => {
      const assign = sinon.spy()
      global.window = {location : {href: windowUrl, assign}}
      const redirectUrl = 'https://myserver.web'
      send(unsignedRequest, {id: 'idString', redirectUrl})
      expect(assign).to.be.calledWithMatch(encodeURIComponent('id=idString'))
    })

    it('Adds data to callback if given one', () => {
      const assign = sinon.spy()
      global.window = {location : {href: windowUrl, assign}}
      const redirectUrl = 'https://myserver.web'
      send(unsignedRequest, {data: 'dataString', redirectUrl})
      expect(assign).to.be.calledWithMatch(encodeURIComponent('data=dataString'))
    })
  })

  describe('getResponse()', function () {

    it('Returns if access_token response in url', () => {
      global.window = {location : {hash: `?access_token=${res}&id=idString`}}
      expect(url.getResponse()).to.not.be.null
    })

    it('Returns if verfication response in url', () => {
      global.window = {location : {hash: `?verification=${res}&id=idString`}}
      expect(url.getResponse()).to.not.be.null
    })

    it('Returns null if no response in url', () => {
      global.window = {location : {hash: ''}}
      expect(url.getResponse()).to.be.null
    })

    it('Returns error, gets error from url, if error', () => {
      global.window = {location : {hash: '?error=error&id=idString'}}
      expect(url.getResponse()).to.deep.equal({error:'error', id: 'idString', res: null, data: null})
    })

    it('Returns {res, data, id}, gets params from url, if successful response', () => {
      global.window = {location : {hash: `?access_token=${res}&id=idString&data=dataString`}}
      expect(url.getResponse()).to.deep.equal({res, id: 'idString', data: 'dataString'})
    })
  })

  describe('listenResponse()', function () {

    it('Calls callback with response on url hash change with response', () => {
      global.window = {location : {hash: `?access_token=${res}&id=idString`}, onhashchange: () => { throw new Error('expected listenResponse to set this function')}}
      const cb = sinon.spy()
      url.listenResponse(cb)
      window.onhashchange()
      expect(cb).to.be.calledWith(null, { data: null, id: 'idString', res })
    })

    it('Calls callback with error on url hash change with error', () => {
      global.window = {location : {hash: `?error=error&id=idString`}, onhashchange: () => { throw new Error('expected listenResponse to set this function')}}
      const cb = sinon.spy()
      url.listenResponse(cb)
      window.onhashchange()
      expect(cb).to.be.calledWith('error', {error: 'error', id: 'idString', data: null, res: null})
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
    it('Calls listenResponse and returns promise which resolves on successful response', (done) => {
      global.window = {location : {hash: `?access_token=${res}&id=idString`}, onhashchange: () => { throw new Error('expected listenResponse to set this function')}}
      url.onResponse().then(response => {
        expect(response.res).to.equal(res)
        done()
      })
      window.onhashchange()
    })

    it('Calls listenResponse and returns promise which rejects on error response', (done) => {
      global.window = {location : {hash: `?error=error&id=idString`}, onhashchange: () => { throw new Error('expected listenResponse to set this function')}}
      url.onResponse().then(res => {
        throw new Error('transport.url.onReponse Promise resolved, expected it to reject')
        done()
      }, err => {
        expect(err).to.deep.equal({ data: null, id: 'idString', error: 'error', res: null })
        done()
      })
      window.onhashchange()
    })
  })
})
