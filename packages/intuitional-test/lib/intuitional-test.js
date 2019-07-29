'use strict'

const parse = require('intuitional-test-parse')
const stringify = require('intuitional-test-stringify')

module.exports = intuitionalTest
module.exports.parse = parse
module.exports.stringify = stringify

function intuitionalTest(code, { parseOptions, stringifyOptions, ...options } = {}) {
  return stringify(parse(code, { ...options, parseOptions }), { ...options, stringifyOptions })
}
