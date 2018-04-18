# uport-core

### Modules

#### `Transport`

- ##### Transport with Message Service Chasqui

  - `uport.transport.URIHandlerChasquiTransport()`
  - `uport.transport.QRChasquiTransport()`

- ##### Push Notifications

  - `uport.transport.pushNotificationTransport()`

- ##### Transport Mobile Browser to uPort Client

    - `uport.transport.MobileTransport()`

- ##### Get responses in URL

    - `uport.transport.getMobileResponse()`
    - `uport.transport.onMobileResponse()`
    - `uport.transport.listenMobileResponse()`

- ##### Transport Helpers

    - `uport.transport.poll()`
    - `uport.transport.pollChasqui()`

#### `QR`

  - `uport.QR.getQRDataURI()`
  - `uport.QR.openQr()`
  - `uport.QR.closeQr()`
  - `uport.QR.uportQRDisplay()`

#### `Util`

  Some functions could be moved to collection of utils, as well as other util/helper funcs exported here
