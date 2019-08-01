'use strict'
const { createTransformer } = require('intuitional-test-babel-jest')

module.exports = index

function index(options) {
  const process = createTransformer(options).process
  return (src, { filename }) => {
    const result = process(src, filename)
    if (typeof result === 'string') {
      return result
    }

    return result && result.code
  }
}
