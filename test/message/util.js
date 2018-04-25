import * as util from './../../src/message/util.js'
const sinon = require('sinon')
var chai = require('chai');
const expect = chai.expect
chai.use(require('sinon-chai'))

const unsignedRequest = `https://id.uport.me/me`
const signedRequest = `https://id.uport.me/me?requestToken=eyJ0eXAiOiJK`
const data = 'dataString'
const id = 'idString'
const value = 'valueString'
const bytecode = 'bytecodeString'
const label = 'labelString'
const callback_url = 'callback_urlString'
const redirect_url = 'redirect_urlString'
const client_id = 'client_idString'
const network_id = 'network_idString'
const gas = 'gasString'
const gasPrice = 'gasPriceString'
const type = 'typeString'

// TODO make sure properly appended
describe('message.util', function () {

  describe('paramsToUrlFragment()', function () {
    it('Supports adding: data, id ', () => {
      const url = util.paramsToUrlFragment(unsignedRequest, {data, id})
      expect(url).to.match(/data=dataString/)
      expect(url).to.match(/id=idString/)
    })

    it('Adds url fragment params to urls with existing fragment params already', () => {
      const url = util.paramsToUrlFragment(unsignedRequest + '#id=idString', {data})
      expect(url).to.match(/&data=dataString/)
    })

    it('Adds url fragment params to urls that already have url query params ', () => {
      const url = util.paramsToUrlFragment(signedRequest, {data})
      expect(url).to.match(/requestToken=eyJ0eXAiOiJK#data=dataString/)
    })
  })

  describe('paramsToQueryString()', function () {

    it('Supports adding: value, function, bytecode, label, callback_url, redirect_url, client_id, network_id, gas, gasPrice, type', () => {
      const url = util.paramsToQueryString(
        unsignedRequest,
        { value,
          function: 'functionString',
          bytecode,
          label,
          callback_url,
          redirect_url,
          client_id,
          network_id,
          gas,
          gasPrice,
          type })
      expect(url).to.match(/\?value=valueString/)
      expect(url).to.match(/&function=functionString/)
      expect(url).to.match(/&bytecode=bytecodeString/)
      expect(url).to.match(/&label=labelString/)
      expect(url).to.match(/&callback_url=callback_urlString/)
      expect(url).to.match(/&redirect_url=redirect_urlString/)
      expect(url).to.match(/&client_id=client_idString/)
      expect(url).to.match(/&network_id=network_idString/)
      expect(url).to.match(/&gas=gasString/)
      expect(url).to.match(/&gasPrice=gasPriceString/)
      expect(url).to.match(/&type=typeString/)

    })

    it('Adds query params to urls with existing params already', () => {
      const url = util.paramsToQueryString(unsignedRequest + '?type=typeString', {callback_url: 'callback_urlString'})
      expect(url).to.match(/&callback_url=callback_urlString/)
    })

    it('Adds query params to urls that already have url fragments ', () => {
      const url = util.paramsToQueryString(unsignedRequest + '#id=idString', {callback_url: 'callback_urlString'})
      expect(url).to.match(/\?callback_url=callback_urlString#id=idString/)
    })

    it('Adds query params to urls that already have url fragments and query params', () => {
      const url = util.paramsToQueryString(signedRequest + '#id=idString', {callback_url: 'callback_urlString'})
      expect(url).to.match(/&callback_url=callback_urlString#id=idString/)
    })
  })
})
