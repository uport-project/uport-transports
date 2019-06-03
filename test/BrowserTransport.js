/* eslint-disable no-unused-expressions */
/* global describe, it, beforeEach, before, after */
import chai, { expect } from 'chai'
import sinon from 'sinon'
import PubSub from 'pubsub-js'
import sinonChai from 'sinon-chai'

import BrowserTransport from '../src/BrowserTransport'
import * as messageUtil from '../src/message/util'
import { messageServer, push, url, ui, qr } from '../src/transport'

chai.use(sinonChai)

const MOBILE_USER_AGENT =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1 Mobile/15E148 Safari/604.1'
const QR_TITLE = 'qr title'
const REQUEST_ID = 'testRequest'
const PUSH_TOKEN =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NkstUiJ9.eyJpYXQiOjE1NTg0NjMwNDMsImV4cCI6MTU4OTk5OTA0MywiYXVkIjoiZGlkOmV0aHI6MHhjYmE5NmQ5NjQ2ZjAyMjI2NDM0MjY2YjlmYjg1OWI5YzViNmYzYTNjIiwidHlwZSI6Im5vdGlmaWNhdGlvbnMiLCJ2YWx1ZSI6ImFybjphd3M6c25zOnVzLXdlc3QtMjoxMTMxOTYyMTY1NTg6ZW5kcG9pbnQvQVBOUy91UG9ydC8zMjA0MmVlYi1lMzg5LTNjZGQtOTQ0Yi1jODk5NzFlYjViOTUiLCJpc3MiOiJkaWQ6ZXRocjoweGVmNDdhNDhkYzczMDdmNTc0Nzc1ZTc0NWNkM2I4ZGJlY2ZiZDA3NmIifQ.waMwhBJ-S_934bi1BsI3nqEenANkikrRn6sEi4z-_1BpqTDXAXjrUkEn5O_QrU2j5yy_ag2bR6j4W32Ek070TwA'
const PUB_ENC_KEY = 'oJTV/XBfg5S3odQTomlgg0WyaNAvB7fHlxfYads1wTA='
const RESPONSE_JWT =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NkstUiJ9.eyJpYXQiOjE1NTk1OTE0MDAsImV4cCI6MTU1OTY3NzgwMCwiYXVkIjoiZGlkOmV0aHI6MHgxY2M1YTI5MDk2ODI3MTViYjc3YzkyNWJhNjE0YjFhNzk1MTNmMTQ4IiwidHlwZSI6InNoYXJlUmVzcCIsIm93biI6e30sInJlcSI6ImV5SjBlWEFpT2lKS1YxUWlMQ0poYkdjaU9pSkZVekkxTmtzdFVpSjkuZXlKcFlYUWlPakUxTlRrMU9URXlNemtzSW1WNGNDSTZNVFUxT1RVNU1UZ3pPU3dpY0dWeWJXbHpjMmx2Ym5NaU9sc2libTkwYVdacFkyRjBhVzl1Y3lKZExDSmpZV3hzWW1GamF5STZJbWgwZEhCek9pOHZZWEJwTG5Wd2IzSjBMbTFsTDJOb1lYTnhkV2t2ZEc5d2FXTXZRVWRDUldjM2EyZ3hPV3ROU1dsUFNqa3hTbTFPVVNJc0luUjVjR1VpT2lKemFHRnlaVkpsY1NJc0ltbHpjeUk2SW1ScFpEcGxkR2h5T2pCNE1XTmpOV0V5T1RBNU5qZ3lOekUxWW1JM04yTTVNalZpWVRZeE5HSXhZVGM1TlRFelpqRTBPQ0o5Lk9vQ3ZmUDJJUkdMbkpKX0JPdzV3bGhyUnhDa2VTZnMzV1F0VXJfVGx0OGc5Q1ROMnNwOGdNN2pwM0hUNmRMRFY3NzhON01qX3pOUDBVUE9Xa0NRYnlRRSIsImNhcGFiaWxpdGllcyI6WyJleUowZVhBaU9pSktWMVFpTENKaGJHY2lPaUpGVXpJMU5rc3RVaUo5LmV5SnBZWFFpT2pFMU5UazFPVEUwTURBc0ltVjRjQ0k2TVRVNU1URXlOelF3TUN3aVlYVmtJam9pWkdsa09tVjBhSEk2TUhneFkyTTFZVEk1TURrMk9ESTNNVFZpWWpjM1l6a3lOV0poTmpFMFlqRmhOemsxTVRObU1UUTRJaXdpZEhsd1pTSTZJbTV2ZEdsbWFXTmhkR2x2Ym5NaUxDSjJZV3gxWlNJNkltRnlianBoZDNNNmMyNXpPblZ6TFhkbGMzUXRNam94TVRNeE9UWXlNVFkxTlRnNlpXNWtjRzlwYm5RdlFWQk9VeTkxVUc5eWRDOHdNRGN3TnpKbU9TMHhZMkUzTFRNMk1qTXRZalJrTlMwd05qSXlNR1EyWkRNd01ETWlMQ0pwYzNNaU9pSmthV1E2WlhSb2Nqb3dlRGswTXpnME1EazNNRGcyTkRaaU1UQmpaamhpTVRreU9XTm1OMk5rWVROaFltTmlPREV5TVRFaWZRLnhSdHRWR1puXzhYNUVqWDZOa21DZVRXMmthSndqdE9OczEzVUNTc1hqOHhBZkQycVNvSFkwM2dYaWlsM1JhQ3hXR3dtREJvYWFMTXRveHhvR1pZemxnRSJdLCJib3hQdWIiOiJQY0FVRkVPRlBvYWFwLzhRRDE3LzJDUVlIN2htQmg4Ty9vSTZqYndSN3hJPSIsImlzcyI6ImRpZDpldGhyOjB4OTQzODQwOTcwODY0NmIxMGNmOGIxOTI5Y2Y3Y2RhM2FiY2I4MTIxMSJ9'
const RESPONSE_OBJ = {
  id: REQUEST_ID,
  payload: RESPONSE_JWT,
}
const REQUEST_JWT =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NkstUiJ9.eyJpYXQiOjE1NTk1OTU3NDQsImV4cCI6MTU1OTU5NjM0NCwicGVybWlzc2lvbnMiOlsibm90aWZpY2F0aW9ucyJdLCJjYWxsYmFjayI6Imh0dHBzOi8vYXBpLnVwb3J0Lm1lL2NoYXNxdWkvdG9waWMvTEFaLWVMU2JQTGdDNzlXc2F2RXpEQSIsInR5cGUiOiJzaGFyZVJlcSIsImlzcyI6ImRpZDpldGhyOjB4OTU4ZTZlODQ1ZDMxMTFiZTUwNDY1NzFlM2M4NDBiMWQ0MTY4MGMzMyJ9'

