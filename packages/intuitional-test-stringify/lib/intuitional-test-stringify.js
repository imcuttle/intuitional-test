'use strict'

module.exports = intuitionalTestStringify

function intuitionalTestStringify(ast, { stringify = 'assert', ...options } = {}) {
  if (!!stringify && typeof stringify === 'string') {
    try {
      stringify = require(`./stringify/${stringify}`)
    } catch (e) {
      if (e.code === 'MODULE_NOT_FOUND') {
        stringify = require(stringify)
      } else {
        throw e
      }
    }
  }

  return stringify(ast, options)
}
