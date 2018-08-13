require('babel-register')
require.extensions['.css'] = () => {};
require.extensions['.svg'] = () => {};

require('./transport/index.js')
require('./message/index.js')
require('./crypto-test.js')
