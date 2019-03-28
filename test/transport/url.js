/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */
import * as url from './../../src/transport/url.js'
const sinon = require('sinon')
var chai = require('chai')
const expect = chai.expect
chai.use(require('sinon-chai'))

const requestMessage =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpYXQiOjE1Mjk5NTQxMjcsImV4cCI6MTUyOTk1NDcyNywicmVxdWVzdGVkIjpbIm5hbWUiLCJwaG9uZSIsImNvdW50cnkiXSwicGVybWlzc2lvbnMiOlsibm90aWZpY2F0aW9ucyJdLCJjYWxsYmFjayI6Imh0dHBzOi8vY2hhc3F1aS51cG9ydC5tZS9hcGkvdjEvdG9waWMvYVZLY0VkNWp6bm1Xc2xqMyIsInR5cGUiOiJzaGFyZVJlcSIsImlzcyI6ImRpZDp1cG9ydDoyb2VYdWZIR0RwVTUxYmZLQnNaRGR1N0plOXdlSjNyN3NWRyJ9.ISlUPHoqmGru_MfwjGzq1xxuTKeYIVr4V7g40HeUVsZ-j_gxOkJSzYsTd7AGpth-CwjaPmFLGXnyDG2aiE7NXA'

const windowUrl = 'thiswindow.url'
const res = 'eyJ0eXAiOiJK'

describe('transport.url', function() {
  describe('send()', function() {
    const send = url.send()

    it('Calls uriHandler if given one', () => {
      const uriHandler = sinon.spy()
      const send = url.send({ uriHandler })
      const assign = sinon.spy()
      global.window = { location: { href: windowUrl, assign } }
      send('request')
      expect(uriHandler).to.be.calledOnce
    })

    it('Adds type to uri if given one', () => {
      const assign = sinon.spy()
      global.window = { location: { href: windowUrl, assign } }
      send(requestMessage, { type: 'post' })
      expect(assign).to.be.calledWithMatch('type=post')
    })

    it('Adds redirectUrl as redirect_url param ', () => {
      const assign = sinon.spy()
      global.window = { location: { href: windowUrl, assign } }
      const redirectUrl = 'https://myserver.web'
      send(requestMessage, { redirectUrl })
      expect(assign).to.be.calledWithMatch(`redirect_url=${encodeURIComponent(redirectUrl)}`)
    })

    it('Adds id to redirectUrl if given one', () => {
      const assign = sinon.spy()
      global.window = { location: { href: windowUrl, assign } }
      const redirectUrl = 'https://myserver.web'
      send(requestMessage, { id: 'idString', redirectUrl })
      expect(assign).to.be.calledWithMatch(encodeURIComponent('id=idString'))
    })

    it('Adds data to callback if given one', () => {
      const assign = sinon.spy()
      global.window = { location: { href: windowUrl, assign } }
      const redirectUrl = 'https://myserver.web'
      send(requestMessage, { data: 'dataString', redirectUrl })
      expect(assign).to.be.calledWithMatch(encodeURIComponent('data=dataString'))
    })
  })

  describe('getResponse()', function() {
    it('Returns if access_token response in url', () => {
      global.window = { location: { hash: `#access_token=${res}&id=idString` } }
      expect(url.getResponse()).to.not.be.null
    })

    it('Returns if verfication response in url', () => {
      global.window = { location: { hash: `#verification=${res}&id=idString` } }
      expect(url.getResponse()).to.not.be.null
    })

    it('Returns null if no response in url', () => {
      global.window = { location: { hash: '' } }
      expect(url.getResponse()).to.be.null
    })

    it('Returns error, gets error from url, if error', () => {
      global.window = { location: { hash: '?error=error&id=idString' } }
      expect(url.getResponse()).to.deep.equal({ error: 'error', id: 'idString', payload: null, data: null })
    })

    it('Returns {res, data, id}, gets params from url, if successful response', () => {
      global.window = { location: { hash: `#access_token=${res}&id=idString&data=dataString` } }
      expect(url.getResponse()).to.deep.equal({ payload: res, id: 'idString', data: 'dataString' })
    })

    it('Removes a uPort response from the hash param', () => {
      global.window = { location: { hash: `#id=SignRequest&access_token=${res}` } }
      url.getResponse()
      expect(global.window.location.hash).to.be.equal('')
    })

    it('Does not remove non-uPort hash params', () => {
      global.window = { location: { hash: `#param=2&access_token=${res}` } }
      url.getResponse()
      expect(global.window.location.hash).to.be.equal('#param=2')
    })
  })

  describe('listenResponse()', function() {
    it('Calls callback with response on url hash change with response', () => {
      global.window = {
        location: { hash: `#access_token=${res}&id=idString` },
        onhashchange: () => {
          throw new Error('expected listenResponse to set this function')
        },
      }
      const cb = sinon.spy()
      url.listenResponse(cb)
      window.onhashchange()
      expect(cb).to.be.calledWith(null, { data: null, id: 'idString', payload: res })
    })

    it('Calls callback with error on url hash change with error', () => {
      global.window = {
        location: { hash: `#error=error&id=idString` },
        onhashchange: () => {
          throw new Error('expected listenResponse to set this function')
        },
      }
      const cb = sinon.spy()
      url.listenResponse(cb)
      window.onhashchange()
      expect(cb).to.be.calledWith('error', { error: 'error', id: 'idString', data: null, payload: null })
    })

    it('Does not call callback if url hash change does not include a response', () => {
      global.window = {
        location: { hash: `` },
        onhashchange: () => {
          throw new Error('expected listenResponse to set this function')
        },
      }
      const cb = sinon.spy()
      url.listenResponse(cb)
      window.onhashchange()
      expect(cb).to.not.be.called
    })
  })

  describe('onResponse()', function() {
    it('Calls listenResponse and returns promise which resolves on successful response', done => {
      global.window = {
        location: { hash: `#access_token=${res}&id=idString` },
        onhashchange: () => {
          throw new Error('expected listenResponse to set this function')
        },
      }
      url.onResponse().then(response => {
        expect(response.payload).to.equal(res)
        done()
      })
      window.onhashchange()
    })

    it('Calls listenResponse and returns promise which rejects on error response', done => {
      global.window = {
        location: { hash: `#error=error&id=idString` },
        onhashchange: () => {
          throw new Error('expected listenResponse to set this function')
        },
      }
      url.onResponse().then(
        res => {
          throw new Error('transport.url.onReponse Promise resolved, expected it to reject')
        },
        err => {
          expect(err).to.deep.equal({ data: null, id: 'idString', error: 'error', payload: null })
          done()
        },
      )
      window.onhashchange()
    })
  })
})
