---
title: "Library Reference"
index: 10
category: "uport-transports"
type: "reference"
source: "https://github.com/uport-project/uport-transports/blob/develop/docs/reference/index.md"
---

## Modules

<dl>
<dt><a href="#module_uport-transports/transport/ui">uport-transports/transport/ui</a></dt>
<dd><p>A set of UI utility functions and default displays for bridging between
a web browser and a uPort user&#39;s mobile app</p>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#uportModal">uportModal</a> ⇒ <code>String</code></dt>
<dd><p>Skeleton for a modal popup, styled with CSS imported from &#39;./style.css&#39;</p>
</dd>
<dt><a href="#qrModal">qrModal</a> ⇒ <code>Object</code></dt>
<dd><p>Format a modal with a QR code and a custom message, as well as links to
the uport mobile app on the App Store and Play Store</p>
</dd>
<dt><a href="#pushModal">pushModal</a></dt>
<dd><p>HTML string for a modal notifying a user that a push notification has been
sent to their phone</p>
</dd>
<dt><a href="#successModal">successModal</a></dt>
<dd><p>HTML string for a modal displaying a success message</p>
</dd>
<dt><a href="#failureModal">failureModal</a></dt>
<dd><p>HTML string for a modal displaying a failure message
!! Not used</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#randomString">randomString(length)</a> ⇒ <code>String</code></dt>
<dd><p>Given a length, returns a random string of that length</p>
</dd>
<dt><a href="#decryptResponse">decryptResponse(encrypted, secretKey)</a> ⇒ <code>Promise.&lt;Object, Error&gt;</code></dt>
<dd><p>Decrypts a response from a promise. This is meant to be used to wrap the response from Chasqui or other transport</p>
</dd>
<dt><a href="#URIHandlerSend">URIHandlerSend(uriHandler, [config], message)</a> ⇒ <code>function</code> | <code>Promise.&lt;Object, Error&gt;</code></dt>
<dd><p>A general Chasqui Transport. Allows you to configure the transport with any uriHandler for the request,
 while the response will always be returned through Chasqui. Chasqui is a simple messaging server that
 allows responses to be relayed from a uPort client to the original callee.</p>
</dd>
<dt><a href="#poll">poll(url, [pollingInterval], [cancelled])</a> ⇒ <code>Promise.&lt;Object, Error&gt;</code></dt>
<dd><p>A polling function specifically for polling Chasqui.</p>
</dd>
<dt><a href="#poll">poll(url, messageParse, errorParse, [pollingInterval], [cancelled])</a> ⇒ <code>Promise.&lt;Object, Error&gt;</code></dt>
<dd><p>A general polling function. Polls a given URL and parse message according to given parsing functions, promise resolves on response or error.</p>
</dd>
<dt><a href="#send">send(token, pubEncKey, [pushServiceUrl], message, [opts])</a> ⇒ <code>function</code> | <code>Promise.&lt;Object, Error&gt;</code></dt>
<dd><p>A push notification transport for pushing requests to the uPort mobile client of a specific user
 for which you have been given a valid push token.</p>
</dd>
<dt><a href="#sendAndNotify">sendAndNotify()</a></dt>
<dd><p>The same transport as above, but also display a self-dismissing modal notifying
the user that push notification has been sent to their device</p>
</dd>
<dt><a href="#send">send(displayText, message, [opts])</a> ⇒ <code>function</code> | <code>function</code></dt>
<dd><p>A QR tranpsort which uses our provided QR modal to relay a request to a uPort client,
optionally compressing the provided message if a compress function is provided</p>
</dd>
<dt><a href="#chasquiCompress">chasquiCompress(message, threshold)</a> ⇒ <code>String</code></dt>
<dd><p>A utility function for reducing the size of a QR code by uploading it to chasqui and
replacing the contents with the topic url.</p>
<p>An empty Verification JWT (i.e. with signature and sub/iss but blank claim) is ~250 characters
The absolute max that can fit in a scanable QR on the screen is ~1500 characters
Below 650 characters the QR modal fits perfectly in the browser on a 13&quot; MBP, with some wiggle room</p>
</dd>
<dt><a href="#chasquiSend">chasquiSend([config], message)</a> ⇒ <code>function</code> | <code>Promise.&lt;Object, Error&gt;</code></dt>
<dd><p>A QR Code and Chasqui Transport. The QR modal is configured for tranporting the request, while the
 response will be returned through Chasqui.</p>
