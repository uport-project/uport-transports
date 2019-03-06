# State of transports refactor

## What is this document?
As I am preparing to leave uPort, it is important that I pass off any unfinished work, and document its goals and approaches, to ensure that information is not lost.  This document in particular describes the work I have been doing to refactor the uport-transports library, why the refactor was necessary, what has been completed, what bugs remain, and how it differs from the previous version.

## Why refactor?
The previous (currently published `@0.2.x`) version of `uport-transports` had an inconsistent and confusingly defined API.  Similarly it mixed several concerns, including ui, uport-specific contract addresses and configuration constants, crypto utilities, and message formatting functions.

In particular, the public api included multiple different functions with the name `send`, none of which in fact *sent* anything, but rather returned functions that did the actual sending.  Additionally, sending and receiving messages were tightly coupled in the exported api; that is, the primary functions like `transport.qr.chasquiSend` and `transport.push.sendAndNotify` combined sending messages, listening for messages, and UI components in a single function.  Since this library is intended to be developer-friendly building blocks for customizing data flow among servers, clients, and mobile devices, more flexibility was needed, and the names of functions should reflect that.

Similarly, the UI components manipulated by transports should be extracted into their own library; a server needing to issue credentials directly to a mobile app should have no need for code that manipulates html elements, and calls browser api functions.  Similarly, some applications may wish to borrow uport ui functions without including the full gamut of transport functionality.

While these concerns are enough to warrant a refactor on their own, there was also a specific bug which made a refactor more urgent: the transport between mobile applications and browsers relied on the portion of the URL following the hash (`#`), indicating navigation local to a single page, which is global state, and can not be safely used by our libraries.  In particular, popular hash-based routing schemes used by libraries like `react-router` would break when hash params were manipulated by our library. Using URL query parameters is also unacceptable, as any change to them is interpretted as a navigation event, and will cause a page reload.  Leaving a massive JWT in the URL bar is an antipattern for the appearance of security, and similarly will be sent to servers, which may be undesirable for our privacy-conscious audience.  As other, more general transports can be used in its place, this transport was deprecated, and its immediate removal was recommended.

## Goals
The general refactor goals were the following:
- Clearly define the roles of the library, and simplify the exposed API
- Employ consistent and intuitive naming of all functions, naming similar functions analogously wherever possible
- Extract UI-manipulation functions to a separate library
- Distinguish between `transports` and `helpers`, and don't mix concerns between the two
  - Transports should accomplish a singular purpose of either *sending* or *listening for* data.  Nothing should happen to a message which is passed to a configured transport to be sent, and messages received from a listener transport will be received unaltered.
  - Other transformations of data, such as encryption/decryption, message formatting, or compression, are the roles of **helpers** and not **transports**.
  - Helper transformations should be composable and invertable. A composition of helpers `T`=`A->B->C` should have a corresponding set of helpers `T'`=`C'->B'->A'`, such that `T->T'` = `I`, where `I` is the identity transformation.
- The above bug in transports between a native application and mobile browser on the same device

## Current State
There are four different sets of transports currently supported, each consisting of a *sender* and a *listener*, and some additionally requiring that a *session* be negotiated before messages can be sent or received. These transports are:

- **QR**
  - A visual message transmission via QR codes that are displayed and scanned
- **Pubsub**
  - Message transmission via an HTTP "bridge" server, which can support many different "topics" with independent CRUD support
- **SNS Push**
  - Message transmission via an SNS server, which accepts `POST`s to send, and delivers push notifications to mobile devices
- **URL (deep link/universal link)**
  - A transport from a browser, to a native application on the same device, allowing one application to open another.

One transport has also been deprecated:
- Redirect URL with hash parameters, for communication from a native app to a browser on the same device

### Sessions
The refactor made explicit the previously hidden concept of a transport session.  We define *session* as a set of shared state between two devices that are communicating, that must already be shared before messages can be exchanged.  Session state exists mostly for the http pubsub transport, in which there must be a commonly known topic url on which the sender and listener can communicate. Similarly the push transport requires a permission-granting "push token", and is traditionally used with end-to-end encryption, which requires advanced knowledge of a shared symmetric encryption key, or the public assymetric encryption key of the recipient.

In contrast, the url and qr transports require no session negotiation, as an unencrypted QR requires no advanced knowledge of its recipient to be displayed, and the same is true for a deep/universal link containing a message jwt.

An open question is how such session information should be communicated in the messages to be transported. The pattern of moving from a higher friction, lower security, sessionless transport, to a higher security, lower friction, session-based transport repeats itself in many places across our architecture, but is mostly accomplished ad-hoc, with necessary pieces of session information passed in unrelated keys of a message jwt.  While the refactor attempts to make this issue more clear and intuitive, it is far from solved, and additional effort into unifying/clarifying session information within messages is needed.

### Uport Connect
A necessary consequence of this refactor is re-expressing the logic of `uport-connect` to take advantage of these new transports.  In the `feat/remove-url-transport` branch of connect, there is a nearly-working implementation of the library using the new transports, with greatly simplified transport logic.  The custom opaque functions previously used by connect (i.e. `connectTransport()` and `pushTransport()`) are no longer necessary, as the separation of senders and listeners in the underlying library has reduced the number of special cases and configuration overrides that are necessary for the `uport-connect` use-case.

To keep track of multiple potential requests, using different session parameters on the same transport, a dictionary was added to the `localStorage`-backed `Connect.state`, allowing session information to persist across a page reload, and support mobile browsers. Specifically, only urls for pubsub (chasqui) transports are saved.  Session information of this kind is valid only for a single message, and so the `onResponse` handler also removes the cached session url for that request id.

### Chasqui
The remaining issue in this implementation stems from the session concept, and the (lack of) support in our chasqui bridge server.  A change was made in November of 2018 to allow chasqui to accept a `POST` request to the `/topic/` path, with no specified id, to which chasqui would respond with a `201 Created` status, with the newly created topic url in the `Location` header of the response.  As this was never put into production, it has not been tested in an integration, and is currently returning `5xx` responses rather than `201`s.

## Future Vision
Both after the current refactor and previously, the mobile app does not explicitly depend on the `uport-transports` library, but rather implements ad-hoc, transport-like functions which can communicate with those defined in `uport-transports`.  These transports include
- A QR *listener*, which uses the camera to read QR codes, and receive messages that way
- A push *listener*, which (with user permission) can receive push notifications sent via a SNS service
- A url *listener*, which consists of a deep/universal link scheme, by which urls (containing message data) opened on a mobile browser can be opened by the mobile app
- A pubsub *sender*, which is simply a http client which can `POST` to a specified url

When the mobile app shares the transport architecture, it will be easier to reason about the way that the mobile app dispatches behavior in response to messages, and we will have many more examples of succesful integrations with `uport-transports`.


