/* eslint-disable no-unused-expressions */
/* global describe, it, beforeEach */
import { expect } from 'chai'
import sinon from 'sinon'

import BrowserTransport from '../src/BrowserTransport'
import * as messageUtil from '../src/message/util'
import { messageServer, push } from '../src/transport'

const MOBILE_USER_AGENT =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1 Mobile/15E148 Safari/604.1'
const QR_TITLE = 'qr title'
const REQUEST_ID = 'testRequest'
const PUSH_TOKEN =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NkstUiJ9.eyJpYXQiOjE1NTg0NjMwNDMsImV4cCI6MTU4OTk5OTA0MywiYXVkIjoiZGlkOmV0aHI6MHhjYmE5NmQ5NjQ2ZjAyMjI2NDM0MjY2YjlmYjg1OWI5YzViNmYzYTNjIiwidHlwZSI6Im5vdGlmaWNhdGlvbnMiLCJ2YWx1ZSI6ImFybjphd3M6c25zOnVzLXdlc3QtMjoxMTMxOTYyMTY1NTg6ZW5kcG9pbnQvQVBOUy91UG9ydC8zMjA0MmVlYi1lMzg5LTNjZGQtOTQ0Yi1jODk5NzFlYjViOTUiLCJpc3MiOiJkaWQ6ZXRocjoweGVmNDdhNDhkYzczMDdmNTc0Nzc1ZTc0NWNkM2I4ZGJlY2ZiZDA3NmIifQ.waMwhBJ-S_934bi1BsI3nqEenANkikrRn6sEi4z-_1BpqTDXAXjrUkEn5O_QrU2j5yy_ag2bR6j4W32Ek070TwA'
const PUB_ENC_KEY = 'oJTV/XBfg5S3odQTomlgg0WyaNAvB7fHlxfYads1wTA='

beforeEach(() => {
  global.window = {
    location: {
      hash: '',
    },
  }

  global.navigator = undefined
})

const setMobile = _ => {
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
  const sendAndNotify = sinon.stub(push, 'sendAndNotify')

  beforeEach(() => {
    sendAndNotify.reset()
  })

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
  it('resolves a response that was encoded in the url on instantiation', () => {
    // instantiate with no args
    // set onLoadUrlResponse
    // call onResponse
    // check promise resolves to onLoadUrlResponse object
    // check onLoadUrlResponse set to null
  })

  it('resolves a response once if no callback is provided', () => {
    // instantiate with no args
    // call onResponse with id
    // publish to id
    // check promise returned by onResponse resolves
    // check PubSub.unsubscribe called with id
  })

  it('executes multiple times if a callback is provided', () => {
    // instantiate with no args
    // call onResponse with id and cb
    // publish to id
    // check cb called
    // publish to id
    // check cb called again
  })
})

describe('send', () => {
  it('throws an error if called without an id', () => {
    // instantiate with no args
    // call send with no args
    // check error is thrown
  })

  it('uses mobileTransport if on mobile', () => {
    // instantiate with no args
    // set isMobile = true
    // mock mobileTransport
    // call send
    // check mobileTransport called
  })

  it('uses pushTransport if not on mobile and push is configured', () => {
    // instantiate with pushToken and publicEncKey options
    // set isMobile = false
    // mock pushTransport
    // call send
    // check pushTransport called
  })

  it('uses qrTransport if not on mobile and push is not configured', () => {
    // instantiate with no args
    // set isMobile = false
    // mock qrTransport
    // call send
    // check qrTransport called
  })
})

describe('mobileSend', () => {
  it('calls a transport function created by url.send', () => {
    // instantiate with no args
    // call mobileTransport
    // check url.send is called
    // check function returned by url.send is called with the request
  })
})

describe('pushSend', () => {
  it('throws an error if push is not configured', () => {
    // instantiate with no args
    // call pushTransport
    // check error is thrown
  })

  describe('called with request that does not have a chasqui callback', () => {
    it('uses the push request transport', () => {
      // instantiate with pushToken and publicEncKey options
      // mock sendPush
      // mock messageServer.isMessageServerCallback to return false
      // call pushTransport
      // check sendPush called with request
    })
  })

  describe('called with request that has a chasqui callback', () => {
    beforeEach(() => {
      // instantiate with pushToken and publicEncKey options
      // mock sendPush
      // mock PubSub
      // mock messageServer.isMessageServerCallback to return true
      // mock messageServer.URIHandlerSend to return function that takes a request and returns a promise
      // mock ui.close
      // call pushTransport
    })

    it('wraps the push request transport in a chasqui response transport', () => {
      // check messageServer.URIHandlerSend call with this.sendPush
      // check function returned by messageServer.URIHandlerSend is called with the request
    })

    it('publishes the data and closes the modal after receiving a response', () => {
      // resolve the promise returned by the response transport
      // check ui.close called
      // check PubSub.publish called with response and original id
    })
  })
})

describe('qrSend', () => {
  describe('called with request that does not have a chasqui callback', () => {
    it('uses the qr request transport', () => {
      // instantiate with no args
      // mock messageServer.isMessageServerCallback to return false
      // call qrTransport
      // check qr.send called with appName
      // check function returned by ap.send called with request
    })
  })

  describe('called with request that has chasqui callback', () => {
    beforeEach(() => {
      // instantiate with no args
      // mock qr.chasquiSend to return function that takes a request and returns a promise
      // call qrTransport
    })

    it('uses the qr request and chasqui response transport', () => {
      // check qr.chasquiSend called with appName
      // check function returned by qr.chasquiSend called with request
    })

    it('publishes the data after receiving a response', () => {
      // resolve the promise
      // check PubSub.publish is called with response and original id
    })
  })
})