</dd>
<dt><a href="#send">send([config], uriHandler, message, [opts])</a> ⇒ <code>function</code></dt>
<dd><p>A mobile transport for handling and configuring requests which are sent from a mobile browser to a uport client, in this case the uPort mobile app.</p>
</dd>
<dt><a href="#getResponse">getResponse()</a> ⇒ <code>Object</code></dt>
<dd><p>A function to fetch a response from hash params appended to callback URL, if available when the function is called.</p>
</dd>
<dt><a href="#listenResponse">listenResponse(cb)</a></dt>
<dd><p>A listener which calls given callback when a response becomes avaialble in the hash params (URL fragment)</p>
</dd>
<dt><a href="#onResponse">onResponse()</a> ⇒ <code>Promise.&lt;Object, Error&gt;</code></dt>
<dd><p>A promise which resolves once a response become available in the hash params (URL fragment)</p>
</dd>
<dt><a href="#parseResponse">parseResponse()</a> ⇒ <code>Object</code></dt>
<dd><p>Parses response from full response URL or hash param string</p>
</dd>
<dt><a href="#paramsToUrlFragment">paramsToUrlFragment(url, [params])</a> ⇒ <code>String</code></dt>
<dd><p>Add params as URL fragment (hash params)</p>
</dd>
<dt><a href="#paramsToQueryString">paramsToQueryString(url, [params])</a> ⇒ <code>String</code></dt>
<dd><p>Add params as URL query params</p>
</dd>
<dt><a href="#getUrlQueryParams">getUrlQueryParams(url)</a> ⇒ <code>Object</code></dt>
<dd><p>Returns params object of query params in a given URL</p>
</dd>
<dt><a href="#getURLJWT">getURLJWT(url)</a> ⇒ <code>String</code></dt>
<dd><p>Returns request token (JWT) from a request URI</p>
</dd>
<dt><a href="#isJWT">isJWT(jwt)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Given string, returns boolean if string is JWT</p>
</dd>
<dt><a href="#messageToUniversalURI">messageToUniversalURI(message)</a> ⇒ <code>String</code></dt>
<dd><p>Wrap a JWT in a request URI using the Universal Link scheme based at id.uport.me</p>
</dd>
<dt><a href="#messageToDeeplinkURI">messageToDeeplinkURI(message, uri)</a></dt>
<dd><p>Wrap a JWT in a request URI using the Deeplink scheme, using me.uport:</p>
</dd>
<dt><a href="#messageToURI">messageToURI(message)</a> ⇒ <code>Staring</code></dt>
<dd><p>Given token request (JWT), wraps in request URI</p>
</dd>
</dl>

<a name="module_uport-transports/transport/ui"></a>

## uport-transports/transport/ui
A set of UI utility functions and default displays for bridging between
a web browser and a uPort user's mobile app


