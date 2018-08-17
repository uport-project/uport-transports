---
title: "Uport Transports"
index: 5
category: "guides"
type: "content"
---


## <a name="modules"></a> Modules

##### Transport

Transports deal with sending messages to and from uPort clients, and generally setting up communication channels. Most often this involves sending messages to and from the uPort mobile app. At this time there are three primary transports:

- **QR Codes:** Messages are sent in a QR code to the mobile app client. You can use our default modal and flow here or configure your own QR codes. You can use our messaging server `Chasqui` to receive responses our have response returned to your own server.

- **URL Passing:** Messages are sent in a QR code to the mobile app client. You can use our default modal and flow here or configure your own QR codes. You can use our messaging server `Chasqui` to receive responses our have response returned to your own server.

- **Push Notifications:** Messages are sent in a QR code to the mobile app client. You can use our default modal and flow here or configure your own QR codes. You can use our messaging server `Chasqui` to receive responses our have response returned to your own server.

Beside the primary transports provided there is a number of smaller composable functions available to build your own transports for different needs. As we (and the community) build more transports for differing communication channels and differing uPort clients we will add them here.

##### Message

Only contains util functions at this time that help with adding params to request URIs. May contain other functions related to creating and parsing messages on our platform.

##### Crypto

Only contains `encryptMessage()` at this time, which is used for push notifications. May include a collection of other commonly used crypto functions in the future.

### Module Outline

#### `Transport`

- ##### QR

    - `uport.transport.qr.send()`
    - `uport.transport.qr.chasquiSend()`
    - `uport.transport.qr.open()`
    - `uport.transport.qr.close()`
    - `uport.transport.qr.getImageDataURI()`
    - `uport.transport.qr.modalTemplate()`

- ##### URL

    - `uport.transport.url.send()`
    - `uport.transport.url.getResponse()`
    - `uport.transport.url.listenResponse()`
    - `uport.transport.url.onResponse()`

- ##### Push Notifications

    - `uport.transport.push.send()`

- ##### Chasqui / Message server

    - `uport.transport.messageServer.URIHandlerSend()`
    - `uport.transport.messageServer.poll()`
    - `uport.transport.messageServer.clearResponse()`

- ##### Poll

    - `uport.transport.poll()`

#### `Message`

  - ##### Util

    - `uport.message.util.paramsToUrlFragment()`
    - `uport.messasge.util.paramsToQueryString()`

#### `Crypto`

  - `uport.crypto.encryptMessage()`
  - `uport.crypto.randomString()`

#### `Provider`

  - `uport.provider()`

#### `Network`

  - ##### Config

    - `uport.network.config.network()`
    - `uport.network.config.networkSet()`
    - `uport.network.config.networkToNetworkSet()`

  - ##### Defaults

    - `uport.network.default.networks`
    - `uport.network.default.NETWORK`
