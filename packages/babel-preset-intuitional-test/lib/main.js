'use strict'

module.exports = main

function main(context, { parseOptions, stringifyOptions, ...options } = {}) {
  // TODO

  return {
    plugins: [
      [require('babel-plugin-intuitional-test-parse'), { ...options, ...parseOptions }],
      [require('babel-plugin-intuitional-test-stringify'), { ...options, ...stringifyOptions }]
    ]
  }
}