* [uport-transports/transport/ui](#module_uport-transports/transport/ui)
    * [~getImageDataURI(data)](#module_uport-transports/transport/ui..getImageDataURI) ⇒ <code>String</code>
    * [~close()](#module_uport-transports/transport/ui..close)
    * [~makeModal(content, [close])](#module_uport-transports/transport/ui..makeModal)
    * [~open(data, cancel, modalText)](#module_uport-transports/transport/ui..open)
    * [~notifyPushSent(fallback)](#module_uport-transports/transport/ui..notifyPushSent)
    * [~success()](#module_uport-transports/transport/ui..success)
    * [~failure(resend)](#module_uport-transports/transport/ui..failure)

<a name="module_uport-transports/transport/ui..getImageDataURI"></a>

### uport-transports/transport/ui~getImageDataURI(data) ⇒ <code>String</code>
Given a string of data, it returns a image URI which is a QR code. An image
 URI can be displayed in an img HTML tag by setting the src attrbiute to the
 the image URI.

**Kind**: inner method of <code>[uport-transports/transport/ui](#module_uport-transports/transport/ui)</code>  
**Returns**: <code>String</code> - image URI  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>String</code> | Data string, typically a uPort URI |

<a name="module_uport-transports/transport/ui..close"></a>

### uport-transports/transport/ui~close()
Closes the default QR pop over

**Kind**: inner method of <code>[uport-transports/transport/ui](#module_uport-transports/transport/ui)</code>  
<a name="module_uport-transports/transport/ui..makeModal"></a>

### uport-transports/transport/ui~makeModal(content, [close])
A utility function for rendering a modal with particular content

**Kind**: inner method of <code>[uport-transports/transport/ui](#module_uport-transports/transport/ui)</code>  

| Param | Type | Description |
| --- | --- | --- |
| content | <code>String</code> | HTML string defining the inside of the modal |
| [close] | <code>function</code> | The handler to fire when the modal's x button is pressed |

<a name="module_uport-transports/transport/ui..open"></a>

### uport-transports/transport/ui~open(data, cancel, modalText)
A default QR pop over display, which injects the neccessary HTML

**Kind**: inner method of <code>[uport-transports/transport/ui](#module_uport-transports/transport/ui)</code>  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>String</code> | Data which is displayed in QR code |
| cancel | <code>function</code> | A function called when the cancel button is clicked |
| modalText | <code>String</code> | Message to be displayed above the QR in the modal |

<a name="module_uport-transports/transport/ui..notifyPushSent"></a>

### uport-transports/transport/ui~notifyPushSent(fallback)
Show a notification to the user that a push has been sent to their phone

**Kind**: inner method of <code>[uport-transports/transport/ui](#module_uport-transports/transport/ui)</code>  

| Param | Type | Description |
| --- | --- | --- |
| fallback | <code>function</code> | The fallback handler if the user doesn't receive a push |

<a name="module_uport-transports/transport/ui..success"></a>

### uport-transports/transport/ui~success()
Show a success screen to the user which automatically dismisses
after 2 seconds

**Kind**: inner method of <code>[uport-transports/transport/ui](#module_uport-transports/transport/ui)</code>  
<a name="module_uport-transports/transport/ui..failure"></a>

### uport-transports/transport/ui~failure(resend)
Show a failure modal that gives users the option to repeat the failed action

**Kind**: inner method of <code>[uport-transports/transport/ui](#module_uport-transports/transport/ui)</code>  

| Param | Type | Description |
| --- | --- | --- |
| resend | <code>function</code> | The function that should fire to allow a user to retry |

<a name="uportModal"></a>

## uportModal ⇒ <code>String</code>
Skeleton for a modal popup, styled with css imported from './style.css'

**Kind**: global constant  
**Returns**: <code>String</code> - HTML string for the populated modal  

| Param | Type | Description |
| --- | --- | --- |
| innerHTML | <code>String</code> | HTML string defining content of modal |

<a name="qrModal"></a>

## qrModal ⇒ <code>Object</code>
Format a modal with a QR code and a custom message, as well as links to
the uPort mobile app on the App Store and Play Store

**Kind**: global constant  
**Returns**: <code>Object</code> - populated modal  

| Param | Type | Description |
| --- | --- | --- |
| qrImageUri | <code>String</code> | Data URI defining the QR code to be displayed |
| [modalText] | <code>String</code> | Message to be displayed above the QR code |

<a name="pushModal"></a>

## pushModal
HTML string for a modal notifying a user that a push notification has been
sent to their phone

**Kind**: global constant  
<a name="successModal"></a>

## successModal
HTML string for a modal displaying a success message

**Kind**: global constant  
<a name="failureModal"></a>

## failureModal
HTML string for a modal displaying a failure message
!! Not used

**Kind**: global constant  
<a name="randomString"></a>

## randomString(length) ⇒ <code>String</code>
Given a length, returns a random string of that length

**Kind**: global function  
**Returns**: <code>String</code> - random string  

| Param | Type | Description |
| --- | --- | --- |
| length | <code>Integer</code> | Specify length of string returned |

<a name="decryptResponse"></a>

## decryptResponse(encrypted, secretKey) ⇒ <code>Promise.&lt;Object, Error&gt;</code>
Decrypts a response from a promise. This is intended to be used to wrap the response from Chasqui or other transport

**Kind**: global function  
**Returns**: <code>Promise.&lt;Object, Error&gt;</code> - a promise which resolves with the decrypted message or rejects with an error  

| Param | Type | Description |
| --- | --- | --- |
| encrypted | <code>Object</code> | The encrypted message object |
| encrypted.version | <code>String</code> | The string `x25519-xsalsa20-poly1305` |
| encrypted.nonce | <code>String</code> | Base64 encoded nonce |
| encrypted.ephemPublicKey | <code>String</code> | Base64 encoded ephemeral public key |
| encrypted.ciphertext | <code>String</code> | Base64 encoded ciphertext |
| secretKey | <code>String</code> | The secret key as a Uint8Array |

<a name="URIHandlerSend"></a>

## URIHandlerSend(uriHandler, [config], message) ⇒ <code>function</code> &#124; <code>Promise.&lt;Object, Error&gt;</code>
A general Chasqui Transport. Allows you to configure the transport with any uriHandler for the request,
 while the response will always be returned through Chasqui. Chasqui is a simple messaging server that
 allows responses to be relayed from a uPort client to the original callee.

**Kind**: global function  
**Returns**: <code>function</code> - a configured QRTransport Function<code>Promise.&lt;Object, Error&gt;</code> - a function to close the QR modal  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| uriHandler | <code>String</code> |  | A function called with the requestURI once it is formatted for this transport |
| [config] | <code>Object</code> | <code>{}</code> | An optional config object |
| [config.chasquiUrl] | <code>String</code> |  | URL of messaging server, defaults to Chasqui instance run by uPort |
| [config.pollingInterval] | <code>String</code> |  | Milisecond interval at which the messaging server will be polled for a response |
| message | <code>String</code> |  | A uPort client request message |

<a name="poll"></a>

## poll(url, [pollingInterval], [cancelled]) ⇒ <code>Promise.&lt;Object, Error&gt;</code>
A polling function specifically for polling Chasqui.

**Kind**: global function  
**Returns**: <code>Promise.&lt;Object, Error&gt;</code> - a promise which resolves with obj/message or rejects with an error  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>String</code> | A Chasqui URL polled |
| [pollingInterval] | <code>Integer</code> | ms interval at which the given url is polled |
| [cancelled] | <code>function</code> | Function which returns boolean, if returns true, polling stops |

<a name="poll"></a>

## poll(url, messageParse, errorParse, [pollingInterval], [cancelled]) ⇒ <code>Promise.&lt;Object, Error&gt;</code>
A general polling function. Polls a given URL and parse message according to a given parsing functions, promise resolves on response or error.

**Kind**: global function  
**Returns**: <code>Promise.&lt;Object, Error&gt;</code> - a promise which resolves with obj/message or rejects with an error  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>String</code> | URL polled |
| messageParse | <code>function</code> | Function that parses response from get request, also determines if response is available to decide to continue polling or not |
| errorParse | <code>function</code> | Function that parses response from get request and determines if error was returned. |
| [pollingInterval] | <code>Integer</code> | ms interval at which the given URL is polled |
| [cancelled] | <code>function</code> | Function which returns Boolean, if returns true, polling stops |

<a name="send"></a>

## send(token, pubEncKey, [pushServiceUrl], message, [opts]) ⇒ <code>function</code> &#124; <code>Promise.&lt;Object, Error&gt;</code>
A push notification transport for pushing requests to the uPort mobile client of a specific user
 for which you have been given a valid push token.

**Kind**: global function  
**Returns**: <code>function</code> - a configured Push transport function<code>Promise.&lt;Object, Error&gt;</code> - a promise which resolves with successful push notification status or rejects with an error  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| token | <code>String</code> |  | A push notification token (get a pn token by requesting push permissions in a request) |
| pubEncKey | <code>String</code> |  | The public encryption key of the receiver, encoded as a base64 string, found in a DID document |
| [pushServiceUrl] | <code>String</code> | <code>PUTUTU_URL</code> | The URL of the push service, by default it is PUTUTU at https://api.uport.me/pututu/sns/ |
| message | <code>String</code> |  | A uPort client request message |
| [opts] | <code>Object</code> | <code>{}</code> | An optional config object |
| opts.type | <code>String</code> |  | Specifies callback type 'post' or 'redirect' for response |
| opts.redirectUrl | <code>String</code> |  | Specifies URL which a uPort client will return to control once the request is handled, depending on request type, it may or may not be returned with the response as well. |

<a name="sendAndNotify"></a>

## sendAndNotify()
The same transport as above, but also display a self-dismissing modal notifying
the user that push notification has been sent to their device.

**Kind**: global function  
**See**: send  
<a name="send"></a>

## send(displayText, message, [opts]) ⇒ <code>function</code> \| <code>function</code>
A QR tranpsort which uses our provided QR modal to relay a request to a uPort client,
optionally compressing the provided message if a compress function is provided

**Kind**: global function  
**Returns**: <code>function</code> - a configured QRTransport Function<code>function</code> - a function to close the QR modal  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| displayText | <code>String</code> |  | dialog used in qr modal display |
| message | <code>String</code> |  | a uport client request message |
| [opts] | <code>Object</code> | <code>{}</code> |  |
| [opts.cancel] | <code>function</code> |  | cancel callback, called on modal close |
| [opts.compress] | <code>function</code> |  | a function to compress a JWT, returning a promise that resolves to a string |

<a name="chasquiCompress"></a>

## chasquiCompress(message, threshold) ⇒ <code>String</code>
A utility function for reducing the size of a QR code by uploading it to chasqui and
replacing the contents with the topic url.

An empty Verification JWT (i.e. with signature and sub/iss but blank claim) is ~250 characters
The absolute max that can fit in a scanable QR on the screen is ~1500 characters
Below 650 characters the QR modal fits perfectly in the browser on a 13" MBP, with some wiggle room

**Kind**: global function  
**Returns**: <code>String</code> - the chasqui url of the message, or the original message if less than threshold  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| message | <code>String</code> |  | the request JWT |
| threshold | <code>Number</code> | <code>650</code> | the smallest size (in string length) to compress |

<a name="chasquiSend"></a>

## chasquiSend([config], message) ⇒ <code>function</code> \| <code>Promise.&lt;Object, Error&gt;</code>
A QR Code and Chasqui Transport. The QR modal is configured for tranporting the request, while the
 response will be returned through Chasqui.

**Kind**: global function  
**Returns**: <code>function</code> - a configured QRTransport Function<code>Promise.&lt;Object, Error&gt;</code> - a function to close the QR modal  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [config] | <code>Object</code> | <code>{}</code> | An optional config object |
| [config.chasquiUrl] | <code>String</code> |  | URL of messaging server, defaults to Chasqui instance run by uPort |
| [config.pollingInterval] | <code>String</code> |  | Milisecond interval at which the messaging server will be polled for a response |
| message | <code>String</code> |  | A uPort client request message |

<a name="send"></a>

## send([config], uriHandler, message, [opts]) ⇒ <code>function</code>
A mobile transport for handling and configuring requests which are sent from a mobile browser to a uPort client, in this case the uPort mobile app.

**Kind**: global function  
**Returns**: <code>function</code> - a configured MobileTransport Function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [config] | <code>Object</code> | <code>{}</code> | an optional config object |
| [config.messageToURI] | <code>function</code> |  | a function called with the message/JWT to format into a URI |
| [config.uriHandler] | <code>function</code> |  | a function called with the requestURI once it is formatted for this transport, default opens URI |
| message | <code>String</code> |  | a uport client request message |
| [opts] | <code>Object</code> | <code>{}</code> | an optional config object |
| opts.id | <code>String</code> |  | an id string for a request, used to identify response once returned |
| opts.data | <code>String</code> |  | additional data specific to your application that you can later receive with the response |
| opts.type | <code>String</code> |  | specifies callback type 'post' or 'redirect' for response |
| opts.callback | <code>String</code> |  | specifies url which a uport client will return to control once request is handled, depending on request type it may or may not be returned with the response as well. |

<a name="getResponse"></a>

## getResponse() ⇒ <code>Object</code>
A function to fetch a response from hash params appended to callback url, if available when function called.

**Kind**: global function  
**Returns**: <code>Object</code> - A response object if repsonse is available, otherwise null.  
<a name="listenResponse"></a>

## listenResponse(cb)
A listener which calls given callback when a response becomes avaialble in the hash params (url fragment)

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| cb | <code>function</code> | A callback function called as cb(err, res) when a response becomes available |

<a name="onResponse"></a>

## onResponse() ⇒ <code>Promise.&lt;Object, Error&gt;</code>
A promise which resolves once a response become available in the hash params (URL fragment)

**Kind**: global function  
**Returns**: <code>Promise.&lt;Object, Error&gt;</code> - a promise which resolves with a response object or rejects with an error.  
<a name="parseResponse"></a>

## parseResponse() ⇒ <code>Object</code>
Parses response from full response URL or hash param string

**Kind**: global function  
**Returns**: <code>Object</code> - a response object of the form {id: ..., payload: ..., data: ...}  
<a name="paramsToUrlFragment"></a>

## paramsToUrlFragment(url, [params]) ⇒ <code>String</code>
Add params as URL fragment (hash params)

**Kind**: global function  
**Returns**: <code>String</code> - a URL with valid params added as url fragment (hash params)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| url | <code>String</code> |  | A URL |
| [params] | <code>Object</code> | <code>{}</code> | Params object of valid params to add as URL fragment |

<a name="paramsToQueryString"></a>

## paramsToQueryString(url, [params]) ⇒ <code>String</code>
Add params as url query params

**Kind**: global function  
**Returns**: <code>String</code> - a URL with valid params added as URL query framents  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| url | <code>String</code> |  | A URL |
| [params] | <code>Object</code> | <code>{}</code> | Params object of valid params to add as URL query params |

<a name="getUrlQueryParams"></a>

## getUrlQueryParams(url) ⇒ <code>Object</code>
Returns params object of query params in given url

**Kind**: global function  
**Returns**: <code>Object</code> - object of param key and values  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>String</code> | A URL |

<a name="getURLJWT"></a>

## getURLJWT(url) ⇒ <code>String</code>
Returns request token (JWT) from a request URI

**Kind**: global function  
**Returns**: <code>String</code> - a JWT string  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>String</code> | A URL |

<a name="isJWT"></a>

## isJWT(jwt) ⇒ <code>Boolean</code>
Given string, returns boolean if string is JWT

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| jwt | <code>String</code> | A JWT string |

<a name="messageToUniversalURI"></a>

## messageToUniversalURI(message) ⇒ <code>String</code>
Wrap a JWT in a request URI using the Universal Link scheme based at id.uport.me

**Kind**: global function  
**Returns**: <code>String</code> - A valid request URI, including the given request token  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>String</code> | A request message (JWT), or if given URI will just return |

<a name="messageToDeeplinkURI"></a>

## messageToDeeplinkURI(message, uri)
Wrap a JWT in a request URI using the Deeplink scheme, using me.uport:

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>String</code> | A request message (JWT) |
| uri | <code>String</code> | The associated deeplink uri for the given message |

<a name="messageToURI"></a>

## messageToURI(message, type)
Wrap a JWT in a request URI according to the specified scheme

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| message | <code>String</code> |  | The message to be uri encoded |
| type | <code>String</code> | <code>universal</code> | The URI method of the above two, either 'universal' or 'deeplink' |

