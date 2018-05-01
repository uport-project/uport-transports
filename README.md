# uPort Core JS

[![Join the chat at](https://img.shields.io/badge/Riot-Join%20chat-green.svg)](https://chat.uport.me/#/login)
[![npm](https://img.shields.io/npm/dt/uport-core.svg)](https://www.npmjs.com/package/uport-core)
[![npm](https://img.shields.io/npm/v/uport-core.svg)](https://www.npmjs.com/package/uport-core)
[![Twitter Follow](https://img.shields.io/twitter/follow/uport_me.svg?style=social&label=Follow)](https://twitter.com/uport_me)

[Introduction](#introduction) | [Quick Start](#quick-start) | [Modules](#modules) | [Development Guide](#development-guide)

:bangbang: :warning: Transport modules rely on a spec change that is yet to be released in an external release of the mobile app. But it will be released soon and this message removed at that time. Until then, integrating the transport modules is not fully supported.

## <a name="introduction"></a> Introduction

For more information about uPort visit both [uport.me](https://www.uport.me) and the [developer docs site](http://developer.uport.me) for more information on our platform and other libraries.

`uport-core` is a loosely coupled collection of functions and modules to use for building on and interacting with the uPort platform. If you are looking for quick start integration you will likely be better served by using both [uport-connect](https://github.com/uport-project/uport-connect) and [uport-js](https://github.com/uport-project/uport-js). But if you are looking for a deeper understanding or integration, customizing functionality for the other libraries or building your own libraries on the uPort platform, then you may want to use what is provided here. At this time `uport-core-js` mostly consists of `transports`, but may be home to other modules in the future.

For any questions or library support reach out to the [uPort team on Riot](https://chat.uport.me/#/login) or create a [Github issue](https://github.com/uport-project/uport-core-js/issues).

### <a name="quick-start"></a> Quick Start

Install through npm:

```shell
npm install uport-core
```
Import specific modules:

```javascript
import { transport, message, crypto } from 'uport-core'
```

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

- ##### Chasqui

    - `uport.transport.chasqui.URIHandlerSend()`
    - `uport.transport.chasqui.poll()`
    - `uport.transport.chasqui.clearResponse()`

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

## <a name="development-guide"></a> Development Guide

#### Run Locally

Download this repo or your fork, then run `npm install`.

#### <a name="build"></a> Builds

All builds are created from files in `/src`

To transpile to ES5. All files are output to `/lib`. The entry of our npm package is `/lib/index.js`

```shell
$ npm run build:es5
```

To generate a bundle/distributable. We use webpack for our builds. The output dist is `/dist/uport-core.js` and source map `/dist/uport-core.map.js`

```shell
$ npm run build:dist
```

#### <a name="test"></a> Tests

We write our tests using [mocha](http://mochajs.org), [chai](http://chaijs.com) and [sinon](http://sinonjs.org).

To run our tests:

```shell
$ npm run test
```
