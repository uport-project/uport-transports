import * as transport from './transport'
import * as helpers from './helpers'
import * as network from './network'

/**
 * Compose a list of arbitrary functions, returning a function which applies them
 * each to a single argument in reverse order.
 * @param   {...Function} fns A comma-separated list of functions
 * @returns {Function}
 */
const compose = (...fns) => arg => fns.reduceRight((val, fn) => fn(val), arg)

export { compose, helpers, transport, network }