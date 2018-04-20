# uport-core-js

### Modules

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

- ##### Crypto

    - `uport.transport.crypto.encryptMessage()`
    - `uport.transport.crypto.randomString()`

- ##### Poll

    - `uport.transport.poll()`

#### `Message`

  - ##### Util

    - `uport.message.util.paramsToUrlFragment()`
    - `uport.messasge.util.paramsToQueryString()`