let sendAndNotify, isMessageServerCallback, URIHandlerSend, getResponse, close, qrSend, qrChasquiSend

describe('BrowserTransport', () => {
  before(() => {
    sendAndNotify = sinon.stub(push, 'sendAndNotify')
    isMessageServerCallback = sinon.stub(messageServer, 'isMessageServerCallback')
    URIHandlerSend = sinon.stub(messageServer, 'URIHandlerSend')
    getResponse = sinon.stub(url, 'getResponse')
    close = sinon.stub(ui, 'close')
    qrSend = sinon.stub(qr, 'send')
    qrChasquiSend = sinon.stub(qr, 'chasquiSend')
  })

  after(() => {
    sendAndNotify.restore()
    isMessageServerCallback.restore()
    URIHandlerSend.restore()
    getResponse.restore()
    close.restore()
    qrSend.restore()
    qrChasquiSend.restore()
  })

  beforeEach(() => {
    global.window = {
      location: {
        hash: '',
      },
    }

    global.navigator = undefined

    sendAndNotify.reset()
    isMessageServerCallback.reset()
    URIHandlerSend.reset()
    getResponse.reset()
    close.reset()
    qrSend.reset()
    qrChasquiSend.reset()
  })

  const setMobile = () => {
    global.navigator = {
      userAgent: MOBILE_USER_AGENT,
    }
  }

  describe('Constructor', () => {
    it('sets defaults', () => {
      const transport = new BrowserTransport()
      const pushInfo = transport.getPushInfo()
      expect(pushInfo).to.have.property('pushToken', null)
      expect(pushInfo).to.have.property('publicEncKey', null)
      expect(transport.qrTitle).to.be.equal('')
    })

    it('can be configured with a custom qr title', () => {
      const transport = new BrowserTransport({ qrTitle: QR_TITLE })
      expect(transport.qrTitle).to.be.equal(QR_TITLE)
    })

    it('can be configured with data to set up a push transport', () => {
      const transport = new BrowserTransport({ pushToken: PUSH_TOKEN, publicEncKey: PUB_ENC_KEY })
      const pushInfo = transport.getPushInfo()
      expect(pushInfo).to.have.property('pushToken', PUSH_TOKEN)
      expect(pushInfo).to.have.property('publicEncKey', PUB_ENC_KEY)
    })
  })

  describe('getCallbackUrl', () => {
    it('calls paramsToUrlFragment if on mobile', () => {
      setMobile()
      const paramsToUrlFragment = sinon.stub(messageUtil, 'paramsToUrlFragment')
      const transport = new BrowserTransport()
      transport.getCallbackUrl(REQUEST_ID)
      expect(paramsToUrlFragment.called).to.be.true
    })

    it('calls messageServer.genCallback if not on mobile', () => {
      const genCallback = sinon.stub(messageServer, 'genCallback')
      const transport = new BrowserTransport()
      transport.getCallbackUrl(REQUEST_ID)
      expect(genCallback.called).to.be.true
    })
  })

  describe('setPushInfo', () => {
    it('sets up a push transport if pushToken and publicEncKey are provided', () => {
      const transport = new BrowserTransport()
      transport.setPushInfo(PUSH_TOKEN, PUB_ENC_KEY)
      expect(sendAndNotify.called).to.be.true
    })

    it('does not set up a push transport if pushToken or publicEncKey are missing', () => {
      const transport = new BrowserTransport()
      transport.setPushInfo(PUSH_TOKEN, null)
      expect(sendAndNotify.called).to.be.false
      transport.setPushInfo(null, PUB_ENC_KEY)
      expect(sendAndNotify.called).to.be.false
    })
  })

  describe('onResponse', () => {
    it('resolves a response that was encoded in the url on instantiation', async () => {
      getResponse.returns(RESPONSE_OBJ)
      const transport = new BrowserTransport()
      const response = await transport.onResponse(REQUEST_ID)
      expect(response.payload).to.be.equal(RESPONSE_JWT)
    })

    it('resolves a response once if no callback is provided', async () => {
      const transport = new BrowserTransport()
      const responsePromise = transport.onResponse(REQUEST_ID)
      PubSub.publish(REQUEST_ID, RESPONSE_OBJ)
      const response = await responsePromise
      expect(response.payload).to.be.equal(RESPONSE_JWT)
    })
  })

  describe('send', () => {
    it('throws an error if called without an id', () => {
      const transport = new BrowserTransport()
      expect(() => {
        transport.send(REQUEST_JWT, null)
      }).to.throw()
    })

    it('uses mobileTransport if on mobile', () => {
      setMobile()
      const transport = new BrowserTransport()
      const mobileSend = sinon.stub(transport, 'mobileSend')
      transport.send(REQUEST_JWT, REQUEST_ID)
      expect(mobileSend.called).to.be.true
    })

    it('uses pushTransport if not on mobile and push is configured', () => {
      sendAndNotify.returns(() => {})
      const transport = new BrowserTransport({
        pushToken: PUSH_TOKEN,
        publicEncKey: PUB_ENC_KEY,
      })
      const pushSend = sinon.stub(transport, 'pushSend')
      transport.send(REQUEST_JWT, REQUEST_ID)
      expect(pushSend.called).to.be.true
    })

    it('uses qrTransport if not on mobile and push is not configured', () => {
      const transport = new BrowserTransport()
      const qrSend = sinon.stub(transport, 'qrSend')
      transport.send(REQUEST_JWT, REQUEST_ID)
      expect(qrSend.called).to.be.true
    })
  })

  describe('mobileSend', () => {
    it('calls a transport function created by url.send', () => {
      const spy = sinon.spy()
      const send = sinon.stub(url, 'send').returns(spy)
      const transport = new BrowserTransport()
      transport.mobileSend(REQUEST_JWT, REQUEST_ID)
      expect(send.called).to.be.true
      expect(spy.called).to.be.true
    })
  })

  describe('pushSend', () => {
    it('throws an error if push is not configured', () => {
      const transport = new BrowserTransport()
      expect(() => {
        transport.pushSend(REQUEST_JWT, REQUEST_ID)
      }).to.throw()
    })

    describe('called with request that does not have a chasqui callback', () => {
      it('uses the push request transport without chasqui response', () => {
        const spy = sinon.spy()
        isMessageServerCallback.returns(false)
        sendAndNotify.returns(spy)
        const transport = new BrowserTransport({
          pushToken: PUSH_TOKEN,
          publicEncKey: PUB_ENC_KEY,
        })
        transport.pushSend(REQUEST_JWT, REQUEST_ID)
        expect(URIHandlerSend.called).to.be.false
        expect(spy.called).to.be.true
      })
    })

    describe('called with request that has a chasqui callback', () => {
      beforeEach(() => {
        isMessageServerCallback.returns(true)
        sendAndNotify.returns(() => {})
        URIHandlerSend.returns(
          () =>
            new Promise(resolve => {
              resolve(RESPONSE_JWT)
            }),
        )
      })

      it('wraps the push request transport in a chasqui response transport', () => {
        const transport = new BrowserTransport({
          pushToken: PUSH_TOKEN,
          publicEncKey: PUB_ENC_KEY,
        })
        transport.pushSend(REQUEST_JWT, REQUEST_ID)
        expect(URIHandlerSend.called).to.be.true
      })

      it('publishes the data and closes the modal after receiving a response', done => {
        const publish = sinon.spy(PubSub, 'publish')
        const transport = new BrowserTransport({
          pushToken: PUSH_TOKEN,
          publicEncKey: PUB_ENC_KEY,
        })
        transport.pushSend(REQUEST_JWT, REQUEST_ID)
        setTimeout(() => {
          expect(close.called).to.be.true
          expect(publish.called).to.be.true
          expect(publish.getCall(0).args[0]).to.be.equal(REQUEST_ID)
          expect(publish.getCall(0).args[1].payload).to.be.equal(RESPONSE_JWT)
          publish.restore()
          done()
        })
      })

      it('publishes an error', done => {
        URIHandlerSend.returns(
          () =>
            new Promise((resolve, reject) => {
              reject(new Error())
            }),
        )
        const publish = sinon.spy(PubSub, 'publish')
        const transport = new BrowserTransport({
          pushToken: PUSH_TOKEN,
          publicEncKey: PUB_ENC_KEY,
        })
        transport.pushSend(REQUEST_JWT, REQUEST_ID)
        setTimeout(() => {
          expect(close.called).to.be.true
          expect(publish.called).to.be.true
          expect(publish.getCall(0).args[0]).to.be.equal(REQUEST_ID)
          expect(publish.getCall(0).args[1].error).to.be.not.null
          publish.restore()
          done()
        })
      })
    })
  })

  describe('qrSend', () => {
    describe('called with request that does not have a chasqui callback', () => {
      it('uses the qr request transport', () => {
        const spy = sinon.spy()
        qrSend.returns(spy)
        isMessageServerCallback.returns(false)
        const transport = new BrowserTransport()
        transport.qrSend(REQUEST_JWT, REQUEST_ID)
        expect(qrSend.called).to.be.true
        expect(spy.called).to.be.true
      })
    })

    describe('called with request that has chasqui callback', () => {
      beforeEach(() => {
        isMessageServerCallback.returns(true)
      })

      it('uses the qr request and chasqui response transport', () => {
        const stub = sinon.stub().returns(new Promise(resolve => resolve(RESPONSE_OBJ)))
        qrChasquiSend.returns(stub)
        const transport = new BrowserTransport()
        transport.qrSend(REQUEST_JWT, REQUEST_ID)
        expect(qrChasquiSend.called).to.be.true
        expect(qrChasquiSend.getCall(0).args[0].displayText).to.be.equal(transport.qrTitle)
        expect(stub.called).to.be.true
        expect(stub.getCall(0).args[0]).to.be.equal(REQUEST_JWT)
      })

      it('publishes the data after receiving a response', done => {
        qrChasquiSend.returns(() => new Promise(resolve => resolve(RESPONSE_OBJ)))
        const publish = sinon.spy(PubSub, 'publish')
        const transport = new BrowserTransport()
        transport.qrSend(REQUEST_JWT, REQUEST_ID)
        setTimeout(() => {
          expect(publish.called).to.be.true
          expect(publish.getCall(0).args[0]).to.be.equal(REQUEST_ID)
          expect(publish.getCall(0).args[1].payload).to.be.equal(RESPONSE_JWT)
          publish.restore()
          done()
        })
      })

      it('publishes an error', done => {
        qrChasquiSend.returns(() => new Promise((resolve, reject) => reject(new Error())))
        const publish = sinon.spy(PubSub, 'publish')
        const transport = new BrowserTransport()
        transport.qrSend(REQUEST_JWT, REQUEST_ID)
        setTimeout(() => {
          expect(publish.called).to.be.true
          expect(publish.getCall(0).args[0]).to.be.equal(REQUEST_ID)
          expect(publish.getCall(0).args[1].error).to.be.not.null
          publish.restore()
          done()
        })
      })
    })
  })
})
