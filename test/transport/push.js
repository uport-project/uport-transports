let push = require('./../../src/transport/push.js')
const PUTUTU_URL = 'https://pututu.uport.me/api/v2/sns'
const sinon = require('sinon')
const proxyquire = require('proxyquire')
var chai = require('chai');
const expect = chai.expect
chai.use(require('sinon-chai'))
const encryptedMessage = {
    from: 'tmpFromKey',
    nonce: '0',
    ciphertext: 'ciphertext'
  }

// TODO there are already some good tests in uport-js, pull some of those in here after as well
// TODO remove redundant code
describe('transport.push', function () {

  describe('send()', function () {

    it('Requires a push token on configure', () => {
      expect(() => push.send(null, 'key')).to.throw(/push/)
    })

    it('Requires a public encryption key on configure', () => {
      expect(() => push.send('token', null)).to.throw(/key/)
    })

    it('Returns configured push function', () => {
      expect(push.send('token', 'key')).to.be.a('function')
    })
  })

  describe('send() Configured', function () {
    const send = push.send('token', 'key')

    it('Requires a URI request', () => {
      send(null).then(res => {
        throw new Error('push.send Promise resolved, expected it to reject')
      }, err => {
        expect(err).to.be.an('error');
      })
    })

    it('POST HTTP request to pushServiceUrl', () => {
      const nets = sinon.stub().callsFake((obj, cb) => {
        expect(obj.method).to.equal('POST')
        expect(obj.uri).to.equal(PUTUTU_URL)
        expect(obj.json).to.deep.equal({message: JSON.stringify(encryptedMessage)})
        cb(null, {statusCode: 200}, {message: {}})
      })
      const encryptMessage = sinon.stub().returns(encryptedMessage)
      const push = proxyquire( './../../src/transport/push.js', {
        'nets': nets,
        './../crypto/index.js': { encryptMessage }
      })
      const send = push.send('token', 'key')
      return send('request')
    })

    it('Resolves with response from push service, if successful (StatusCode: 200)', () => {
      const nets = sinon.stub().callsFake((obj, cb) => {
        cb(null, {statusCode: 200}, {message: 'response'})
      })
      const encryptMessage = sinon.stub().returns(encryptedMessage)
      const push = proxyquire( './../../src/transport/push.js', {
        'nets': nets,
        './../crypto/index.js': { encryptMessage }
      })
      const send = push.send('token', 'key')
      return send('request').then(res => {
        expect(res).to.deep.equal({message: 'response'})
      })
    })

    it('Rejects with error from push service, if error (StatusCode: 403)', () => {
      const nets = sinon.stub().callsFake((obj, cb) => {
        cb(null, {statusCode: 403}, {message: 'response'})
      })
      const encryptMessage = sinon.stub().returns(encryptedMessage)
      const push = proxyquire( './../../src/transport/push.js', {
        'nets': nets,
        './../crypto/index.js': { encryptMessage }
      })
      const send = push.send('token', 'key')
      return send('request').then(res => {
        throw new Error('push.send Promise resolved, expected it to reject')
      }, err => {
        expect(err).to.match(/Error sending/);
      })
    })

    it('Rejects with error from push service, if status code unknown', () => {
      const nets = sinon.stub().callsFake((obj, cb) => {
        cb(null, {statusCode: 1000}, {message: 'response'})
      })
      const encryptMessage = sinon.stub().returns(encryptedMessage)
      const push = proxyquire( './../../src/transport/push.js', {
        'nets': nets,
        './../crypto/index.js': { encryptMessage }
      })
      const send = push.send('token', 'key')
      return send('request').then(res => {
        throw new Error('push.send Promise resolved, expected it to reject')
      }, err => {
        expect(err).to.match(/Error sending/);
      })
    })
  })
})
