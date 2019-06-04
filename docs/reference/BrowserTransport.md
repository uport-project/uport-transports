<a name="BrowserTransport"></a>

## BrowserTransport
**Kind**: global class  

* [BrowserTransport](#BrowserTransport)
    * [new BrowserTransport()](#new_BrowserTransport_new)
    * [.getIsMobile()](#BrowserTransport+getIsMobile) ⇒ <code>Boolean</code>
    * [.getCallbackUrl(id)](#BrowserTransport+getCallbackUrl) ⇒ <code>String</code>
    * [.getPushInfo()](#BrowserTransport+getPushInfo) ⇒ <code>Object</code>
    * [.setPushInfo(pushToken, publicEncKey)](#BrowserTransport+setPushInfo)
    * [.onResponse(id)](#BrowserTransport+onResponse) ⇒ <code>Promise</code>
    * [.send(request, id, [opts], [cancel])](#BrowserTransport+send)
    * [.mobileSend(request, id, [opts])](#BrowserTransport+mobileSend)
    * [.pushSend(request, id)](#BrowserTransport+pushSend)
    * [.qrSend(request, id, [opts], [cancel])](#BrowserTransport+qrSend)

<a name="new_BrowserTransport_new"></a>

### new BrowserTransport()
Instantiates a new Browser Transport


| Param | Type | Description |
| --- | --- | --- |
| [opts.pushToken] | <code>String</code> | A user's push token containing an endpoint for sending notifications |
| [opts.publicEncKey] | <code>String</code> | A user's public key for encrypting messages pushed to them |
| [opts.qrTitle] | <code>String</code> | Title text that appears in the QR modal |

<a name="BrowserTransport+getIsMobile"></a>

### browserTransport.getIsMobile() ⇒ <code>Boolean</code>
**Kind**: instance method of [<code>BrowserTransport</code>](#BrowserTransport)  
**Returns**: <code>Boolean</code> - true if detected as running on a mobile device  
<a name="BrowserTransport+getCallbackUrl"></a>

### browserTransport.getCallbackUrl(id) ⇒ <code>String</code>
Generates a callbackUrl that can be used to create a request which will return its response to this application

**Kind**: instance method of [<code>BrowserTransport</code>](#BrowserTransport)  
**Returns**: <code>String</code> - a url that can be used as the callbackUrl option when creating a request with uport-credentials  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | id that will be used when sending the request that will contain this callback url |

<a name="BrowserTransport+getPushInfo"></a>

### browserTransport.getPushInfo() ⇒ <code>Object</code>
**Kind**: instance method of [<code>BrowserTransport</code>](#BrowserTransport)  
**Returns**: <code>Object</code> - object containing the currently configured pushToken and publicEncKey  
<a name="BrowserTransport+setPushInfo"></a>

### browserTransport.setPushInfo(pushToken, publicEncKey)
Provide a user's push token and public encryption key to enable the configuration of a push transport

**Kind**: instance method of [<code>BrowserTransport</code>](#BrowserTransport)  

| Param | Type | Description |
| --- | --- | --- |
| pushToken | <code>String</code> | A user's push token containing an endpoint for sending notifications |
| publicEncKey | <code>String</code> | A user's public key for encrypting messages pushed to them |

<a name="BrowserTransport+onResponse"></a>

### browserTransport.onResponse(id) ⇒ <code>Promise</code>
Listens for responses to requests made by calling `send`. Returns a promise that resolves once with the resopnse.

**Kind**: instance method of [<code>BrowserTransport</code>](#BrowserTransport)  
**Returns**: <code>Promise</code> - resolves a response object with { payload, data } containing the jwt and extra optional data  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | id of the request that that we are listening for |

<a name="BrowserTransport+send"></a>

### browserTransport.send(request, id, [opts], [cancel])
Sends a message by automatically selecting an appropriate transport

**Kind**: instance method of [<code>BrowserTransport</code>](#BrowserTransport)  

| Param | Type | Description |
| --- | --- | --- |
| request | <code>String</code> | request message to send |
| id | <code>String</code> | id of the request that will be used to identify the response |
| [opts] | <code>Object</code> | optional parameters for each transport |
| [opts.data] | <code>String</code> | additional application data that can be included as part of the response |
| [opts.redirectUrl] | <code>String</code> | url to send the response to |
| [opts.type] | <code>String</code> | specifies callback type 'post' or 'redirect' for response |
| [cancel] | <code>function</code> | called when user closes the QR modal |

<a name="BrowserTransport+mobileSend"></a>

### browserTransport.mobileSend(request, id, [opts])
Sends a message using URL transport.

**Kind**: instance method of [<code>BrowserTransport</code>](#BrowserTransport)  

| Param | Type | Description |
| --- | --- | --- |
| request | <code>String</code> | request message to send |
| id | <code>String</code> | id of the request that will be used to associate the response |
| [opts] | <code>Object</code> | optional parameters specific to url transport |
| [opts.data] | <code>String</code> | additional application data that can be included as part of the response |
| [opts.redirectUrl] | <code>String</code> | url to send the response to |
| [opts.type] | <code>String</code> | specifies callback type 'post' or 'redirect' for response |

<a name="BrowserTransport+pushSend"></a>

### browserTransport.pushSend(request, id)
Sends a message using push transport.

**Kind**: instance method of [<code>BrowserTransport</code>](#BrowserTransport)  

| Param | Type | Description |
| --- | --- | --- |
| request | <code>String</code> | request message to send |
| id | <code>String</code> | id of the request that will be used to identify the response |

<a name="BrowserTransport+qrSend"></a>

### browserTransport.qrSend(request, id, [opts], [cancel])
Sends a message using a qr transport

**Kind**: instance method of [<code>BrowserTransport</code>](#BrowserTransport)  

| Param | Type | Description |
| --- | --- | --- |
| request | <code>String</code> | request message to send |
| id | <code>String</code> | id of the request that will be used to identify the response |
| [opts] | <code>Object</code> | optional parameters specific to qr transport |
| [cancel] | <code>function</code> | called when user closes the QR modal |

