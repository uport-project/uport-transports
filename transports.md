## Transports

Transports exist to ferry messages between clients implementing the uPort protocol.  Successfully transporting a message requires cooperation between the two clients: the messaging client needs to *send* it, and the receiving client needs to be *listening* for it.  More specifically, the receiving client needs to *listen* in such a way that when a message is *sent*, it will register in the listener, allowing the message to be handled.  This is important as there are many ways to send a message, and many ways to listen for one, and listening for a message in a way that is not compatible with how it is sent will not result in a successful transfer.

Every type of transport must have two corresponding functions: a sender, and a listener.  There may be multiple implementations of each for a particular type of transport, depending on the environment hosting the client (e.g., a desktop and mobile device may both be able to scan a QR code, but they must access different devices to do so).  Similarly, a particular class of transport may be parameterized along an arbitrary number of dimensions; for example a HTTP pubsub (polling) transport is parameterized by the URL being polled, and perhaps also by the HTTP verb and headers included in the polling requests.

While each transport may have many unrelated parameters, we would like the ultimate transport API to be as simple as possible, so any transport-specific paramters must be abstracted away.  To accomplish this, we architect each end of a transport (both the listener and the sender) as a functor, which accepts any necessary parameters to disambiguate the transport, and returns a function with a consistent API.  In particular, we define the API of senders and receivers as follows:

```javascript
type Message = String; // a JWT

// SENDER:   
Message => Promise<(), Error>

// LISTENER: 
() => Promise<Message, Error>
```

### Requests and Responses
To the transport layer, there is not a meaningful difference between a request and a response.  For a single client, sending a request message and expecting a response will require that the requester also set up a listener for the response.  Because of this common request and response pattern, it can be tempting to distinguish between "request transports" or "response transports".  In a world where only particular types of clients can request, and a different type can respond, this distinction overlaps with the need to differentiate between the transport capabilities of each client's environment.  However, to allow all possible clients to be able to communicate with one another on their own terms, we leave the semantics of a request and a response to the message layer, and as far as transports are concerned, we only separate sending from receiving.

### Session information
Related to the above, some transports require that the sender and receiver have some amount of shared context (e.g. symmetric encryption keys, pubsub url) or that the sender knows some locating information about the receiver (e.g. authentication token, address, assymetric encryption key).  These are the degrees of freedom on which individual transports can vary, and some transports may require some prior communication before they can be used.  This information can be exchanged in messages sent via a less restrictive, more cumbersome transport, and use the new shared context to set up a more efficient transport for future messages.

### Composition
Some elements of transport logic may be repeated in different functions, and can be factored out into reusable adapters.  An immediate inclination is that transports should be composable functions, which can be fed into each other in arbitrary combinations in order to augment a transport with a new functionality.  An example would be encryption: an HTTP pubsub can be done with encrypted or unencrypted data, while the underlying mechanics of the send and receive operations remain the same.

Note that an encrypted payload is different from an unencrypted JWT, and so listener code that expects a JWT will fail if it receives an encrypted payload, and must be preceded by a decription step, which must be completed on the receiving device.  Thus rather than composing transport functions with each other, we can plug complementary adapters into the send and receive ends.  For example, adding compression is a matter of adding a compressor to the sender, and a decompressor to the receiver; encryption follows by analogy.  

While the ultimate input of a send transport must still be an interprable message JWT, and the ultimate output of the receive transport the same, we can define a set of composable, invertable transformations of a less sepcific data type that can be chained together to add functionality to a particular transport path.  Our library of transport building blocks then consists of two types of functions: *endpoints*, and *adapters*.  Endpoints deliver or fetch arbitrary data to or from a location external to the current execution context.

### Creating Transports

With the concepts of *adapters* and *endpoints* defined, we can re-express our sender and receiver types as a series of adapters either beggining or ending with an endpoint, respectively.  To better enable this, we can create transports with a *pipe*; or a function which composes a list of functions (from left to right).

```javascript
// Create a sender
const send = createSender([
  encrypt,    // Adapter  String => String
  compress,   // Adapter  String => String
  encodeQR,   // Adapter  String => String
  displayQR   // Endpoint String => ()
])

send(message).catch()

// Create a receiver
const recv = createReceiver([
  decrypt,    // Endpoint () => String
  decompress, // Adapter  String => String
  decodeQR,   // Adapter  String => String
  scanQR      // Adapter  String => String (JWT)
])

recv().then(message => {})
```

### Pairing request and response transports