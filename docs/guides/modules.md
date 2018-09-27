---
title: "Transports Guide"
category: "uport-transports"
type: "guide"
index: 1
source: "https://github.com/uport-project/uport-transports/blob/develop/docs/guides/modules.md"
---
# <a name="transport-guide"></a> uPort Transports Guide

The `uport-transports` library consists of a loosely coupled collection of functions called transports used to set up communication channels between an application and a uPort client; additionally, several useful utility functions are also available in this library. Transports are functions that consume request messages and additional transport params, before sending these request strings to a uPort client. Some transports will also manage to receive a response to a given request. Many of these functions can be combined to create transports specific to your use case and environment. You can then use these transports in [uport-connect](https://github.com/uport-project/uport-connect) or use them in combination with message creation in [uport-credentials](https://github.com/uport-project/uport-credentials). If you are looking for a quick start integration, you will likely be better served by using the default transports  through [uport-connect](https://github.com/uport-project/uport-connect).

## Request Transports

 Currently, there are three primary transports for handling requests:

- **QR Codes:** Messages are sent in a QR code to the mobile app client. You can use our default modal and flow here or configure your own QR codes. You can use our messaging server, `Chasqui`, to receive responses or have responses returned to your own server.

- **URL Passing:** When a uPort client and app are on the same mobile device, requests and responses are passed through URLs. Messages are sent in a URL and requests are returned in a URL which is parsed and returned.

- **Push Notifications:** Messages are encrypted and sent to a uPort client through a push notification, using a push notification service provided by uPort.

## Response Transports

There are two primary transports for handling responses; alternatively, you may receive responses at a callback on your own server:

- **URL Passing:** Response is passed through a URL and parsed. Helper functions for parsing are provided, as well as different listeners to receive the response.

- **Message Server:** Response is relayed and fetched through a message server. You can run your own message server, or you can use Chasqui by default, a message server service provided by uPort.

Besides the primary transports provided, there are several smaller composable functions available to build your own transports based on your needs. As we collectively build more transports for differing communication channels and differing uPort clients, they will be added to `uport-transports`.

## <a name="quick-start"></a> Quick Start

Install through npm:

```shell
npm install uport-transports
```
Import specific modules. You will primarily use transport. Message and crypto include utility functions for handling, parsing, encrypting, and decrypting messages for transports.

```javascript
import { transport, message, crypto } from 'uport-transports'
```
To send a request in our default QR code modal:

```javascript
const request = `eyJ0eXAiOiJKV1QiLCJhbG...`
const transportQR = transport.qr.send()
transportQR(request)
```

To send a request in our default QR code modal and use the message server transport and chasqui (the message server service provided by uPort) to get the response. This transport combines the QR send transport along with the message server tranport which handles responses. This assumes that chasqui was set as a callback in the request token. You can get a chasqui callback with utility function `transport.messageServer.genCallback()`

```javascript
const request = `eyJ0eXAiOiJKV1QiLCJhbG...`
const transportQRChasqui = transport.qr.chasquiSend()
transportQRChasqui(request).then(response => {
  // response to request returned here
})
```

To send a request in push notification. You can get a pushToken and pubEncKey for a user by requesting push notification permissions in a selective disclosure request. If the user accepts, these two values can be found in the response returned. You can handle the response as you want and specify or you can combine this with the message server transport to handle the response.

```javascript
const request = `eyJ0eXAiOiJKV1QiLCJhbG...`
const pushTransport = transport.push.send(pushToken, pubEncKey)
pushTransport(request)
```
To send the request through a URL when on the same mobile device as uPort app, whether from a mobile browser or a mobile application. Transport adds necessary params for sending and handling response and then opens the request URL.

```javascript
const request = `eyJ0eXAiOiJKV1QiLCJhbG...`
const urlTransport = transport.url.send()
urlTransport(request)
```
To the get a response from a url:

```javascript
const response = tranport.url.getResponse()
```

Or listen for a URL response:
```javascript
tranport.url.onResponse().then(res => {
  const payload = res.payload
  const id = res.id
  ...
})
```
