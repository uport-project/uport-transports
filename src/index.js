import * as transport from './transport'
import * as helpers from './helpers'
import * as network from './network'

export { helpers, transport, network }

const compose = (...fns) => msg => fns.reduce((x, fn) => fn(x), msg)

compose(helpers.messageToUri, push.createSender())
compose(push.createListener(), helpers.uriToMessage)