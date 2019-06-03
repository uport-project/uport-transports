/* global describe, it, beforeEach */

describe('Constructor', () => {
  it('sets defaults', () => {
    // instantiate with no args
    // check appName = 'my-uport-app'
    // check sendPush = null
  })

  it('can be configured with an app name', () => {
    // instantiate with custom app name
    // check appName = custom app name
  })

  it('can be configured with data to set up a push transport', () => {
    // instantiate with pushToken and publicEncKey options
    // check sendPush is a function
  })

  it('checks the current url for a response message', () => {
    // intantiate with no args
    // check url.getResponse called
  })
})

describe('getCallbackUrl', () => {
  it('calls paramsToUrlFragment if on mobile', () => {
    // instantiate with no args
    // mock navigator so mobile is true
    // spy paramsToUrlFragment
    // check called once
  })

  it('calls messageServer.genCallback if not on mobile', () => {
    // instantiate with no args
    // mock navigator so mobile is false
    // spy messageServer.genCallback
    // check called once
  })
})

describe('setPushInfo', () => {
  it('sets up a push transport if pushToken and publicEncKey are provided', () => {
    // instantiate with no args
    // call setPushInfo with args
    // check push.sendAndNotify is called with pushToken and publicEncKey
    // check sendPush is a function
  })

  it('removes the push transport if only pushToken is provided', () => {
    // instantiate with pushToken and publicEncKey options
    // call setPushInfo with pushToken
    // check sendPush is null
  })

  it('removes the push transport if only publicEncKey is provided', () => {
    // instantiate with pushToken and publicEncKey options
    // call setPushInfo with publicEncKey
    // check sendPush is null
  })

  it('removes the push transport if no args are provided', () => {
    // instantiate with pushToken and publicEncKey options
    // call setPushInfo with no args
    // check sendPush is null
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
