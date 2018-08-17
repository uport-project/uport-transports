# uPort Transports

[![Join the chat at](https://img.shields.io/badge/Riot-Join%20chat-green.svg)](https://chat.uport.me/#/login)
[![npm](https://img.shields.io/npm/dt/uport-transports.svg)](https://www.npmjs.com/package/uport-transports)
[![npm](https://img.shields.io/npm/v/uport-transports.svg)](https://www.npmjs.com/package/uport-transports)
[![Twitter Follow](https://img.shields.io/twitter/follow/uport_me.svg?style=social&label=Follow)](https://twitter.com/uport_me)

[Introduction](#introduction) | [Quick Start](#quick-start) | [Modules](docs/guides/modules.md#modules) | [Development Guide](#development-guide)

:bangbang: :warning: Transport modules rely on a spec change that is yet to be released in the uPort mobile app. Until the new mobile app is released, integrating the transport modules is not fully supported. Once it is fully supported, we will remove this message.

## <a name="introduction"></a> Introduction

For more information about uPort visit both [uport.me](https://www.uport.me) and the [developer docs site](http://developer.uport.me) for more information on our platform and other libraries.

`uport-transports` is a loosely coupled collection of functions and modules to use for building on and interacting with the uPort platform. If you are looking for quick start integration you will likely be better served by using both [uport-connect](https://github.com/uport-project/uport-connect) and [uport-credentials](https://github.com/uport-project/uport-credentials). But if you are looking for a deeper understanding or integration, customizing functionality for the other libraries or building your own libraries on the uPort platform, then you may want to use what is provided here.

For any questions or library support reach out to the [uPort team on Riot](https://chat.uport.me/#/login) or create a [Github issue](https://github.com/uport-project/uport-transports/issues).

### <a name="quick-start"></a> Quick Start

Install through npm:

```shell
npm install uport-transports
```
Import specific modules:

```javascript
import { transport, message, crypto } from 'uport-transports'
```

## <a name="development-guide"></a> Development Guide

#### Run Locally

Download this repo or your fork, then run `npm install`.

#### <a name="build"></a> Builds

All builds are created from files in `/src`

To transpile to ES5. All files are output to `/lib`. The entry of our npm package is `/lib/index.js`

```shell
$ npm run build:es5
```

To generate a bundle/distributable. We use webpack for our builds. The output dist is `/dist/uport-transports.js` and source map `/dist/uport-transports.map.js`

```shell
$ npm run build:dist
```

#### <a name="test"></a> Tests

We write our tests using [mocha](http://mochajs.org), [chai](http://chaijs.com) and [sinon](http://sinonjs.org).

To run our tests:

```shell
$ npm run test
```
