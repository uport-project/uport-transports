import { open, close, success, failure } from './ui'
import { paramsToQueryString } from '../message/util'
import { URIHandlerSend, CHASQUI_URL } from './messageServer'

const POLLING_INTERVAL = 2000

/**
  *  A QR tranpsort which uses our provide QR modal to relay a request to a uport client
  *
  *  @return   {Function}             a configured QRTransport Function
  *  @param    {String}       uri     a uport client request URI
  *  @return   {Function}             a function to close the QR modal
  */
export const send = (appName) => (uri, {cancel, introModal} = {}) => {
  uri = /callback_type=/.test(uri) ? uri : paramsToQueryString(uri, {callback_type: 'post'})
  open(uri, cancel, appName, introModal)
  return close
}

/**
  *  A QR Code and Chasqui Transport. The QR modal is configured for tranporting the request, while the
  *  response will be returned through Chasqui.
  *
  *  @param    {Object}       [config={}]      an optional config object
  *  @param    {String}       chasquiUrl       url of messaging server, defaults to Chasqui instance run by uPort
  *  @param    {String}       pollingInterval  milisecond interval at which the messaging server will be polled for a response
  *  @return   {Function}                      a configured QRTransport Function
  *  @param    {String}       uri              a uport client request URI
  *  @return   {Promise<Object, Error>}        a function to close the QR modal
  */
export const chasquiSend = ({chasquiUrl = CHASQUI_URL, pollingInterval = POLLING_INTERVAL, appName } = {}) => {
  const transport = URIHandlerSend(send(appName), {chasquiUrl, pollingInterval})
  return (uri, params) => transport(uri, params).then(res => {
    close()
    return res
  }, err => {
    close()
    throw new Error(err)
  })
}