import * as util from './../../src/message/util.js'
const sinon = require('sinon')
var chai = require('chai');
const expect = chai.expect
chai.use(require('sinon-chai'))

const request = 'https://id.uport.me/req/eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpYXQiOjE1Mjk5NTQxMjcsImV4cCI6MTUyOTk1NDcyNywicmVxdWVzdGVkIjpbIm5hbWUiLCJwaG9uZSIsImNvdW50cnkiXSwicGVybWlzc2lvbnMiOlsibm90aWZpY2F0aW9ucyJdLCJjYWxsYmFjayI6Imh0dHBzOi8vY2hhc3F1aS51cG9ydC5tZS9hcGkvdjEvdG9waWMvYVZLY0VkNWp6bm1Xc2xqMyIsInR5cGUiOiJzaGFyZVJlcSIsImlzcyI6ImRpZDp1cG9ydDoyb2VYdWZIR0RwVTUxYmZLQnNaRGR1N0plOXdlSjNyN3NWRyJ9.ISlUPHoqmGru_MfwjGzq1xxuTKeYIVr4V7g40HeUVsZ-j_gxOkJSzYsTd7AGpth-CwjaPmFLGXnyDG2aiE7NXA'

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
const callback_type = 'typeString'

// TODO make sure properly appended
describe('message.util', function () {

  describe('paramsToUrlFragment()', function () {
    it('Supports adding: data, id ', () => {
      const url = util.paramsToUrlFragment(request, {data, id})
      expect(url).to.match(/data=dataString/)
      expect(url).to.match(/id=idString/)
    })

    it('Adds url fragment params to urls with existing fragment params already', () => {
      const url = util.paramsToUrlFragment(request + '#id=idString', {data})
      expect(url).to.match(/&data=dataString/)
    })

    it('Adds url fragment params to urls that already have url query params ', () => {
      const url = util.paramsToUrlFragment(request, {data})
      expect(url).to.match(/#data=dataString/)
    })
  })

  describe('paramsToQueryString()', function () {

    it('Supports adding: value, function, bytecode, label, callback_url, redirect_url, client_id, network_id, gas, gasPrice, callback_type', () => {
      const url = util.paramsToQueryString(
        request,
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
          callback_type})
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
      expect(url).to.match(/&callback_type=typeString/)

    })

    it('Adds query params to urls with existing params already', () => {
      const url = util.paramsToQueryString(request + '?callback_type=redirect', {callback_url: 'callback_urlString'})
      expect(url).to.match(/&callback_url=callback_urlString/)
    })

    it('Adds query params to urls that already have url fragments ', () => {
      const url = util.paramsToQueryString(request + '#id=idString', {callback_url: 'callback_urlString'})
      expect(url).to.match(/\?callback_url=callback_urlString#id=idString/)
    })

    it('Adds query params to urls that already have url fragments and query params', () => {
      const url = util.paramsToQueryString(request + '?callback_type=redirect#id=idString', {callback_url: 'callback_urlString'})
      expect(url).to.match(/&callback_url=callback_urlString#id=idString/)
    })
  })
})
