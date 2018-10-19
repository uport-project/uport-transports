---
title: "Uport Transports"
index: 0
category: "uport-transports"
type: "landing"
source: "https://github.com/uport-project/uport-transports/blob/develop/docs/index.md"
---

# uPort Transports

### Connect Users to a uPort Client

uPort is a self-sovereign digital identity platform—anchored on the Ethereum blockchain. The uPort technology primarily consists of smart contracts, developer libraries, and a mobile app. uPort identities are fully owned and controlled by the creator—independent of centralized third-parties for creation, control or validation.

uPort Transports allows you to:

-   Send messages to users using a QR code

-   Send requests and receive responses through URLs

-   Send encrypted push notifications

-   Create Transports specific to your use case and environment

The uport-transports library is comprised of a loosely coupled collection of functions called transports&mdash;used to set up communication channels between an app and a client; additionally, a set of transport-related utility functions are also available in this library.

Transports are simply functions that consume: request messages, and some transport params&mdash;before sending these request strings to a uPort client. Some transports will also handle receiving a response to a given request. Many of these functions can be combined to create transports specific to your use case and environment. You can then use these transports in[  uport-connect](https://github.com/uport-project/uport-connect) or use them in combination with message creation in[  uport-credentials](https://github.com/uport-project/uport-credentials).

Besides the primary transports provided, there are a number of smaller composable functions available to build your own transports for different needs. As we collectively build more transports&mdash;with your help&mdash;for differing communication channels and differing uPort clients, they will be added to uport-transports.
