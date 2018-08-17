---
title: "Uport Transports"
index: 5
category: "reference"
type: "content"
---



## Classes

<dl>
<dt><a href="#UportSubprovider">UportSubprovider</a></dt>
<dd><p>A web3 style provider which can easily be wrapped with uPort functionality.
 Builds on a base provider. Used in Connect to wrap a provider with uPort specific
 functionality.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#randomString">randomString(length)</a> ⇒ <code>String</code></dt>
<dd><p>Given a length, returns a random string of that length</p>
</dd>
<dt><a href="#decryptResponse">decryptResponse(encrypted, secretKey)</a> ⇒ <code>Promise.&lt;Object, Error&gt;</code></dt>
<dd><p>Decrypts a response from a promise. This is intended to be used to wrap the response from Chasqui or other transport</p>
</dd>
</dl>

<a name="UportSubprovider"></a>

## UportSubprovider
A web3 style provider which can easily be wrapped with uPort functionality.
 Builds on a base provider. Used in Connect to wrap a provider with uPort specific
 functionality.

**Kind**: global class  

* [UportSubprovider](#UportSubprovider)
    * [new UportSubprovider(args)](#new_UportSubprovider_new)
    * [.send()](#UportSubprovider+send)
    * [.sendAsync(payload, callback)](#UportSubprovider+sendAsync)

<a name="new_UportSubprovider_new"></a>

### new UportSubprovider(args)
Instantiates a new wrapped provider


| Param | Type | Description |
| --- | --- | --- |
| args | <code>Object</code> | required arguments |
| args.requestAddress | <code>function</code> | function to get the address of a uPort identity. |
| args.sendTransaction | <code>function</code> | function to handle passing transaction information to a uPort application |
| args.provider | <code>Object</code> | a web3 sytle provider |

<a name="UportSubprovider+send"></a>

### uportSubprovider.send()
Synchronous functionality not supported

**Kind**: instance method of <code>[UportSubprovider](#UportSubprovider)</code>  
<a name="UportSubprovider+sendAsync"></a>

### uportSubprovider.sendAsync(payload, callback)
Overrides sendAsync to caputure the following RPC calls eth_coinbase, eth_accounts,
 and eth_sendTransaction. All other calls are passed to the based provider.
 eth_coinbase, eth_accounts will get a uPort identity address with getAddress.
 While eth_sendTransaction with send transactions to a uPort app with sendTransaction

**Kind**: instance method of <code>[UportSubprovider](#UportSubprovider)</code>  

| Param | Type | Description |
| --- | --- | --- |
| payload | <code>Any</code> | request payload |
| callback | <code>function</code> | called with response or error |

<a name="randomString"></a>

## randomString(length) ⇒ <code>String</code>
Given a length, returns a random string of that length

**Kind**: global function  
**Returns**: <code>String</code> - random string  

| Param | Type | Description |
| --- | --- | --- |
| length | <code>Integer</code> | specify length of string returned |

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

